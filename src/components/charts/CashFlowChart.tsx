import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { FormatRupee, formatINR } from '../common/FormatRupee';

export const CashFlowChart: React.FC = () => {
  const { transactions, monthlyIncome, monthlyExpenses, monthlySavings, budgets } = useFinance();

  // Aggregate expenses by category
  const categoryExpenses: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'EXPENSE')
    .forEach((t) => {
      categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
    });

  const sortedCategories = Object.entries(categoryExpenses)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const totalExp = Math.max(1, monthlyExpenses);

  const incomeVsExpenseMax = Math.max(monthlyIncome, monthlyExpenses, 10000);

  return (
    <div className="space-y-6">
      {/* High-level Cash Flow Balance Meter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Net Cash Flow Distribution</span>
          <span className="font-mono tabular-nums text-slate-300">
            {formatINR(monthlySavings)} retained
          </span>
        </div>

        {/* Multi-segment distribution bar */}
        <div className="h-3 w-full rounded-full bg-white/[0.05] overflow-hidden flex">
          <div
            style={{ width: `${Math.min(100, (monthlyExpenses / Math.max(1, monthlyIncome)) * 100)}%` }}
            className="bg-[#e06c75] transition-all duration-300"
            title={`Expenses: ${formatINR(monthlyExpenses)}`}
          />
          <div
            style={{ width: `${Math.max(0, 100 - (monthlyExpenses / Math.max(1, monthlyIncome)) * 100)}%` }}
            className="bg-[#10b981] transition-all duration-300"
            title={`Net Surplus: ${formatINR(monthlySavings)}`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-[#e06c75]" />
            <span>Monthly Outflow:</span>
            <FormatRupee amount={monthlyExpenses} className="text-white font-medium" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-[#10b981]" />
            <span>Retained Capital:</span>
            <FormatRupee amount={monthlySavings} className="text-[#10b981] font-semibold" />
          </div>
        </div>
      </div>

      {/* Top Expense Categories Breakdown */}
      <div className="space-y-3 pt-2 border-t border-white/[0.06]">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Major Expense Drivers</span>
          <span className="text-[11px] text-slate-500">Current Month</span>
        </div>

        <div className="space-y-2.5">
          {sortedCategories.map(([category, amount]) => {
            const pct = Math.round((amount / totalExp) * 100);
            const budgetItem = budgets.find((b) => b.category.toLowerCase() === category.toLowerCase());
            const limit = budgetItem ? budgetItem.monthly_budget : 0;
            const isNearOrOver = limit > 0 && amount >= limit * 0.9;

            return (
              <div key={category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-medium">{category}</span>
                    <span className="text-slate-500 text-[11px]">· {pct}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono tabular-nums text-xs">
                    <span className={isNearOrOver ? 'text-[#e06c75]' : 'text-slate-200'}>
                      {formatINR(amount)}
                    </span>
                    {limit > 0 && (
                      <span className="text-slate-500 text-[11px]">/ {formatINR(limit, true)}</span>
                    )}
                  </div>
                </div>

                {/* Micro progress line */}
                <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    style={{
                      width: limit > 0 ? `${Math.min(100, (amount / limit) * 100)}%` : `${pct}%`,
                    }}
                    className={`h-full rounded-full transition-all duration-300 ${
                      isNearOrOver ? 'bg-[#e06c75]' : 'bg-[#c99e52]'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
