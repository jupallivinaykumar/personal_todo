import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginWithEmail, loginWithGoogle, registerWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed. Check your credentials.';
      setError(message);
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-200">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 shadow-glass backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-sky-300">Smart Notify</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Productivity reimagined</h1>
          <p className="mt-2 text-slate-400">Sign in to access AI reminders, analytics, and smart notifications.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="you@example.com" required />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Enter your password" required minLength={6} />
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Button type="submit">{isRegister ? 'Create account' : 'Continue'}</Button>
            <button type="button" className="text-sm text-slate-400 hover:text-slate-100" onClick={() => setIsRegister((prev) => !prev)}>
              {isRegister ? 'Already have an account?' : 'Create a new account'}
            </button>
          </div>
        </form>

        <div className="mt-8 border-t border-white/10 pt-6 text-center">
          <p className="text-sm text-slate-400">Or continue with</p>
          <Button type="button" className="mt-4 w-full justify-center bg-white/10 text-white hover:bg-white/15" onClick={async () => { await loginWithGoogle(); navigate('/'); }}>
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
