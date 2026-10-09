import { FinancialGoal, ProjectionPoint, SimulationResult } from '../types/finance';

interface SimulationInput {
  query: string;
  safetyBuffer: number;
  baselineIncome: number;
  baselineExpenses: number;
  primaryGoal?: FinancialGoal;
}

export function parseQueryRupees(query: string): number | null {
  // Matches "₹1 lakh", "1 lakh", "1.5 lakh", "₹50,000", "₹5,000", "5000", "3k", etc.
  const lakhMatch = query.match(/(?:₹\s*|inr\s*)?([0-9]+(?:\.[0-9]+)?)\s*(?:lakh|lac|l)/i);
  if (lakhMatch) {
    return Math.round(parseFloat(lakhMatch[1]) * 100000);
  }

  const croreMatch = query.match(/(?:₹\s*|inr\s*)?([0-9]+(?:\.[0-9]+)?)\s*(?:crore|cr)/i);
  if (croreMatch) {
    return Math.round(parseFloat(croreMatch[1]) * 10000000);
  }

  const kMatch = query.match(/(?:₹\s*|inr\s*)?([0-9]+(?:\.[0-9]+)?)\s*k/i);
  if (kMatch) {
    return Math.round(parseFloat(kMatch[1]) * 1000);
  }

  const standardMatch = query.match(/(?:₹\s*|inr\s*)\s*([0-9,]+)/i);
  if (standardMatch) {
    const cleaned = standardMatch[1].replace(/,/g, '');
    const num = parseFloat(cleaned);
    if (!isNaN(num)) return num;
  }

  const numberFallback = query.match(/\b([0-9]{3,7})\b/);
  if (numberFallback) {
    const num = parseFloat(numberFallback[1]);
    if (!isNaN(num)) return num;
  }

  return null;
}

export function runDeterministicSimulation(input: SimulationInput): SimulationResult {
  const { query, safetyBuffer, baselineIncome, baselineExpenses, primaryGoal } = input;
  const qLower = query.toLowerCase();

  const baselineSavings = Math.max(1000, baselineIncome - baselineExpenses);
  const detectedAmount = parseQueryRupees(query);

  let scenarioType = 'MONTHLY_SAVINGS_BOOST';
  let monthlyDelta = 0;
  let itemCost: number | null = null;
  let explanation = '';
  let assumptions: string[] = [];
  let summary = query;

  if (qLower.includes('afford') || qLower.includes('buy') || qLower.includes('laptop') || qLower.includes('phone') || qLower.includes('when can i')) {
    scenarioType = 'PURCHASE_AFFORDABILITY';
    itemCost = detectedAmount ?? 100000; // default ₹1,00,000
    monthlyDelta = 0; // standard savings rate directed to item
    const netSavings = Math.max(1, baselineSavings);
    const monthsToAfford = Math.ceil(itemCost / netSavings);

    summary = `Purchase affordability for ₹${itemCost.toLocaleString('en-IN')}`;
    explanation = `At your current monthly surplus of ₹${baselineSavings.toLocaleString('en-IN')}, accumulating ₹${itemCost.toLocaleString('en-IN')} while safeguarding your ₹${safetyBuffer.toLocaleString('en-IN')} emergency buffer requires approximately ${monthsToAfford} month(s) of disciplined allocation. No recurring debt or interest payments will be incurred.`;
    assumptions = [
      `Assumes ₹${itemCost.toLocaleString('en-IN')} one-time lump-sum cash outflow`,
      `Liquid emergency buffer of ₹${safetyBuffer.toLocaleString('en-IN')} remains untouched`,
      `Baseline savings rate stays consistent at ₹${baselineSavings.toLocaleString('en-IN')}/mo`,
    ];
  } else if (qLower.includes('reduce') || qLower.includes('less') || qLower.includes('cut')) {
    scenarioType = 'EXPENSE_REDUCTION';
    monthlyDelta = detectedAmount ?? 2000;
    summary = `Reduce discretionary spend by ₹${monthlyDelta.toLocaleString('en-IN')}/mo`;
    explanation = `Trimming ₹${monthlyDelta.toLocaleString('en-IN')} in monthly discretionary expenses redirects ₹${(monthlyDelta * 12).toLocaleString('en-IN')} of pure capital back into your liquid reserve over 12 months. This directly expands your monthly savings capacity from ₹${baselineSavings.toLocaleString('en-IN')} to ₹${(baselineSavings + monthlyDelta).toLocaleString('en-IN')}.`;
    assumptions = [
      `Expense discipline sustained across all 12 upcoming monthly billing cycles`,
      `Surplus capital automatically swept into high-yield liquidity or mutual funds`,
      `Inflationary expense creep does not offset the cutback`,
    ];
  } else if (qLower.includes('emi') || qLower.includes('loan') || qLower.includes('car')) {
    scenarioType = 'LOAN_EMI_COMMITMENT';
    monthlyDelta = -(detectedAmount ?? 15000);
    summary = `Commit to ₹${Math.abs(monthlyDelta).toLocaleString('en-IN')}/mo loan EMI`;
    explanation = `Committing to a recurring EMI of ₹${Math.abs(monthlyDelta).toLocaleString('en-IN')} per month reduces your monthly savings from ₹${baselineSavings.toLocaleString('en-IN')} down to ₹${Math.max(0, baselineSavings + monthlyDelta).toLocaleString('en-IN')}. Ensure your ₹${safetyBuffer.toLocaleString('en-IN')} safety buffer remains intact before locking in fixed monthly obligations.`;
    assumptions = [
      `Fixed EMI debited automatically on the 5th of each month`,
      `Interest and principal amortization calculated as a fixed monthly outflow`,
      `No early prepayments or interest rate revisions considered`,
    ];
  } else if (qLower.includes('hike') || qLower.includes('raise') || qLower.includes('switch') || qLower.includes('bonus')) {
    scenarioType = 'INCOME_HIKE';
    monthlyDelta = detectedAmount ?? 25000;
    summary = `Salary hike / income increment of ₹${monthlyDelta.toLocaleString('en-IN')}/mo`;
    explanation = `A net monthly income increase of ₹${monthlyDelta.toLocaleString('en-IN')} elevates your annual capital accumulation by ₹${(monthlyDelta * 12).toLocaleString('en-IN')}. If lifestyle inflation is held constant, this creates a formidable wealth compounding trajectory.`;
    assumptions = [
      `Incremental cash flow after tax deductions`,
      `Fixed living expenses remain unchanged without lifestyle creep`,
    ];
  } else {
    // Default: monthly savings boost
    monthlyDelta = detectedAmount ?? 3000;
    summary = `Save ₹${monthlyDelta.toLocaleString('en-IN')} more every month`;
    explanation = `Allocating an extra ₹${monthlyDelta.toLocaleString('en-IN')} every month increases your monthly wealth velocity by ${(
      (monthlyDelta / baselineSavings) *
      100
    ).toFixed(1)}%. Over 12 months, this creates an incremental ₹${(monthlyDelta * 12).toLocaleString(
      'en-IN'
    )} buffer that accelerates your target liquidity timelines.`;
    assumptions = [
      `Steady baseline net cash flow maintained across all 12 months`,
      `Safety buffer of ₹${safetyBuffer.toLocaleString('en-IN')} preserved as liquid reserve`,
      `No extraordinary capital expenditures occur in this period`,
    ];
  }

  const simulatedMonthlySavings = Math.max(0, baselineSavings + monthlyDelta);
  const twelveMonthDifference = (simulatedMonthlySavings - baselineSavings) * 12;

  // Build 12-month projections
  const projections: ProjectionPoint[] = [];
  let cumBaseline = 0;
  let cumSimulated = 0;

  for (let m = 1; m <= 12; m++) {
    cumBaseline += baselineSavings;
    cumSimulated += simulatedMonthlySavings;
    projections.push({
      month: m,
      monthName: `M${m}`,
      baseline: cumBaseline,
      simulated: cumSimulated,
    });
  }

  // Goal impact calculations
  let goalName: string | null = null;
  let baselineGoalMonths: number | null = null;
  let simulatedGoalMonths: number | null = null;
  let goalAccelerationMonths = 0;
  let affordabilityMonths: number | null = null;

  if (itemCost !== null) {
    affordabilityMonths = Math.max(1, Math.ceil(itemCost / Math.max(1, simulatedMonthlySavings || baselineSavings)));
  }

  if (primaryGoal) {
    goalName = primaryGoal.name;
    const remainingGoalCost = Math.max(0, primaryGoal.target_amount - primaryGoal.current_amount);
    if (remainingGoalCost > 0) {
      baselineGoalMonths = Math.ceil(remainingGoalCost / baselineSavings);
      simulatedGoalMonths = simulatedMonthlySavings > 0 ? Math.ceil(remainingGoalCost / simulatedMonthlySavings) : 999;
      goalAccelerationMonths = Math.max(0, baselineGoalMonths - simulatedGoalMonths);
    } else {
      baselineGoalMonths = 0;
      simulatedGoalMonths = 0;
      goalAccelerationMonths = 0;
    }
  }

  return {
    id: `sim-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    query,
    safety_buffer: safetyBuffer,
    baseline_monthly_savings: baselineSavings,
    simulated_monthly_savings: simulatedMonthlySavings,
    net_monthly_delta: monthlyDelta,
    twelve_month_difference: twelveMonthDifference,
    goal_name: goalName,
    baseline_goal_months: baselineGoalMonths,
    simulated_goal_months: simulatedGoalMonths,
    goal_acceleration_months: goalAccelerationMonths,
    affordability_months: affordabilityMonths,
    item_target_cost: itemCost,
    projections,
    ai_explanation: explanation,
    assumptions,
    scenario_summary: summary,
    scenario_type: scenarioType,
    created_at: new Date().toISOString(),
  };
}
