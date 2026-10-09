import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { FormatRupee, formatINR } from '../components/common/FormatRupee';
import { CashFlowChart } from '../components/charts/CashFlowChart';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  Sparkles,
  ArrowRight,
  Target,
  Clock,
  ChevronRight,
} from 'lucide-react';

interface OverviewViewProps {
  onOpenAddTransaction: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onOpenAddTransaction }) => {
  const {
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    monthlySavings,
    savingsRate,
    budgetRemaining,
    primaryGoal,
    goals,
    transactions,
    accounts,
    setActiveTab,
    executeSimulation,
  } = useFinance();

  const recentTransactions = transactions.slice(0, 7);

  const handleLaunchQuickSim = () => {
    executeSimulation('What if I save ₹3,000 more every month?', 20000);
    setActiveTab('what-if');
  };

  return (
    <div className="space-y-8">
      {/* View Header with 1-line clean title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Financial Baseline Overview
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Real-time balance consolidated across accounts, monthly cash flow, and goal trajectories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('what-if')}
            className="inline-flex items-center gap-2 rounded-xl border border-[#c99e52]/30 bg-[#c99e52]/10 px-4 py-2 text-xs font-semibold text-[#dfb66d] hover:bg-[#c99e52]/20 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Launch What-If Engine</span>
          </button>
        </div>
      </div>

      {/* 5-Column Core Metric Strip (Tabular figures, single elevation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Balance */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#121620] p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Total Net Worth
            </span>
            <Wallet className="h-4 w-4 text-[#c99e52]" />
          </div>
          <div className="mt-3">
            <p className="font-mono text-2xl font-bold tracking-tight text-white tabular-nums">
              {formatINR(totalBalance)}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Across {accounts.length} linked accounts
            </p>
          </div>
        </div>

        {/* Monthly Inflow */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#121620] p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Monthly Inflow
            </span>
            <ArrowUpRight className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <p className="font-mono text-2xl font-bold tracking-tight text-emerald-400 tabular-nums">
              {formatINR(monthlyIncome)}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">Salary & consulting credits</p>
          </div>
        </div>

        {/* Monthly Outflow */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#121620] p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Monthly Outflow
            </span>
            <ArrowDownLeft className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-3">
            <p className="font-mono text-2xl font-bold tracking-tight text-slate-200 tabular-nums">
              {formatINR(monthlyExpenses)}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">Current billing period</p>
          </div>
        </div>

        {/* Budget Remaining */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#121620] p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Budget Runway
            </span>
            <PiggyBank className="h-4 w-4 text-[#dfb66d]" />
          </div>
          <div className="mt-3">
            <p className="font-mono text-2xl font-bold tracking-tight text-[#dfb66d] tabular-nums">
              {formatINR(budgetRemaining)}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">Unallocated monthly headroom</p>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#121620] p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Savings Rate
            </span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">{savingsRate}%</span>
          </div>
          <div className="mt-3">
            <p className="font-mono text-2xl font-bold tracking-tight text-white tabular-nums">
              {formatINR(monthlySavings)}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">Net monthly capital retained</p>
          </div>
        </div>
      </div>

      {/* Hero Simulation Callout Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-[#c99e52]/25 bg-gradient-to-r from-[#141a27] via-[#10141f] to-[#0c0f17] p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-[#dfb66d]">
            <Sparkles className="h-4 w-4" />
            <span>Deterministic Financial Modeling</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
            What if I save ₹3,000 more every month?
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Simulate your verified income and spending baseline to forecast 12-month compounding,
            liquidity cushions, and see exactly how many months sooner your top goal becomes fully funded.
          </p>

          <div className="pt-2">
            <button
              onClick={handleLaunchQuickSim}
              className="inline-flex items-center gap-2 rounded-xl bg-[#c99e52] px-5 py-2.5 text-xs font-bold text-[#0c0f17] hover:bg-[#dfb66d] active:scale-[0.98] transition-all"
            >
              <span>Run This Simulation</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Split Grid: Cash Flow Analysis & Goals Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cash Flow & Category Dynamics (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#121620] p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div>
              <h3 className="font-heading text-base font-semibold text-white">
                Cash Flow & Discretionary Drivers
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Understand spending behavior before modeling What-If deviations.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('budget')}
              className="text-xs text-[#dfb66d] hover:underline font-medium"
            >
              Adjust Limits →
            </button>
          </div>

          <div className="mt-5">
            <CashFlowChart />
          </div>
        </div>

        {/* Right Column: Active Goals Runway (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#121620] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div>
                <h3 className="font-heading text-base font-semibold text-white">Target Horizons</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Connected to What-If simulation engine.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('goals')}
                className="text-xs text-[#dfb66d] hover:underline font-medium"
              >
                All Goals →
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {goals.slice(0, 3).map((goal) => {
                const pct = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
                const remaining = Math.max(0, goal.target_amount - goal.current_amount);
                const monthsLeft =
                  goal.monthly_contribution > 0
                    ? Math.ceil(remaining / goal.monthly_contribution)
                    : 12;

                return (
                  <div
                    key={goal.id}
                    className="rounded-xl border border-white/[0.06] bg-black/25 p-4 hover:border-white/[0.12] transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-white">{goal.name}</h4>
                          {goal.is_primary && (
                            <span className="text-[10px] text-[#dfb66d] font-medium tracking-wide">
                              · Primary
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-400 font-mono tabular-nums">
                          <span>{formatINR(goal.current_amount)}</span>
                          <span className="text-slate-600">/</span>
                          <span>{formatINR(goal.target_amount)}</span>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-300">
                        {pct}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full rounded-full bg-[#c99e52] transition-all duration-300"
                      />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Target: {new Date(goal.target_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                      <span>~{monthsLeft} months remaining</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/[0.06]">
            <button
              onClick={() => setActiveTab('goals')}
              className="w-full py-2 text-center text-xs text-slate-400 hover:text-white transition-colors"
            >
              + Create or Prioritize New Goals
            </button>
          </div>
        </div>
      </div>

      {/* Recent Ledger Entries (Zero-Pill Discipline) */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#121620] p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div>
            <h3 className="font-heading text-base font-semibold text-white">Recent Transactions</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified entries feeding into your baseline calculation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAddTransaction}
              className="text-xs text-slate-300 hover:text-white"
            >
              + Log Entry
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className="text-xs text-[#dfb66d] hover:underline font-medium"
            >
              Full Ledger →
            </button>
          </div>
        </div>

        <div className="mt-4 divide-y divide-white/[0.05]">
          {recentTransactions.map((tx) => {
            const acc = accounts.find((a) => a.id === tx.account_id);
            const isIncome = tx.type === 'INCOME';

            return (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-white/[0.02] px-2 rounded-lg transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{tx.merchant}</p>
                  {/* Clean unboxed text metadata with · separators (No pills!) */}
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                    <span>{acc?.name || 'Account'}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span>{new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span>{tx.category}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={`font-mono text-sm font-semibold tabular-nums ${
                      isIncome ? 'text-emerald-400' : 'text-slate-200'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatINR(tx.amount)}
                  </p>
                  {tx.note && (
                    <p className="text-[11px] text-slate-500 truncate max-w-[140px]">{tx.note}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
