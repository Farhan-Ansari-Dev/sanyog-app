const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function getStorageMode() {
  return (process.env.STORAGE_PROVIDER || 'local').toLowerCase();
}

function sanitizeFilename(name) {
  return String(name || 'file').replace(/[^a-zA-Z0-9._-]/g, '_');
}

function sanitizePathPrefix(prefix) {
  return String(prefix || '')
    .split('/')
    .filter(Boolean)
    .map((seg) => seg.replace(/[^a-zA-Z0-9._-]/g, '_'))
    .join('/');
}

function buildObjectKey({ keyPrefix, originalName }) {
  const safe = sanitizeFilename(originalName);
  const prefix = sanitizePathPrefix(keyPrefix) || 'uploads';
  const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  return `${prefix}/${id}_${safe}`;
}

function getS3Env() {
  // Support both S3_* (repo default) and AWS_* (common naming)
  const region = process.env.S3_REGION || process.env.AWS_REGION;
  const bucket = process.env.S3_BUCKET || process.env.AWS_BUCKET_NAME;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
  const endpoint = process.env.S3_ENDPOINT || process.env.AWS_S3_ENDPOINT;
  const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL || process.env.AWS_S3_PUBLIC_BASE_URL;

  if (!bucket || !region) {
    throw new Error('Missing S3 env vars: AWS_REGION and AWS_BUCKET_NAME are required');
  }

  return { region, bucket, accessKeyId, secretAccessKey, endpoint, publicBaseUrl };
}

async function saveLocal({ buffer, originalName, keyPrefix }) {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  await fs.promises.mkdir(uploadsDir, { recursive: true });

  const key = buildObjectKey({ keyPrefix, originalName });
  const full = path.join(uploadsDir, ...key.split('/'));
  await fs.promises.mkdir(path.dirname(full), { recursive: true });
  await fs.promises.writeFile(full, buffer);

  return {
    storageProvider: 'local',
    storageKey: key,
    publicUrl: `/uploads/${key}`,
  };
}

async function saveS3({ buffer, mimeType, originalName, keyPrefix }) {
  const { region, bucket, accessKeyId, secretAccessKey, endpoint, publicBaseUrl } = getS3Env();

  const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

  const hasStaticCreds = Boolean(accessKeyId && secretAccessKey);
  console.log(
    `[storage:s3] bucket=${bucket} region=${region} endpoint=${endpoint ? 'custom' : 'aws'} staticCreds=${hasStaticCreds}`
  );

  const clientConfig = {
    region,
    endpoint: endpoint || undefined,
    forcePathStyle: Boolean(endpoint),
  };

  // If explicit keys are provided, use them; otherwise rely on AWS SDK default chain
  // (env/shared config/EC2 instance profile/etc.) for production safety.
  if (hasStaticCreds) {
    clientConfig.credentials = { accessKeyId, secretAccessKey };
  }

  const client = new S3Client(clientConfig);

  const key = buildObjectKey({ keyPrefix, originalName });

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    })
  );

  const publicUrl = publicBaseUrl ? `${publicBaseUrl.replace(/\/$/, '')}/${key}` : key;

  return {
    storageProvider: 's3',
    storageKey: key,
    publicUrl,
  };
}

async function saveUploadedFile({ buffer, mimeType, originalName, keyPrefix }) {
  const mode = getStorageMode();
  if (mode === 's3') {
    return saveS3({ buffer, mimeType, originalName, keyPrefix });
  }
  return saveLocal({ buffer, originalName, mimeType, keyPrefix });
}

module.exports = { saveUploadedFile, getStorageMode };
