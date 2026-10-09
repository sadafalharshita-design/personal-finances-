export type AccountType = 'SAVINGS' | 'CHECKING' | 'CREDIT_CARD' | 'INVESTMENT' | 'CASH';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  is_default: boolean;
  institution?: string;
  account_number_mask?: string;
  created_at: string;
}

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  account_id: string;
  type: TransactionType;
  amount: number;
  category: string;
  merchant: string;
  note?: string;
  date: string;
  is_recurring?: boolean;
  recurring_interval?: string | null;
  receipt_url?: string;
}

export interface BudgetCategory {
  id: string;
  category: string;
  monthly_budget: number;
}

export interface FinancialGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  monthly_contribution: number;
  category: string;
  is_primary?: boolean;
}

export interface ProjectionPoint {
  month: number;
  monthName: string;
  baseline: number;
  simulated: number;
}

export interface SimulationResult {
  id: string;
  query: string;
  safety_buffer: number;
  baseline_monthly_savings: number;
  simulated_monthly_savings: number;
  net_monthly_delta: number;
  twelve_month_difference: number;
  goal_name: string | null;
  baseline_goal_months: number | null;
  simulated_goal_months: number | null;
  goal_acceleration_months: number;
  affordability_months: number | null;
  item_target_cost?: number | null;
  projections: ProjectionPoint[];
  ai_explanation: string;
  assumptions: string[];
  scenario_summary: string;
  scenario_type: string;
  created_at: string;
}

export interface LineItem {
  description: string;
  qty: number;
  price: number;
  total: number;
}

export interface ReceiptExtraction {
  merchant: string;
  date: string;
  amount: number;
  tax: number;
  category: string;
  payment_method: string;
  line_items: LineItem[];
  invoice_number?: string;
  notes?: string;
  confidence_score: number;
}

export type ActiveTab = 'overview' | 'what-if' | 'accounts' | 'transactions' | 'budget' | 'goals' | 'scan';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  tier: string;
  avatar_initials: string;
}
