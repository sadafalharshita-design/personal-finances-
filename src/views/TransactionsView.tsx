import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatINR } from '../components/common/FormatRupee';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/seedData';
import {
  Search,
  Plus,
  Trash2,
  Filter,
  ArrowUpDown,
  CheckSquare,
  Square,
} from 'lucide-react';

interface TransactionsViewProps {
  onOpenAddTransaction: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ onOpenAddTransaction }) => {
  const {
    transactions,
    accounts,
    deleteTransaction,
    bulkDeleteTransactions,
  } = useFinance();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [accountFilter, setAccountFilter] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allCategories = useMemo(() => {
    return Array.from(new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]));
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;
      if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
      if (accountFilter !== 'ALL' && t.account_id !== accountFilter) return false;

      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesMerchant = t.merchant.toLowerCase().includes(query);
        const matchesNote = t.note?.toLowerCase().includes(query);
        const matchesCategory = t.category.toLowerCase().includes(query);
        const matchesAmount = t.amount.toString().includes(query);
        if (!matchesMerchant && !matchesNote && !matchesCategory && !matchesAmount) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, typeFilter, categoryFilter, accountFilter, search]);

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredTransactions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTransactions.map((t) => t.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} transactions? Account balances will revert.`
      )
    ) {
      bulkDeleteTransactions(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Financial Ledger
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Granular verified transactions across all connected accounts.
          </p>
        </div>

        <button
          onClick={onOpenAddTransaction}
          className="inline-flex items-center gap-2 rounded-xl bg-[#c99e52] px-4 py-2 text-xs font-bold text-[#0c0f17] hover:bg-[#dfb66d] active:scale-[0.98] transition-all shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search merchant, notes, or amount..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-[#121620] pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-[#c99e52] focus:outline-none"
          />
        </div>

        {/* Filter segment */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter Buttons */}
          <div className="flex items-center rounded-xl bg-[#121620] border border-white/[0.08] p-1">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                typeFilter === 'ALL'
                  ? 'bg-white/[0.08] text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('EXPENSE')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                typeFilter === 'EXPENSE'
                  ? 'bg-rose-500/20 text-rose-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setTypeFilter('INCOME')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                typeFilter === 'INCOME'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Income
            </button>
          </div>

          {/* Account Filter */}
          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-[#121620] px-3 py-1.5 text-xs text-white focus:border-[#c99e52] focus:outline-none"
          >
            <option value="ALL">All Accounts</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-[#121620] px-3 py-1.5 text-xs text-white focus:border-[#c99e52] focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Bulk Delete Button */}
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold hover:bg-rose-500/30 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete ({selectedIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Ledger Table (Tabular Numerals, High-Density Data Grid) */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#121620] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-black/25 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-10">
                  <button
                    onClick={handleToggleSelectAll}
                    className="text-slate-400 hover:text-white focus:outline-none"
                  >
                    {selectedIds.length > 0 && selectedIds.length === filteredTransactions.length ? (
                      <CheckSquare className="h-4 w-4 text-[#dfb66d]" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Merchant / Entity</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Account</th>
                <th className="py-3 px-4 font-semibold text-right">Amount (₹)</th>
                <th className="py-3 px-4 font-semibold text-center w-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    No transactions match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const acc = accounts.find((a) => a.id === tx.account_id);
                  const isIncome = tx.type === 'INCOME';
                  const isSelected = selectedIds.includes(tx.id);

                  return (
                    <tr
                      key={tx.id}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        isSelected ? 'bg-white/[0.04]' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleSelect(tx.id)}
                          className="text-slate-400 hover:text-white"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-[#dfb66d]" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4 font-medium text-white">
                        <div>
                          <span>{tx.merchant}</span>
                          {tx.note && (
                            <span className="block text-[11px] text-slate-500 font-normal truncate max-w-xs">
                              {tx.note}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                        {tx.category}
                      </td>
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {acc?.name || 'Account'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums whitespace-nowrap">
                        <span className={isIncome ? 'text-emerald-400' : 'text-slate-200'}>
                          {isIncome ? '+' : '-'}
                          {formatINR(tx.amount)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Delete transaction and revert balance"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
