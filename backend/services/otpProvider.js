const twilio = require('twilio');

function normalizeIndianMobile(mobile) {
  const trimmed = String(mobile || '').trim();
  const digits = trimmed.replace(/[^0-9+]/g, '');
  if (digits.startsWith('+')) return digits;
  // assume Indian 10-digit
  if (/^\d{10}$/.test(digits)) return `+91${digits}`;
  return digits;
}

function createOtpProvider() {
  const provider = (process.env.OTP_PROVIDER || 'mock').toLowerCase();

  if (provider === 'msg91_otp') {
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;
    if (!authKey || !templateId) {
      throw new Error('Missing MSG91_AUTH_KEY or MSG91_TEMPLATE_ID');
    }

    const base = process.env.MSG91_BASE_URL || 'https://api.msg91.com/api/v5/otp';

    return {
      async sendOtp(mobile) {
        const to = normalizeIndianMobile(mobile).replace('+', ''); // MSG91 expects countrycode+number without + in many setups
        const url = `${base}?template_id=${encodeURIComponent(templateId)}&mobile=${encodeURIComponent(to)}&authkey=${encodeURIComponent(authKey)}`;
        const resp = await fetch(url, { method: 'GET' });
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(`MSG91 send OTP failed: ${resp.status} ${text}`);
        }
      },
      async verifyOtp(mobile, code) {
        const to = normalizeIndianMobile(mobile).replace('+', '');
        const url = `${base}/verify?mobile=${encodeURIComponent(to)}&otp=${encodeURIComponent(code)}&authkey=${encodeURIComponent(authKey)}`;
        const resp = await fetch(url, { method: 'GET' });
        if (!resp.ok) {
          return false;
        }
        const data = await resp.json().catch(() => null);
        // MSG91 typically returns { type: 'success' } on success
        return Boolean(data && (data.type === 'success' || data.message === 'OTP verified success'));
      },
      mode: 'msg91_otp',
    };
  }

  if (provider === 'twilio_verify') {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
    if (!accountSid || !authToken || !serviceSid) {
      throw new Error('Missing Twilio Verify env vars');
    }

    const client = twilio(accountSid, authToken);

    return {
      async sendOtp(mobile) {
        const to = normalizeIndianMobile(mobile);
        await client.verify.v2.services(serviceSid).verifications.create({ to, channel: 'sms' });
      },
      async verifyOtp(mobile, code) {
        const to = normalizeIndianMobile(mobile);
        const result = await client.verify.v2.services(serviceSid).verificationChecks.create({ to, code });
        return result.status === 'approved';
      },
      mode: 'twilio_verify',
    };
  }

  // Default: mock provider (dev-friendly)
  return {
    async sendOtp(mobile, code) {
      console.log(`[OTP:mock] mobile=${mobile} code=${code}`);
    },
    async verifyOtp(mobile, code) {
      const test = process.env.OTP_TEST_CODE || '123456';
      return String(code) === String(test);
    },
    mode: 'mock',
  };
}

module.exports = { createOtpProvider, normalizeIndianMobile };
