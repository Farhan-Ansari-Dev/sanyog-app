const { S3Client, HeadBucketCommand, PutObjectCommand } = require('@aws-sdk/client-s3');

const region = process.env.AWS_REGION || 'us-east-1';
const bucket = process.env.AWS_BUCKET_NAME || 'sanyogconformity-documents';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

console.log('--- S3 Diagnostic ---');
console.log('Region:', region);
console.log('Bucket:', bucket);
console.log('Has Access Key:', !!accessKeyId);
console.log('Has Secret Key:', !!secretAccessKey);

(async () => {
  try {
    const config = { region };
    if (accessKeyId && secretAccessKey) {
      config.credentials = { accessKeyId, secretAccessKey };
    }
    const client = new S3Client(config);
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
    console.log('SUCCESS: S3 bucket is accessible!');

    // Test upload
    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: 'test/connectivity-check.txt',
      Body: Buffer.from('ping'),
      ContentType: 'text/plain',
    }));
    console.log('SUCCESS: Test file uploaded to S3!');
  } catch (e) {
    console.error('ERROR:', e.name, e.message);
    if (e.name === 'NoSuchBucket') console.error('Bucket does not exist!');
    if (e.name === 'AccessDenied') console.error('Access denied – check IAM permissions.');
    if (e.name === 'CredentialsProviderError') console.error('No valid credentials found.');
  }
})();
