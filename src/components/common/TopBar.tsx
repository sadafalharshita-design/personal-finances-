import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ActiveTab } from '../../types/finance';
import { Plus, Menu, X, RotateCcw } from 'lucide-react';

interface TopBarProps {
  onOpenAddTransaction: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenAddTransaction }) => {
  const { activeTab, setActiveTab, resetAllData } = useFinance();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            src="/src/assets/images/meridian_vault_emblem_1791570759637.jpg"
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

        {/* Zone 3: 1 primary action */}
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
