import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { X, Check } from 'lucide-react';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, onClose }) => {
  const { addGoal } = useFinance();

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('2027-03-31');
  const [category, setCategory] = useState('Savings');
  const [isPrimary, setIsPrimary] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const current = parseFloat(currentAmount) || 0;

    if (!name.trim() || isNaN(target) || target <= 0) {
      alert('Please provide a goal name and valid target amount.');
      return;
    }

    const remaining = Math.max(0, target - current);
    const months = 12; // default monthly estimate
    const monthlyNeeded = Math.round(remaining / months);

    addGoal({
      name: name.trim(),
      target_amount: target,
      current_amount: current,
      target_date: targetDate,
      monthly_contribution: monthlyNeeded,
      category: category.trim() || 'General',
      is_primary: isPrimary,
    });

    onClose();
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setIsPrimary(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-white/[0.12] bg-[#111622] p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div>
            <h3 className="font-heading text-lg font-semibold text-white">Create Financial Goal</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Enables timeline acceleration inside What-If simulations.
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
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Goal Name</label>
            <input
              type="text"
              placeholder="e.g., Emergency Reserve, MacBook Pro, House Downpayment"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] px-3.5 py-2.5 text-sm text-white focus:border-[#c99e52] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Amount (₹)
              </label>
              <input
                type="number"
                step="any"
                placeholder="250000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
                className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] px-3 py-2 text-sm text-white font-mono focus:border-[#c99e52] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Current Saved (₹)
              </label>
              <input
                type="number"
                step="any"
                placeholder="50000"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] px-3 py-2 text-sm text-white font-mono focus:border-[#c99e52] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Horizon Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] px-3 py-2 text-sm text-white focus:border-[#c99e52] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] px-3 py-2 text-sm text-white focus:border-[#c99e52] focus:outline-none"
              >
                <option value="Safety" className="bg-[#121620]">Safety / Emergency</option>
                <option value="Real Estate" className="bg-[#121620]">Real Estate</option>
                <option value="Workstation" className="bg-[#121620]">Tech / Hardware</option>
                <option value="Travel" className="bg-[#121620]">Travel & Vacation</option>
                <option value="Retirement" className="bg-[#121620]">Retirement / FIRE</option>
                <option value="Education" className="bg-[#121620]">Higher Education</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPrimaryGoal"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-[#0b0e14] text-[#c99e52] focus:ring-0"
            />
            <label htmlFor="isPrimaryGoal" className="text-xs text-slate-300 select-none">
              Prioritize as primary goal for What-If scenario simulations
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
              <span>Create Goal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
