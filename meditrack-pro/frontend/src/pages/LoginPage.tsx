import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Eye, EyeOff, Loader2 } from 'lucide-react';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await authApi.login(email, password);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch {
      setError('Invalid credentials. Try admin@meditrack.com / Admin@123');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/15 flex items-center justify-center border border-primary/20">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">MediTrack Pro</h1>
          <p className="text-on-surface-variant text-xs mt-1 uppercase tracking-widest">Clinical Precision System</p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-low rounded-xl border border-outline-variant/15 p-8">
          <h2 className="font-headline text-lg font-bold text-on-surface mb-1">Welcome back</h2>
          <p className="text-on-surface-variant text-xs mb-6">Sign in to your clinical dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@meditrack.com"
                required
                className="w-full bg-surface-container border border-outline-variant/20 rounded-md px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 focus:bg-surface-container-high transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-surface-container border border-outline-variant/20 rounded-md px-3 py-2.5 pr-10 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 focus:bg-surface-container-high transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-error/10 border border-error/30 text-error text-xs p-3 rounded-lg animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary-container hover:bg-primary text-on-primary rounded-md font-semibold text-sm transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-3 bg-surface-container rounded-lg border border-outline-variant/10">
            <p className="text-[10px] text-on-surface-variant text-center">
              Demo: <span className="text-primary font-mono">admin@meditrack.com</span> / <span className="text-primary font-mono">Admin@123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
