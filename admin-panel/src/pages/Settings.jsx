import React, { useState, useEffect, useRef } from 'react';
import { Camera, User, Lock, Save, Loader2, CheckCircle, AlertCircle, Shield, Moon, Sun } from 'lucide-react';
import api from '../services/api';

export default function Settings() {
  const [profile, setProfile] = useState({ name: '', nickName: '', email: '', phone: '', role: '', avatar: null });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');

  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileRef = useRef(null);

  const [darkMode, setDarkMode] = useState(localStorage.theme === 'dark' || document.documentElement.className.includes('dark'));

  const toggleGlobalMode = (mode) => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    }
  };

  useEffect(() => {
    // Attempt fallback from local storage if backend /me fails
    setProfile(p => ({ ...p, name: localStorage.adminName || 'Super Admin', nickName: localStorage.adminNickName || '', email: 'admin@sanyog.com', role: 'admin', avatar: localStorage.adminAvatar || null }));
    
    api.get('/admin/auth/me').then(r => {
      setProfile({ 
        name: r.data.name || localStorage.adminName || '', 
        nickName: r.data.nickName || localStorage.adminNickName || '',
        email: r.data.email || '', 
        phone: r.data.phone || '', 
        role: r.data.role || '', 
        avatar: r.data.avatar || localStorage.adminAvatar || null 
      });
    }).catch(() => {});
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1000000) { setProfileError('Image must be under 1MB.'); return; }

    setAvatarLoading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result;
      try {
        await api.put('/admin/auth/me/avatar', { avatar: base64 });
        setProfile(p => ({ ...p, avatar: base64 }));
        localStorage.adminAvatar = base64; // Fallback
        setProfileSuccess('Profile picture updated!');
        setTimeout(() => setProfileSuccess(''), 3000);
      } catch (err) {
        // Fallback to local storage if API missing
        setProfile(p => ({ ...p, avatar: base64 }));
        localStorage.adminAvatar = base64;
        setProfileSuccess('Profile picture updated locally.');
        setTimeout(() => setProfileSuccess(''), 3000);
      } finally {
        setAvatarLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) { setProfileError('Full Name is required.'); return; }
    setProfileLoading(true);
    setProfileError(''); setProfileSuccess('');
    try {
      await api.put('/admin/auth/me', { name: profile.name.trim(), nickName: profile.nickName.trim(), phone: profile.phone.trim() });
      localStorage.adminName = profile.name.trim();
      localStorage.adminNickName = profile.nickName.trim();
      setProfileSuccess('Profile settings perfectly updated!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      localStorage.adminName = profile.name.trim();
      localStorage.adminNickName = profile.nickName.trim();
      setProfileSuccess('Profile perfectly saved locally!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } finally { setProfileLoading(false); }
  };

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
      setPwError(err.response?.data?.error || 'Backend password change failed.');
    } finally { setPwLoading(false); }
  };

  return (
    <div className="animate-fade-in pb-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">System Settings</h1>
        <p className="text-[15px] text-[#64748B] dark:text-[#94A3B8] mt-1">Manage your admin profile, appearance, and security credentials.</p>
      </div>

      <div className="max-w-4xl space-y-6">
        
        {/* APPEARANCE (DARK/LIGHT TOGGLE) */}
        <div className="bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl shadow-sm p-6 sm:p-8">
           <h2 className="text-[16px] font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-5 flex items-center gap-2">
             <Sun className="w-5 h-5 text-amber-500" /> Display Preference
           </h2>
           <p className="text-[14px] text-[#64748B] dark:text-[#94A3B8] mb-6">Choose your preferred lighting for the CMS dashboard. Perfect synchronization is applied instantly.</p>
           
           <div className="flex gap-4">
              <button 
                onClick={() => toggleGlobalMode('light')}
                className={`flex-1 sm:flex-none sm:w-[160px] h-[100px] rounded-xl flex flex-col items-center justify-center gap-2 border-2 transition-all ${!darkMode ? 'border-[#22C55E] bg-[#22C55E]/10' : 'border-[#E2E8F0] dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700 bg-[#F8FAFC] dark:bg-[#1E293B]'}`}
              >
                <Sun className={`w-8 h-8 ${!darkMode ? 'text-[#22C55E]' : 'text-slate-400'}`} />
                <span className={`text-[13px] font-bold ${!darkMode ? 'text-[#16A34A]' : 'text-slate-500 dark:text-slate-400'}`}>Light Mode</span>
              </button>

              <button 
                onClick={() => toggleGlobalMode('dark')}
                className={`flex-1 sm:flex-none sm:w-[160px] h-[100px] rounded-xl flex flex-col items-center justify-center gap-2 border-2 transition-all ${darkMode ? 'border-[#22C55E] bg-[#22C55E]/10' : 'border-[#E2E8F0] hover:border-slate-300 dark:border-[#1E293B] dark:hover:border-slate-700 bg-white dark:bg-[#0F172A]'}`}
              >
                <Moon className={`w-8 h-8 ${darkMode ? 'text-[#22C55E]' : 'text-slate-400'}`} />
                <span className={`text-[13px] font-bold ${darkMode ? 'text-[#16A34A]' : 'text-slate-500 dark:text-slate-400'}`}>Dark Mode</span>
              </button>
           </div>
        </div>

        {/* PROFILE IDENTIFICATION */}
        <div className="bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-[16px] font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-5 flex items-center gap-2">
            <User className="w-5 h-5 text-[#22C55E]" /> Profile Identification
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <div className="relative group">
              {profile.avatar
                ? <img src={profile.avatar} alt="avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-[#1E293B] shadow-md transition-all" />
                : <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shadow-md border-4 border-white dark:border-[#1E293B]">
                    <span className="text-blue-600 dark:text-blue-400 text-3xl font-bold">{(profile.name || 'A').charAt(0).toUpperCase()}</span>
                  </div>
              }
              <button
                onClick={() => fileRef.current?.click()}
                disabled={avatarLoading}
                className="absolute inset-0 rounded-full bg-slate-900/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer backdrop-blur-[2px]"
              >
                {avatarLoading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>
            <div>
              <p className="text-[18px] font-bold text-[#0F172A] dark:text-[#F8FAFC]">{profile.name || 'Admin User'}</p>
              <p className="text-[14px] text-[#64748B] dark:text-[#94A3B8]">{profile.nickName ? `"${profile.nickName}"` : 'No Nickname assigned'}</p>
              <span className={`inline-block mt-2 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${profile.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                {profile.role || 'Super Admin'} Access
              </span>
            </div>
          </div>

          {profileSuccess && (
            <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] px-4 py-3 rounded-xl mb-6 text-[14px] font-medium animate-fade-in">
              <CheckCircle className="w-5 h-5 shrink-0" /> {profileSuccess}
            </div>
          )}
          {profileError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-[14px] font-medium animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" /> {profileError}
            </div>
          )}

          <form onSubmit={handleProfileSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Full Name *</label>
              <input type="text" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="w-full h-11 px-4 bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-[#F8FAFC] text-[14px] rounded-xl outline-none focus:border-[#22C55E]" placeholder="Your legal name" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Nick Name</label>
              <input type="text" value={profile.nickName} onChange={e => setProfile(p => ({ ...p, nickName: e.target.value }))} className="w-full h-11 px-4 bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-[#F8FAFC] text-[14px] rounded-xl outline-none focus:border-[#22C55E]" placeholder="What should we call you?" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Email Address (Locked)</label>
              <input type="email" value={profile.email} className="w-full h-11 px-4 bg-slate-100 dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-slate-500 dark:text-slate-400 text-[14px] rounded-xl focus:outline-none cursor-not-allowed" disabled />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Contact Number</label>
              <input type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="w-full h-11 px-4 bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-[#F8FAFC] text-[14px] rounded-xl outline-none focus:border-[#22C55E]" placeholder="+1 XXXXX XXXXX" />
            </div>
            <div className="md:col-span-2 pt-2">
              <button type="submit" disabled={profileLoading} className="h-11 px-6 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold text-[14px] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 w-full md:w-auto disabled:opacity-70">
                {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {profileLoading ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* SECURITY & PASSWORD */}
        <div className="bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-[16px] font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-5 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#3B82F6]" /> Account Security
          </h2>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-xl mb-6 flex items-start gap-3">
             <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
             <div>
               <p className="text-[13px] font-bold text-blue-900 dark:text-blue-300 mb-1">Strict Backend Enforcement</p>
               <p className="text-[13px] text-blue-700 dark:text-blue-400">Keep your connection fully encrypted. Admin passwords are irreversibly hashed instantly upon saving.</p>
             </div>
          </div>

          {pwSuccess && (
            <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] px-4 py-3 rounded-xl mb-6 text-[14px] font-medium animate-fade-in">
              <CheckCircle className="w-5 h-5 shrink-0" /> {pwSuccess}
            </div>
          )}
          {pwError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-[14px] font-medium animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" /> {pwError}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            {[
              { label: 'Current Backend Password', key: 'currentPassword', placeholder: 'Enter your existing password' },
              { label: 'New Secure Password', key: 'newPassword', placeholder: 'Minimum 8 strictly secure characters' },
              { label: 'Confirm New Password', key: 'confirmPassword', placeholder: 'Re-enter to confirm' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-[13px] font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">{label}</label>
                <input type="password" value={pwForm[key]} onChange={e => setPwForm(p => ({ ...p, [key]: e.target.value }))} className="w-full h-11 px-4 bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-[#F8FAFC] text-[14px] rounded-xl outline-none focus:border-[#3B82F6]" placeholder={placeholder} />
              </div>
            ))}
            <div className="pt-2">
              <button type="submit" disabled={pwLoading} className="h-11 px-6 bg-[#0F172A] dark:bg-[#F8FAFC] text-white dark:text-[#0F172A] hover:opacity-90 font-semibold text-[14px] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 w-full disabled:opacity-70">
                {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {pwLoading ? 'Encrypting...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
