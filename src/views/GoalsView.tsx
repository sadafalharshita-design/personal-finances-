import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatINR } from '../components/common/FormatRupee';
import { AddGoalModal } from '../components/modals/AddGoalModal';
import {
  Target,
  Plus,
  Sparkles,
  Check,
  Calendar,
  ChevronRight,
  Trash2,
} from 'lucide-react';

export const GoalsView: React.FC = () => {
  const {
    goals,
    updateGoal,
    deleteGoal,
    executeSimulation,
    setActiveTab,
  } = useFinance();

  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleSimulateGoal = (goalName: string) => {
    executeSimulation(`When can I afford ${goalName}?`, 20000);
    setActiveTab('what-if');
  };

  const handleAddFunds = (goalId: string, current: number, amount: number) => {
    updateGoal(goalId, { current_amount: current + amount });
  };

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Long-Term Financial Goals
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Target horizons connected directly to What-If scenario simulations.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#c99e52] px-4 py-2 text-xs font-bold text-[#0c0f17] hover:bg-[#dfb66d] active:scale-[0.98] transition-all shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
          const remaining = Math.max(0, goal.target_amount - goal.current_amount);
          const isFunded = remaining === 0;

          return (
            <div
              key={goal.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                goal.is_primary
                  ? 'border-[#c99e52]/40 bg-[#141926]'
                  : 'border-white/[0.08] bg-[#121620] hover:border-white/[0.14]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-base font-semibold text-white">
                        {goal.name}
                      </h3>
                      {goal.is_primary && (
                        <span className="text-[11px] font-medium text-[#dfb66d]">
                          · Primary Simulation Target
                        </span>
                      )}
                    </div>
                    {/* Unboxed metadata (zero-pill discipline) */}
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                      <span>{goal.category}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Target: {new Date(goal.target_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono text-base font-bold text-white tabular-nums">
                    {pct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-5 h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full rounded-full bg-[#c99e52] transition-all duration-300"
                  />
                </div>

                {/* Current vs Target */}
                <div className="mt-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Current Saved</span>
                    <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">
                      {formatINR(goal.current_amount)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 text-[11px] block">Target Goal</span>
                    <span className="font-mono text-base font-bold text-white tabular-nums">
                      {formatINR(goal.target_amount)}
                    </span>
                  </div>
                </div>

                {/* Quick Add Funds Buttons */}
                {!isFunded && (
                  <div className="mt-4 flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                    <span className="text-[11px] text-slate-400">Quick allocate:</span>
                    <button
                      onClick={() => handleAddFunds(goal.id, goal.current_amount, 5000)}
                      className="text-[11px] px-2.5 py-1 rounded-lg border border-white/[0.1] bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.06] font-mono tabular-nums transition-colors"
                    >
                      +₹5,000
                    </button>
                    <button
                      onClick={() => handleAddFunds(goal.id, goal.current_amount, 10000)}
                      className="text-[11px] px-2.5 py-1 rounded-lg border border-white/[0.1] bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.06] font-mono tabular-nums transition-colors"
                    >
                      +₹10,000
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  {!goal.is_primary && (
                    <button
                      onClick={() => updateGoal(goal.id, { is_primary: true })}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      Set as Primary
                    </button>
                  )}
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Delete goal"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => handleSimulateGoal(goal.name)}
                  className="inline-flex items-center gap-1.5 text-[#dfb66d] hover:underline font-semibold"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Simulate Horizon →</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <AddGoalModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
};
