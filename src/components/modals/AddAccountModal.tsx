import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { AccountType } from '../../types/finance';
import { X, Check } from 'lucide-react';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose }) => {
  const { addAccount } = useFinance();

  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('SAVINGS');
  const [balance, setBalance] = useState('');
  const [institution, setInstitution] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedBalance = parseFloat(balance);
    if (!name.trim()) {
      alert('Please enter an account name.');
      return;
    }

    addAccount({
      name: name.trim(),
      type,
      balance: isNaN(parsedBalance) ? 0 : parsedBalance,
      institution: institution.trim() || undefined,
      is_default: isDefault,
      account_number_mask: '•••• ' + Math.floor(1000 + Math.random() * 9000),
    });

    onClose();
    setName('');
    setBalance('');
    setInstitution('');
    setIsDefault(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-white/[0.12] bg-[#111622] p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div>
            <h3 className="font-heading text-lg font-semibold text-white">Create Account</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Link a savings, investment, credit, or cash account.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Account Name</label>
            <input
              type="text"
              placeholder="e.g., ICICI Current, Zerodha Portfolio"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] px-3.5 py-2.5 text-sm text-white focus:border-[#c99e52] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Account Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AccountType)}
                className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] px-3 py-2 text-sm text-white focus:border-[#c99e52] focus:outline-none"
              >
                <option value="SAVINGS" className="bg-[#121620]">Savings</option>
                <option value="CHECKING" className="bg-[#121620]">Current / Checking</option>
                <option value="INVESTMENT" className="bg-[#121620]">Investment / Equity</option>
                <option value="CREDIT_CARD" className="bg-[#121620]">Credit Card</option>
                <option value="CASH" className="bg-[#121620]">Cash / Wallet</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Initial Balance (₹)
              </label>
              <input
                type="number"
                step="any"
                placeholder="0"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] px-3 py-2 text-sm text-white font-mono focus:border-[#c99e52] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Financial Institution</label>
            <input
              type="text"
              placeholder="e.g., HDFC Bank, Zerodha, SBI"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] px-3.5 py-2 text-sm text-white focus:border-[#c99e52] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isDefaultAccount"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-[#0b0e14] text-[#c99e52] focus:ring-0"
            />
            <label htmlFor="isDefaultAccount" className="text-xs text-slate-300 select-none">
              Set as primary default account
            </label>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#c99e52] px-4 py-2 text-xs font-bold text-[#0c0f17] hover:bg-[#dfb66d]"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
