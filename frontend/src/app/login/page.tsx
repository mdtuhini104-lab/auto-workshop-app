'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Eye = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOff = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const Lock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const User = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

function LoginContent() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('12345678');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    document.cookie = "token=active_session_token; path=/; max-age=86400; SameSite=Lax";
    document.cookie = "auth_token=active_session_token; path=/; max-age=86400; SameSite=Lax";
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', 'active_session_token');
      localStorage.setItem('auth_user', JSON.stringify({ name: 'Admin', role: 'Superadmin' }));
    }

    // Explicit router push & hard location replace for max compatibility
    router.push('/dashboard');
    window.location.href = '/dashboard';
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-hidden bg-slate-100 p-4">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 transition-all duration-700"
        style={{
          backgroundImage: `url('/bg-workshop.jpg')`
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />

      {/* Frosted Glass Container */}
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-950/45 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative z-10 space-y-5">
        
        {/* Header & Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            MAMUN AUTOMOBILES ERP
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
            Sign in to Workshop
          </h1>
          <p className="text-xs text-slate-300 font-medium">
            Enter manager credentials to access operations
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Username / Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide">
              USERNAME / EMAIL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4"/>
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter username or email"
                className="w-full pl-10 pr-4 py-3 text-sm bg-black/40 border border-white/20 rounded-xl text-white placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 focus:bg-slate-900/60 transition shadow-inner"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide">
              PASSWORD
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4"/>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 text-sm bg-black/40 border border-white/20 rounded-xl text-white placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 focus:bg-slate-900/60 transition shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" defaultChecked className="rounded border-white/20 bg-black/40 text-blue-500 focus:ring-blue-500/50 focus:ring-2 w-4 h-4 cursor-pointer" />
              <span className="text-xs font-medium text-slate-200">Keep me logged in</span>
            </label>
            <span className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer">Forgot?</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition duration-200 shadow-lg shadow-blue-600/40 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>{isLoading ? 'Signing in...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200"/>
          </button>
        </form>

        {/* Footer Links & Copyright */}
        <div className="pt-3 border-t border-white/10 text-center space-y-2">
          <div className="flex justify-center items-center gap-3 text-xs text-slate-300">
            <Link href="/registration" prefetch={false} className="text-xs text-slate-300 hover:text-white font-medium transition hover:underline">
              Register Account
            </Link>
            <span className="text-slate-500">•</span>
            <Link href="/terms" prefetch={false} className="text-xs text-slate-300 hover:text-white font-medium transition hover:underline">
              Terms
            </Link>
            <span className="text-slate-500">•</span>
            <Link href="/privacy" prefetch={false} className="text-xs text-slate-300 hover:text-white font-medium transition hover:underline">
              Privacy
            </Link>
          </div>
          <p className="text-[11px] font-medium text-slate-400">
            Mamun Automobiles Enterprise ERP © {new Date().getFullYear()} • Plot # 197, Uttara
          </p>
        </div>

      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-sm">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}


