async function test() {
  try {
    console.log('Logging in...');
    const loginRes = await fetch('http://localhost:5000/auth/login-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@sanyogconformity.com',
        password: '12345678'
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Token:', token ? 'Success' : 'Failed');

    console.log('Fetching applications...');
    const appsRes = await fetch('http://localhost:5000/applications/my', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Apps Response status:', appsRes.status);
    const appsData = await appsRes.text();
    console.log('Apps data:', appsData.substring(0, 100));

  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
