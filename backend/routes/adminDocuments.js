const router = require('express').Router();

const { GetObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const Document = require('../models/Document');
const { adminAuth, requireRole } = require('../middleware/adminAuth');

function getS3Env() {
  // Support both the repo's S3_* vars and AWS_* vars (common naming).
  const region = process.env.S3_REGION || process.env.AWS_REGION;
  const bucket = process.env.S3_BUCKET || process.env.AWS_BUCKET_NAME;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
  const endpoint = process.env.S3_ENDPOINT || process.env.AWS_S3_ENDPOINT;

  if (!region || !bucket) {
    throw new Error('Missing S3 env vars: AWS_REGION and AWS_BUCKET_NAME are required');
  }

  return { region, bucket, accessKeyId, secretAccessKey, endpoint };
}

router.get('/:id/signed-url', adminAuth, requireRole(['admin', 'ops', 'viewer']), async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  if (doc.storageProvider === 'local') {
    const base = `${req.protocol}://${req.get('host')}`;
    return res.json({
      url: doc.publicUrl?.startsWith('http') ? doc.publicUrl : `${base}${doc.publicUrl}`,
      expiresInSeconds: null,
    });
  }

  try {
    const { region, bucket, accessKeyId, secretAccessKey, endpoint } = getS3Env();

    const clientConfig = {
      region,
      endpoint: endpoint || undefined,
      forcePathStyle: Boolean(endpoint),
    };

    // Use explicit credentials if provided; otherwise fall back to AWS default chain
    // (env/shared config/EC2 instance profile/etc.).
    if (accessKeyId && secretAccessKey) {
      clientConfig.credentials = { accessKeyId, secretAccessKey };
    }

    const s3 = new S3Client(clientConfig);

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: doc.storageKey,
      ResponseContentDisposition: `inline; filename="${encodeURIComponent(doc.originalName)}"`,
    });

    const expiresInSeconds = 300;
    const url = await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });

    return res.json({ url, expiresInSeconds });
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Failed to create signed URL' });
  }
});

module.exports = router;
