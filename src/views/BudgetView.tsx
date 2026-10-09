import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatINR } from '../components/common/FormatRupee';
import { EXPENSE_CATEGORIES } from '../data/seedData';
import { PiggyBank, Plus, AlertTriangle, CheckCircle } from 'lucide-react';

export const BudgetView: React.FC = () => {
  const {
    budgets,
    transactions,
    totalBudgetLimit,
    totalBudgetSpent,
    budgetRemaining,
    updateBudgetLimit,
  } = useFinance();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLimit, setEditLimit] = useState<string>('');

  // Calculate actual spent per category for current transactions
  const categorySpentMap: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'EXPENSE')
    .forEach((t) => {
      categorySpentMap[t.category.toLowerCase()] =
        (categorySpentMap[t.category.toLowerCase()] || 0) + t.amount;
    });

  const handleStartEdit = (id: string, currentLimit: number) => {
    setEditingId(id);
    setEditLimit(String(currentLimit));
  };

  const handleSaveEdit = (id: string) => {
    const parsed = parseFloat(editLimit);
    if (!isNaN(parsed) && parsed >= 0) {
      updateBudgetLimit(id, parsed);
    }
    setEditingId(null);
  };

  const overallPct =
    totalBudgetLimit > 0 ? Math.round((totalBudgetSpent / totalBudgetLimit) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Monthly Category Budgets
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Set deliberate monthly spending guardrails that protect your What-If savings baseline.
          </p>
        </div>
      </div>

      {/* Aggregate Budget Runway Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/[0.08] bg-[#121620] p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Total Monthly Limit</span>
            <PiggyBank className="h-4 w-4 text-[#dfb66d]" />
          </div>
          <p className="mt-3 font-mono text-2xl font-bold text-white tabular-nums">
            {formatINR(totalBudgetLimit)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Sum of category caps</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#121620] p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Spent to Date</span>
            <span className="font-mono text-xs text-slate-300">{overallPct}%</span>
          </div>
          <p className="mt-3 font-mono text-2xl font-bold text-slate-200 tabular-nums">
            {formatINR(totalBudgetSpent)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Current calendar month</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#121620] p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Remaining Headroom</span>
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-3 font-mono text-2xl font-bold text-emerald-400 tabular-nums">
            {formatINR(budgetRemaining)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Unallocated surplus buffer</p>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {budgets.map((b) => {
          const spent = categorySpentMap[b.category.toLowerCase()] || 0;
          const pct = b.monthly_budget > 0 ? Math.round((spent / b.monthly_budget) * 100) : 0;
          const isOver = spent > b.monthly_budget;
          const isWarning = pct >= 85 && !isOver;

          return (
            <div
              key={b.id}
              className="rounded-2xl border border-white/[0.08] bg-[#121620] p-5 flex flex-col justify-between hover:border-white/[0.14] transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading text-sm font-semibold text-white">{b.category}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isOver ? (
                        <span className="text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Exceeded limit
                        </span>
                      ) : isWarning ? (
                        <span className="text-amber-400">Approaching ceiling</span>
                      ) : (
                        <span>Normal pacing</span>
                      )}
                    </p>
                  </div>

                  <span className={`font-mono text-xs font-semibold ${isOver ? 'text-rose-400' : 'text-slate-300'}`}>
                    {pct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, pct)}%` }}
                    className={`h-full rounded-full transition-all duration-300 ${
                      isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-[#c99e52]'
                    }`}
                  />
                </div>

                {/* Amount readouts */}
                <div className="mt-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Spent</span>
                    <span className="font-mono text-sm font-semibold text-white tabular-nums">
                      {formatINR(spent)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 text-[11px] block">Monthly Limit</span>
                    {editingId === b.id ? (
                      <div className="flex items-center gap-1 mt-0.5">
                        <input
                          type="number"
                          value={editLimit}
                          onChange={(e) => setEditLimit(e.target.value)}
                          className="w-20 rounded border border-[#c99e52] bg-[#0b0e14] px-1.5 py-0.5 text-xs text-white font-mono"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(b.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                        />
                        <button
                          onClick={() => handleSaveEdit(b.id)}
                          className="text-[11px] text-[#dfb66d] hover:underline"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(b.id, b.monthly_budget)}
                        className="font-mono text-sm font-semibold text-slate-300 tabular-nums hover:text-[#dfb66d] transition-colors"
                        title="Click to adjust limit"
                      >
                        {formatINR(b.monthly_budget)} ✎
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.06] text-[11px] text-slate-500 flex items-center justify-between">
                <span>Remaining:</span>
                <span className="font-mono text-slate-300 tabular-nums">
                  {formatINR(Math.max(0, b.monthly_budget - spent))}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
