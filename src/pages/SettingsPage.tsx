import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notificationStatus, setNotificationStatus] = useState('Enabled');

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-glass backdrop-blur-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-sky-300">Account</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Profile & preferences</h1>
            </div>
            <Button onClick={logout}>Logout</Button>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="space-y-2 rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <p className="text-sm text-slate-400">Email</p>
              <p className="text-lg font-semibold text-white">{user?.email}</p>
            </div>
            <div className="space-y-2 rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <p className="text-sm text-slate-400">Theme</p>
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-white">{theme}</span>
                <Button onClick={toggleTheme}>Toggle Theme</Button>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/80 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Notification</p>
              <p className="text-sm text-slate-300">{notificationStatus}</p>
            </div>
            <Button className="mt-5" onClick={() => setNotificationStatus((prev) => (prev === 'Enabled' ? 'Disabled' : 'Enabled'))}>
              {notificationStatus === 'Enabled' ? 'Disable' : 'Enable'} notifications
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
