import React, { useState } from 'react';
import { useFinance, DEMO_USER } from '../../context/FinanceContext';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login } = useFinance();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }

    login(email, isSignUp ? name : undefined);
    onClose();
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleDemoLogin = () => {
    login(DEMO_USER.email, DEMO_USER.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-white/[0.12] bg-[#111622] p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#c99e52]/10 border border-[#c99e52]/20 flex items-center justify-center text-[#dfb66d]">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">
                {isSignUp ? 'Create Meridian Account' : 'Sign In to Meridian'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isSignUp
                  ? 'Access multi-account ledgers and What-If simulations.'
                  : 'Enter your credentials to access your financial vault.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 1-Click Demo Login Banner */}
        <div className="mt-5 rounded-xl border border-[#c99e52]/30 bg-[#c99e52]/[0.08] p-3.5 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-[#dfb66d] block">
              Demo Credentials Preloaded
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              rahul@wealth.demo · WealthDemo123!
            </span>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#c99e52] px-3 py-1.5 text-xs font-bold text-[#0c0f17] hover:bg-[#dfb66d] active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
          >
            <span>Instant Demo</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3 text-xs text-slate-500">
          <div className="flex-1 h-px bg-white/[0.08]" />
          <span>or continue with email</span>
          <div className="flex-1 h-px bg-white/[0.08]" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:border-[#c99e52] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:border-[#c99e52] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:border-[#c99e52] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#c99e52] py-2.5 text-xs font-bold text-[#0c0f17] hover:bg-[#dfb66d] active:scale-[0.98] transition-all shadow"
            >
              <span>{isSignUp ? 'Create Vault Account' : 'Sign In to Meridian'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>

        {/* Footer switch */}
        <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
          <span>{isSignUp ? 'Already registered?' : 'New to Meridian Wealth?'}</span>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#dfb66d] hover:underline font-semibold"
          >
            {isSignUp ? 'Sign In instead' : 'Create an Account'}
          </button>
        </div>

        {/* Security badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Client-side session encrypted & persisted</span>
        </div>
      </div>
    </div>
  );
};
