import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatINR } from '../components/common/FormatRupee';
import { AddAccountModal } from '../components/modals/AddAccountModal';
import {
  Building2,
  Plus,
  CreditCard,
  Landmark,
  TrendingUp,
  Wallet,
  Check,
  Trash2,
} from 'lucide-react';

export const AccountsView: React.FC = () => {
  const {
    accounts,
    totalBalance,
    totalLiquidAssets,
    totalInvestments,
    totalLiabilities,
    transactions,
    setDefaultAccount,
    deleteAccount,
  } = useFinance();

  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleDelete = (id: string, name: string) => {
    const success = deleteAccount(id);
    if (!success) {
      alert(`Cannot delete "${name}" because it contains logged transactions. Delete or reassign those transactions first.`);
    }
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'INVESTMENT':
        return <TrendingUp className="h-4 w-4 text-[#dfb66d]" />;
      case 'CREDIT_CARD':
        return <CreditCard className="h-4 w-4 text-rose-400" />;
      case 'CASH':
        return <Wallet className="h-4 w-4 text-slate-300" />;
      default:
        return <Landmark className="h-4 w-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Linked Financial Accounts
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Real balances feeding your net worth and scenario simulation ground truth.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#c99e52] px-4 py-2 text-xs font-bold text-[#0c0f17] hover:bg-[#dfb66d] active:scale-[0.98] transition-all shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Account</span>
        </button>
      </div>

      {/* Asset Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/[0.08] bg-[#121620] p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Liquid Cash & Savings</span>
            <Landmark className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-3 font-mono text-2xl font-bold text-emerald-400 tabular-nums">
            {formatINR(totalLiquidAssets)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Checking, savings & cash reserve</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#121620] p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Investments & Equities</span>
            <TrendingUp className="h-4 w-4 text-[#dfb66d]" />
          </div>
          <p className="mt-3 font-mono text-2xl font-bold text-[#dfb66d] tabular-nums">
            {formatINR(totalInvestments)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Demat, PPF & capital assets</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#121620] p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Liabilities & Cards</span>
            <CreditCard className="h-4 w-4 text-rose-400" />
          </div>
          <p className="mt-3 font-mono text-2xl font-bold text-rose-400 tabular-nums">
            {formatINR(totalLiabilities)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Outstanding card debt balances</p>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {accounts.map((acc) => {
          const txCount = transactions.filter((t) => t.account_id === acc.id).length;
          const isNegative = acc.balance < 0;

          return (
            <div
              key={acc.id}
              className="rounded-2xl border border-white/[0.08] bg-[#121620] p-5 flex flex-col justify-between hover:border-white/[0.14] transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-white/[0.05] flex items-center justify-center">
                      {getAccountIcon(acc.type)}
                    </div>
                    <div>
                      <h3 className="font-heading text-sm font-semibold text-white">{acc.name}</h3>
                      <p className="text-xs text-slate-400">{acc.institution || acc.type.replace('_', ' ')}</p>
                    </div>
                  </div>

                  {acc.is_default && (
                    <span className="text-[11px] font-medium text-[#dfb66d]">
                      Default
                    </span>
                  )}
                </div>

                <div className="mt-6">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400">Current Balance</span>
                  <p
                    className={`mt-1 font-mono text-2xl font-bold tabular-nums ${
                      isNegative ? 'text-rose-400' : 'text-white'
                    }`}
                  >
                    {formatINR(acc.balance)}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[11px] text-slate-500">
                  {acc.account_number_mask || `${txCount} txns`}
                </span>

                <div className="flex items-center gap-2">
                  {!acc.is_default && (
                    <button
                      onClick={() => setDefaultAccount(acc.id)}
                      className="text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      Make Default
                    </button>
                  )}

                  {txCount === 0 && (
                    <button
                      onClick={() => handleDelete(acc.id, acc.name)}
                      className="text-xs text-rose-400 hover:text-rose-300 p-1"
                      title="Delete unused account"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AddAccountModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
};
