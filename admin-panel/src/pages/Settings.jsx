import { useState, useEffect, useRef } from 'react';
import { Camera, User, Lock, Save, Loader2, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';

export default function Settings() {
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', role: '', avatar: null });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');

  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    api.get('/admin/auth/me').then(r => {
      setProfile({ name: r.data.name || '', email: r.data.email || '', phone: r.data.phone || '', role: r.data.role || '', avatar: r.data.avatar || null });
    }).catch(() => {});
  }, []);

  // ── Avatar Upload ────────────────────────────────────────────────────────
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500000) { setProfileError('Image must be under 500KB.'); return; }

    setAvatarLoading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result;
      try {
        await api.put('/admin/auth/me/avatar', { avatar: base64 });
        setProfile(p => ({ ...p, avatar: base64 }));
        setProfileSuccess('Profile picture updated!');
        setTimeout(() => setProfileSuccess(''), 3000);
      } catch (err) {
        setProfileError(err.response?.data?.error || 'Failed to upload avatar.');
      } finally {
        setAvatarLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // ── Save Profile ─────────────────────────────────────────────────────────
  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) { setProfileError('Name is required.'); return; }
    setProfileLoading(true);
    setProfileError(''); setProfileSuccess('');
    try {
      await api.put('/admin/auth/me', { name: profile.name.trim(), phone: profile.phone.trim() });
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      setProfileError(err.response?.data?.error || 'Update failed.');
    } finally { setProfileLoading(false); }
  };

  // ── Change Password ───────────────────────────────────────────────────────
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError('Passwords do not match.'); return; }
    if (pwForm.newPassword.length < 8) { setPwError('New password must be at least 8 characters.'); return; }
    setPwLoading(true); setPwError(''); setPwSuccess('');
    try {
      await api.put('/admin/auth/me/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwSuccess('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPwSuccess(''), 3000);
    } catch (err) {
      setPwError(err.response?.data?.error || 'Password change failed.');
    } finally { setPwLoading(false); }
  };

  const ROLE_COLORS = { admin: 'bg-purple-100 text-purple-700', ops: 'bg-blue-100 text-blue-700', viewer: 'bg-gray-100 text-gray-600' };

  return (
    <AdminLayout title="Settings" subtitle="Manage your admin profile and security">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ── Profile Card ── */}
        <div className="card p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" /> Profile Information
          </h2>

          {/* Avatar */}
          <div className="flex items-center gap-5 mb-6">
            <div className="relative group">
              {profile.avatar
                ? <img src={profile.avatar} alt="avatar" className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md" />
                : <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-md border-4 border-white">
                    <span className="text-white text-3xl font-bold">{(profile.name || 'A').charAt(0).toUpperCase()}</span>
                  </div>
              }
              <button
                onClick={() => fileRef.current?.click()}
                disabled={avatarLoading}
                className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
              >
                {avatarLoading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>
            <div>
              <p className="font-bold text-slate-900">{profile.name || '—'}</p>
              <p className="text-sm text-slate-500">{profile.email}</p>
              <span className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${ROLE_COLORS[profile.role] || ROLE_COLORS.viewer}`}>
                {profile.role}
              </span>
            </div>
          </div>

          {/* Alerts */}
          {profileSuccess && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm animate-fade-in">
              <CheckCircle className="w-4 h-4 shrink-0" /> {profileSuccess}
            </div>
          )}
          {profileError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" /> {profileError}
            </div>
          )}

          <form onSubmit={handleProfileSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
              <input type="text" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input type="email" value={profile.email} className="input-field bg-slate-50 cursor-not-allowed" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
              <input type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="input-field" placeholder="+91 XXXXX XXXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
              <input type="text" value={profile.role} className="input-field bg-slate-50 cursor-not-allowed capitalize" disabled />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" disabled={profileLoading} className="btn-primary">
                {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* ── Change Password ── */}
        <div className="card p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" /> Change Password
          </h2>

          {pwSuccess && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm animate-fade-in">
              <CheckCircle className="w-4 h-4 shrink-0" /> {pwSuccess}
            </div>
          )}
          {pwError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" /> {pwError}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
            {[
              { label: 'Current Password', key: 'currentPassword', placeholder: 'Your current password' },
              { label: 'New Password', key: 'newPassword', placeholder: 'Min. 8 characters' },
              { label: 'Confirm New Password', key: 'confirmPassword', placeholder: 'Repeat new password' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                <input type="password" value={pwForm[key]} onChange={e => setPwForm(p => ({ ...p, [key]: e.target.value }))} className="input-field" placeholder={placeholder} />
              </div>
            ))}
            <button type="submit" disabled={pwLoading} className="btn-primary">
              {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {pwLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* ── Security Info ── */}
        <div className="card p-5 border-l-4 border-l-blue-500">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-slate-900 mb-1">Security Note</p>
              <p className="text-xs text-slate-500">Your admin session expires every 12 hours. Use a strong, unique password. Never share your credentials with anyone outside the organization.</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
