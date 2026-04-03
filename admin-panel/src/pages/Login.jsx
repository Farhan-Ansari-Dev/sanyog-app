import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { setAdminToken } from '../services/auth';

const FEATURES = [
  'Manage all certification applications',
  'Review & update application statuses',
  'Handle client contact requests',
  'Document management & access',
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter both email and password.'); return; }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/admin/auth/login', { email, password });
      setAdminToken(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/3 rounded-full" />
        </div>

        <div className="relative z-10">
          {/* Logo — place your logo.png in admin-panel/public/ */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden p-1">
              <img
                src="/logo.png"
                alt="Sanyog Logo"
                className="w-full h-full object-contain"
                onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
              />
              <Shield style={{display:'none'}} className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-xl leading-tight">Sanyog Conformity</p>
              <p className="text-blue-300 text-sm">Admin Portal</p>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Manage certifications<br />with confidence.
          </h1>
          <p className="text-blue-200 text-base mb-10 leading-relaxed">
            A complete dashboard for tracking certification applications,
            managing documents, and serving clients efficiently.
          </p>

          {/* Features */}
          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3 h-3 text-green-300" />
                </div>
                <span className="text-blue-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-blue-300 text-xs">© 2024 Sanyog Conformity Solutions Pvt. Ltd.</p>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center overflow-hidden p-1">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain"
                onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
              <Shield style={{display:'none'}} className="w-5 h-5 text-white" />
            </div>
            <span className="text-primary font-bold text-lg">Sanyog Admin</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Admin Login</h2>
              <p className="text-slate-500 text-sm">Sign in to access the management portal.</p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="admin@sanyog.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    autoFocus
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Your admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10 pr-11"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3 mt-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {loading ? 'Signing In...' : 'Sign In to Portal'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-center text-xs text-slate-400">
                This portal is restricted to authorized administrators only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}