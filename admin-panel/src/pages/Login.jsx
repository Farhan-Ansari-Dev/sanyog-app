import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api.js';
import { getAdminToken, setAdminToken } from '../services/auth.js';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setError('');
    setOk('');

    if (!email.trim() || !password.trim()) {
      setError('Enter email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/admin/auth/login', {
        email: email.trim(),
        password: password,
      });

      setAdminToken(res.data.token);
      setOk('Saved. Loading dashboard…');
      navigate('/applications');
    } catch {
      setError('Login failed. Check credentials and backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Admin Login</h2>
      <p className="muted">Sign in with your admin email and password.</p>

      <form onSubmit={save}>
        <div className="row" style={{ marginBottom: 10 }}>
          <div>
            <label className="muted">Email</label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@company.com" />
          </div>
          <div>
            <label className="muted">Password</label>
            <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
          </div>
        </div>

        <button className="btn" type="submit" disabled={loading}>{loading ? 'Saving…' : 'Save & Continue'}</button>
      </form>

      {ok ? <p className="success">{ok}</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {getAdminToken() ? <p className="muted">Already signed in.</p> : null}
      <p className="muted" style={{ marginTop: 12 }}>API base URL: <code>{import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}</code></p>
    </div>
  );
}
