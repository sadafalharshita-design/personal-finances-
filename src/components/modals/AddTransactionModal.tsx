import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../data/seedData';
import { TransactionType } from '../../types/finance';
import { X, Check } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose }) => {
  const { accounts, addTransaction } = useFinance();

  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [amount, setAmount] = useState<string>('');
  const [merchant, setMerchant] = useState<string>('');
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [accountId, setAccountId] = useState<string>(
    accounts.find((a) => a.is_default)?.id || accounts[0]?.id || ''
  );
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState<string>('');

  if (!isOpen) return null;

  const currentCategories = type === 'EXPENSE' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }
    if (!merchant.trim()) {
      alert('Please provide a merchant or payee name.');
      return;
    }

    addTransaction({
      account_id: accountId || accounts[0]?.id || '',
      type,
      amount: parsedAmount,
      category,
      merchant: merchant.trim(),
      date,
      note: note.trim() || undefined,
    });

    onClose();
    // reset form
    setAmount('');
    setMerchant('');
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.12] bg-[#111622] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div>
            <h3 className="font-heading text-lg font-semibold text-white">Record Transaction</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Updates your account balance and monthly cash flow baseline.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Segmented Type Toggle (No pills, clean button state) */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-black/40 border border-white/[0.06]">
            <button
              type="button"
              onClick={() => {
                setType('EXPENSE');
                setCategory(EXPENSE_CATEGORIES[0]);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                type === 'EXPENSE'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Expense Outflow
            </button>
            <button
              type="button"
              onClick={() => {
                setType('INCOME');
                setCategory(INCOME_CATEGORIES[0]);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                type === 'INCOME'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Income Inflow
            </button>
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Amount (INR ₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="1"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] pl-8 pr-4 py-2.5 text-white font-mono text-base placeholder:text-slate-600 focus:border-[#c99e52] focus:outline-none focus:ring-1 focus:ring-[#c99e52]"
              />
            </div>
          </div>

          {/* Merchant & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {type === 'EXPENSE' ? 'Merchant / Payee' : 'Source / Payer'}
              </label>
              <input
                type="text"
                placeholder={type === 'EXPENSE' ? 'e.g., Swiggy, Apple, BESCOM' : 'e.g., Salary, Client A'}
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                required
                className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] px-3.5 py-2 text-sm text-white placeholder:text-slate-600 focus:border-[#c99e52] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] px-3.5 py-2 text-sm text-white focus:border-[#c99e52] focus:outline-none"
              >
                {currentCategories.map((c) => (
                  <option key={c} value={c} className="bg-[#121620] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Account & Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Linked Account</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] px-3.5 py-2 text-sm text-white focus:border-[#c99e52] focus:outline-none"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id} className="bg-[#121620] text-white">
                    {acc.name} ({acc.type.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] px-3.5 py-2 text-sm text-white focus:border-[#c99e52] focus:outline-none"
              />
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Note (Optional)</label>
            <input
              type="text"
              placeholder="e.g., Monthly groceries or invoice reference"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] px-3.5 py-2 text-sm text-white placeholder:text-slate-600 focus:border-[#c99e52] focus:outline-none"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#c99e52] px-4 py-2 text-xs font-bold text-[#0c0f17] hover:bg-[#dfb66d] active:scale-[0.98] transition-all"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Save & Update Balance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
