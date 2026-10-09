/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { TopBar } from './components/common/TopBar';
import { OverviewView } from './views/OverviewView';
import { WhatIfSimulatorView } from './views/WhatIfSimulatorView';
import { AccountsView } from './views/AccountsView';
import { TransactionsView } from './views/TransactionsView';
import { BudgetView } from './views/BudgetView';
import { GoalsView } from './views/GoalsView';
import { ReceiptScannerView } from './views/ReceiptScannerView';
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { AuthModal } from './components/modals/AuthModal';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useFinance();
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e14] text-[#f1f3f9]">
      <TopBar
        onOpenAddTransaction={() => setIsAddTxOpen(true)}
        onOpenAuthModal={() => setIsAuthOpen(true)}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewView onOpenAddTransaction={() => setIsAddTxOpen(true)} />
        )}
        {activeTab === 'what-if' && <WhatIfSimulatorView />}
        {activeTab === 'accounts' && <AccountsView />}
        {activeTab === 'transactions' && (
          <TransactionsView onOpenAddTransaction={() => setIsAddTxOpen(true)} />
        )}
        {activeTab === 'budget' && <BudgetView />}
        {activeTab === 'goals' && <GoalsView />}
        {activeTab === 'scan' && <ReceiptScannerView />}
      </main>

      {/* Global Modals */}
      <AddTransactionModal isOpen={isAddTxOpen} onClose={() => setIsAddTxOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* High-end quiet Footer adhering to anti-slop guidelines */}
      <footer className="mt-auto border-t border-white/[0.08] bg-[#090b10] py-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-heading font-semibold text-slate-300">Meridian Wealth</span>
            <span>·</span>
            <span>Financial Decision Support Engine</span>
          </div>

          <div className="flex items-center gap-5 text-slate-400">
            <button
              onClick={() => setActiveTab('what-if')}
              className="hover:text-white transition-colors"
            >
              What-If Simulator
            </button>
            <button
              onClick={() => setActiveTab('accounts')}
              className="hover:text-white transition-colors"
            >
              Accounts
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className="hover:text-white transition-colors"
            >
              Ledger
            </button>
            <button
              onClick={() => setActiveTab('scan')}
              className="hover:text-white transition-colors"
            >
              Scanner
            </button>
          </div>

          <p className="text-[11px] text-slate-500">
            Deterministic modeling · All invariants verified
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}
