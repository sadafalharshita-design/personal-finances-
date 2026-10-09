import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { ProjectionChart } from '../components/charts/ProjectionChart';
import { formatINR } from '../components/common/FormatRupee';
import {
  Sparkles,
  ArrowRight,
  Target,
  Shield,
  HelpCircle,
  History,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const WhatIfSimulatorView: React.FC = () => {
  const {
    currentSimulation,
    executeSimulation,
    scenarioHistory,
    setCurrentSimulation,
    monthlyIncome,
    monthlyExpenses,
    primaryGoal,
  } = useFinance();

  const [query, setQuery] = useState(
    currentSimulation?.query || 'What if I save ₹3,000 more every month?'
  );
  const [safetyBuffer, setSafetyBuffer] = useState<string>(
    currentSimulation ? String(currentSimulation.safety_buffer) : '20000'
  );
  const [isRunning, setIsRunning] = useState(false);

  const presetQueries = [
    'What if I save ₹3,000 more every month?',
    'What if I save ₹5,000 more every month?',
    'What if I spend ₹2,000 less on shopping?',
    'What if I reduce food spending by ₹1,500?',
    'When can I afford a ₹1 lakh laptop?',
    'What if I take a ₹15,000/month car EMI for 3 years?',
    'What if I get a ₹25,000 monthly salary hike?',
  ];

  const handleRunSimulation = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToRun = customQuery || query;
    if (!queryToRun.trim()) return;

    setIsRunning(true);
    // Smooth immediate reaction
    setTimeout(() => {
      const buffer = parseFloat(safetyBuffer) || 20000;
      executeSimulation(queryToRun, buffer);
      setIsRunning(false);
    }, 280);
  };

  const handleSelectPreset = (preset: string) => {
    setQuery(preset);
    handleRunSimulation(undefined, preset);
  };

  const baselineSavings = Math.max(1000, monthlyIncome - monthlyExpenses);

  return (
    <div className="space-y-8">
      {/* Hero Simulation Header */}
      <section className="relative overflow-hidden rounded-3xl border border-[#c99e52]/20 bg-[#121622] p-6 sm:p-8">
        <div className="relative grid gap-8 lg:grid-cols-12">
          {/* Main prompt input column */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#dfb66d]">
              <Sparkles className="h-4 w-4" />
              <span>Financial Decision Engine</span>
            </div>

            <h1 className="font-heading text-2xl sm:text-4xl font-bold tracking-tight text-white">
              Ask a question about your financial future.
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              Natural language intent interpreted directly against your real cash-flow baseline.
              Calculates deterministic 12-month projections, goal acceleration, and liquidity cushions.
            </p>

            {/* Input Box */}
            <form onSubmit={handleRunSimulation} className="mt-4 space-y-4">
              <div className="rounded-2xl border border-white/[0.12] bg-[#0c0f17] p-3 shadow-inner">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. What if I save ₹5,000 more every month? Or when can I afford a ₹1 lakh laptop?"
                  rows={3}
                  className="w-full resize-none bg-transparent p-2 text-sm sm:text-base text-white placeholder:text-slate-600 focus:outline-none"
                />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-white/[0.08]">
                  {/* Safety Buffer Setting */}
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Shield className="h-3.5 w-3.5 text-[#dfb66d]" />
                    <span>Safety Buffer:</span>
                    <div className="relative inline-flex items-center">
                      <span className="text-slate-500 font-mono text-xs pl-1">₹</span>
                      <input
                        type="number"
                        value={safetyBuffer}
                        onChange={(e) => setSafetyBuffer(e.target.value)}
                        className="w-24 rounded border border-white/[0.1] bg-white/[0.04] px-1.5 py-1 text-xs text-white font-mono focus:border-[#c99e52] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Run Button */}
                  <button
                    type="submit"
                    disabled={isRunning}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c99e52] px-5 py-2.5 text-xs font-bold text-[#0c0f17] shadow hover:bg-[#dfb66d] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    <span>{isRunning ? 'Calculating...' : 'Run This Simulation'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Preset Query Filter / Segmented buttons */}
              <div className="space-y-1.5 pt-1">
                <p className="text-xs text-slate-400">Quick scenario templates:</p>
                <div className="flex flex-wrap gap-2">
                  {presetQueries.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        query === preset
                          ? 'border-[#c99e52] bg-[#c99e52]/15 text-[#dfb66d] font-medium'
                          : 'border-white/[0.08] bg-white/[0.03] text-slate-300 hover:border-white/[0.18] hover:text-white'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Right Info Box: Baseline Context */}
          <div className="lg:col-span-4 rounded-2xl border border-white/[0.08] bg-black/30 p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-heading text-sm font-semibold text-slate-200 uppercase tracking-wider">
                Current Ground Truth
              </h3>

              <div className="space-y-3 divide-y divide-white/[0.06] text-xs">
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-400">Monthly Net Inflow</span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    {formatINR(monthlyIncome)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-400">Monthly Total Outflow</span>
                  <span className="font-mono text-slate-300">
                    {formatINR(monthlyExpenses)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-400">Baseline Monthly Surplus</span>
                  <span className="font-mono text-[#dfb66d] font-bold">
                    {formatINR(baselineSavings)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-400">Active Priority Goal</span>
                  <span className="text-slate-300 truncate max-w-[150px] font-medium">
                    {primaryGoal?.name || 'Emergency Fund'}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-slate-500 leading-normal border-t border-white/[0.06] pt-3">
              Deterministic calculations guarantee that every rupee is accounted for from your actual
              accounts, preserving financial invariants.
            </p>
          </div>
        </div>
      </section>

      {/* Simulation Output Section */}
      {currentSimulation && (
        <div className="space-y-6">
          {/* Key Metric Results Strip (4 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Baseline Savings */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#121620] p-5">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Baseline Savings / Mo
              </span>
              <p className="mt-3 font-mono text-2xl font-bold tracking-tight text-slate-300 tabular-nums">
                {formatINR(currentSimulation.baseline_monthly_savings)}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">Current trajectory rate</p>
            </div>

            {/* Simulated Savings */}
            <div className="rounded-2xl border border-[#c99e52]/30 bg-[#141926] p-5">
              <span className="text-xs font-medium uppercase tracking-wider text-[#dfb66d]">
                What-If Savings / Mo
              </span>
              <p className="mt-3 font-mono text-2xl font-bold tracking-tight text-[#dfb66d] tabular-nums">
                {formatINR(currentSimulation.simulated_monthly_savings)}
              </p>
              <p className="mt-1 text-[11px] text-slate-400 font-mono">
                {currentSimulation.net_monthly_delta >= 0 ? '+' : ''}
                {formatINR(currentSimulation.net_monthly_delta)} net shift
              </p>
            </div>

            {/* 12-Month Difference */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#121620] p-5">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                12-Month Impact
              </span>
              <p
                className={`mt-3 font-mono text-2xl font-bold tracking-tight tabular-nums ${
                  currentSimulation.twelve_month_difference >= 0
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              >
                {currentSimulation.twelve_month_difference >= 0 ? '+' : ''}
                {formatINR(currentSimulation.twelve_month_difference)}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">Cumulative difference</p>
            </div>

            {/* Goal Acceleration */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#121620] p-5">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Goal Acceleration
              </span>
              <p className="mt-3 font-mono text-2xl font-bold tracking-tight text-white tabular-nums">
                {currentSimulation.goal_acceleration_months > 0
                  ? `${currentSimulation.goal_acceleration_months} months sooner`
                  : 'On target pace'}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                {currentSimulation.goal_name || 'Primary Goal'}
              </p>
            </div>
          </div>

          {/* Grid: 12-Month Chart + Goal Impact Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart Column (8 cols) */}
            <div className="lg:col-span-8 rounded-2xl border border-white/[0.08] bg-[#121620] p-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                <div>
                  <h3 className="font-heading text-base font-semibold text-white">
                    Cumulative Savings Trajectory
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    12-month compounding comparison: Baseline vs What-If Simulated.
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400">12 Months</span>
              </div>

              <div className="mt-5">
                <ProjectionChart data={currentSimulation.projections} height={280} />
              </div>
            </div>

            {/* Goal Impact & Affordability Column (4 cols) */}
            <div className="lg:col-span-4 rounded-2xl border border-white/[0.08] bg-[#121620] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 pb-3 border-b border-white/[0.06]">
                  <Target className="h-4 w-4 text-[#dfb66d]" />
                  <span>Goal Impact Breakdown</span>
                </div>

                <div className="mt-4">
                  <h4 className="font-heading text-base font-semibold text-white">
                    {currentSimulation.goal_name || 'Primary Financial Goal'}
                  </h4>

                  {currentSimulation.goal_name ? (
                    <div className="mt-5 space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/[0.06]">
                        <div>
                          <p className="text-[11px] text-slate-400 uppercase">Baseline Horizon</p>
                          <p className="mt-1 font-mono text-lg font-bold text-slate-300">
                            {currentSimulation.baseline_goal_months ?? '—'} months
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-500" />
                        <div className="text-right">
                          <p className="text-[11px] text-[#dfb66d] uppercase">Simulated Horizon</p>
                          <p className="mt-1 font-mono text-lg font-bold text-[#dfb66d]">
                            {currentSimulation.simulated_goal_months ?? '—'} months
                          </p>
                        </div>
                      </div>

                      {currentSimulation.goal_acceleration_months > 0 && (
                        <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] text-xs text-emerald-300 leading-relaxed">
                          This decision advances funding for your goal by approximately{' '}
                          <span className="font-bold">{currentSimulation.goal_acceleration_months} month(s)</span>.
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                      Link or create a primary goal in the Goals tab to unlock detailed goal timeline
                      acceleration models.
                    </p>
                  )}

                  {/* Affordability Horizon (if applicable) */}
                  {currentSimulation.affordability_months !== null && (
                    <div className="mt-5 p-4 rounded-xl border border-[#c99e52]/25 bg-[#c99e52]/[0.06]">
                      <span className="text-xs font-semibold text-[#dfb66d] uppercase tracking-wider">
                        Cash Affordability Horizon
                      </span>
                      <p className="mt-2 font-mono text-2xl font-bold text-white">
                        {currentSimulation.affordability_months} Months
                      </p>
                      <p className="mt-1 text-xs text-slate-300">
                        Until full lump sum is accumulated without touching your ₹
                        {currentSimulation.safety_buffer.toLocaleString('en-IN')} safety buffer.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] text-[11px] text-slate-500">
                Safety buffer allocation: ₹{currentSimulation.safety_buffer.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* AI Decision Explanation Box */}
          <div className="rounded-2xl border border-[#c99e52]/20 bg-[#10141f] p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#dfb66d]">
              <Sparkles className="h-4 w-4" />
              <span>Decision Intelligence Analysis</span>
            </div>

            <p className="mt-3 text-sm text-slate-200 leading-relaxed max-w-4xl">
              {currentSimulation.ai_explanation}
            </p>
          </div>

          {/* Stated Assumptions List */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#121620] p-5">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-[#dfb66d]" />
              <span>Stated Mathematical Assumptions</span>
            </div>
            <ul className="mt-3 space-y-2 text-xs text-slate-400">
              {currentSimulation.assumptions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-slate-600 font-mono">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Scenario History Section */}
      <section className="rounded-2xl border border-white/[0.08] bg-[#121620] p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-slate-400" />
            <h3 className="font-heading text-base font-semibold text-white">Simulated Scenarios History</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {scenarioHistory.length} completed
          </span>
        </div>

        <div className="mt-4 divide-y divide-white/[0.05]">
          {scenarioHistory.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-500">
              Your completed simulations will appear here.
            </p>
          ) : (
            scenarioHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setCurrentSimulation(item);
                  setQuery(item.query);
                  setSafetyBuffer(String(item.safety_buffer));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] px-2 rounded-lg transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-[#dfb66d] transition-colors">
                    {item.scenario_summary}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(item.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    · {item.scenario_type.replace(/_/g, ' ')}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs font-semibold text-[#dfb66d] tabular-nums">
                    {item.twelve_month_difference >= 0 ? '+' : ''}
                    {formatINR(item.twelve_month_difference)} / yr
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Legal & Decision Support Disclaimer */}
      <p className="text-center text-[11px] text-slate-500 leading-normal max-w-2xl mx-auto py-2">
        Projections are mathematical estimates based on historical financial baseline data and stated
        assumptions. Actual market performance, inflation, and expenses may differ. Meridian Wealth is
        decision support, not certified financial advice.
      </p>
    </div>
  );
};
