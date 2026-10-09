import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ActiveTab } from '../../types/finance';
import { Plus, Menu, X, RotateCcw, LogIn, LogOut, User, ChevronDown } from 'lucide-react';
import meridianEmblem from '../../assets/images/meridian_vault_emblem_1791570759637.jpg';

interface TopBarProps {
  onOpenAddTransaction: () => void;
  onOpenAuthModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenAddTransaction, onOpenAuthModal }) => {
  const { activeTab, setActiveTab, resetAllData, currentUser, isAuthenticated, logout } = useFinance();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks: { id: ActiveTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'what-if', label: 'What-If Simulator' },
    { id: 'accounts', label: 'Accounts' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'budget', label: 'Budget' },
    { id: 'goals', label: 'Goals' },
    { id: 'scan', label: 'Receipt Scanner' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0b0e14]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-2.5 text-left text-base font-semibold tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <img
            src={meridianEmblem}
            alt="Emblem"
            className="h-7 w-7 rounded-full object-cover border border-white/20"
          />
          <span className="font-heading font-bold tracking-tight">Meridian Wealth</span>
        </button>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'text-[#dfb66d] font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#dfb66d]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions + User Profile / Sign In */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (window.confirm('Reset all demo financial data back to baseline?')) {
                resetAllData();
              }
            }}
            title="Reset to baseline data"
            aria-label="Reset baseline"
            className="hidden sm:inline-flex items-center justify-center p-2 text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={onOpenAddTransaction}
            className="inline-flex items-center gap-2 rounded-lg bg-[#c99e52] px-3.5 py-2 text-xs font-semibold text-[#0c0f17] shadow-sm hover:bg-[#dfb66d] active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Transaction</span>
          </button>

          {/* User Profile or Sign In Button */}
          {isAuthenticated && currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] transition-colors"
              >
                <div className="h-6 w-6 rounded-md bg-[#c99e52]/20 border border-[#c99e52]/30 flex items-center justify-center text-[11px] font-bold text-[#dfb66d]">
                  {currentUser.avatar_initials}
                </div>
                <span className="hidden xl:inline text-xs font-medium text-slate-200">
                  {currentUser.name}
                </span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-white/[0.12] bg-[#121620] p-3 shadow-2xl z-50">
                  <div className="pb-3 border-b border-white/[0.08]">
                    <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <span className="mt-1.5 inline-block text-[10px] text-[#dfb66d] font-mono">
                      {currentUser.tier}
                    </span>
                  </div>

                  <div className="pt-2 space-y-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenAuthModal();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors flex items-center gap-2"
                    >
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>Switch Account</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/[0.08] transition-colors whitespace-nowrap shrink-0"
            >
              <LogIn className="h-3.5 w-3.5 text-[#dfb66d]" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-[#0e121b] px-4 py-3 space-y-1">
          {isAuthenticated && currentUser && (
            <div className="pb-2 mb-2 border-b border-white/[0.08] flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400">{currentUser.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-rose-400 hover:underline"
              >
                Sign Out
              </button>
            </div>
          )}

          {!isAuthenticated && (
            <div className="pb-2 mb-2 border-b border-white/[0.08]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full py-2 text-center rounded-lg bg-[#c99e52]/20 border border-[#c99e52]/40 text-xs font-bold text-[#dfb66d]"
              >
                Sign In to Meridian
              </button>
            </div>
          )}

          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-white/[0.08] text-[#dfb66d] font-semibold'
                  : 'text-slate-300 hover:bg-white/[0.04]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 px-3">
            <span>Reset Demo Data</span>
            <button
              onClick={() => {
                resetAllData();
                setMobileMenuOpen(false);
              }}
              className="text-[#dfb66d] hover:underline"
            >
              Restore Baseline
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
