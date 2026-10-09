import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Account,
  Transaction,
  BudgetCategory,
  FinancialGoal,
  SimulationResult,
  ActiveTab,
  UserProfile,
} from '../types/finance';
import {
  INITIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_GOALS,
  INITIAL_SCENARIO_HISTORY,
} from '../data/seedData';
import { runDeterministicSimulation } from '../services/simulationEngine';

interface FinanceContextType {
  accounts: Account[];
  transactions: Transaction[];
  budgets: BudgetCategory[];
  goals: FinancialGoal[];
  scenarioHistory: SimulationResult[];
  currentSimulation: SimulationResult | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Computed Financial Metrics
  totalBalance: number;
  totalLiquidAssets: number;
  totalInvestments: number;
  totalLiabilities: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  savingsRate: number;
  totalBudgetLimit: number;
  totalBudgetSpent: number;
  budgetRemaining: number;
  primaryGoal: FinancialGoal | undefined;

  // Actions
  addTransaction: (tx: Omit<Transaction, 'id'>) => Transaction;
  deleteTransaction: (id: string) => void;
  bulkDeleteTransactions: (ids: string[]) => void;
  addAccount: (acc: Omit<Account, 'id' | 'created_at'>) => Account;
  updateAccount: (id: string, acc: Partial<Account>) => void;
  deleteAccount: (id: string) => boolean;
  setDefaultAccount: (id: string) => void;
  addGoal: (goal: Omit<FinancialGoal, 'id'>) => FinancialGoal;
  updateGoal: (id: string, goal: Partial<FinancialGoal>) => void;
  deleteGoal: (id: string) => void;
  updateBudgetLimit: (id: string, limit: number) => void;
  executeSimulation: (query: string, safetyBuffer: number) => SimulationResult;
  setCurrentSimulation: (sim: SimulationResult | null) => void;
  resetAllData: () => void;

  // Authentication
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

export const DEMO_USER: UserProfile = {
  id: 'usr-rahul',
  name: 'Rahul Sharma',
  email: 'rahul@wealth.demo',
  tier: 'Private Wealth Member',
  avatar_initials: 'RS',
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACCOUNTS: 'meridian_accounts_v1',
  TRANSACTIONS: 'meridian_transactions_v1',
  BUDGETS: 'meridian_budgets_v1',
  GOALS: 'meridian_goals_v1',
  HISTORY: 'meridian_history_v1',
  USER: 'meridian_user_v1',
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : DEMO_USER;
    } catch {
      return DEMO_USER;
    }
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [budgets, setBudgets] = useState<BudgetCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
    } catch {
      return INITIAL_BUDGETS;
    }
  });

  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      return saved ? JSON.parse(saved) : INITIAL_GOALS;
    } catch {
      return INITIAL_GOALS;
    }
  });

  const [scenarioHistory, setScenarioHistory] = useState<SimulationResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : INITIAL_SCENARIO_HISTORY;
    } catch {
      return INITIAL_SCENARIO_HISTORY;
    }
  });

  const [currentSimulation, setCurrentSimulation] = useState<SimulationResult | null>(() => {
    return scenarioHistory.length > 0 ? scenarioHistory[0] : null;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    } catch (e) {
      console.error(e);
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    } catch (e) {
      console.error(e);
    }
  }, [budgets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch (e) {
      console.error(e);
    }
  }, [goals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(scenarioHistory));
    } catch (e) {
      console.error(e);
    }
  }, [scenarioHistory]);

  // Computed Financial Metrics
  const totalBalance = useMemo(() => {
    return accounts.reduce((acc, a) => acc + a.balance, 0);
  }, [accounts]);

  const totalLiquidAssets = useMemo(() => {
    return accounts
      .filter((a) => ['SAVINGS', 'CHECKING', 'CASH'].includes(a.type) && a.balance > 0)
      .reduce((acc, a) => acc + a.balance, 0);
  }, [accounts]);

  const totalInvestments = useMemo(() => {
    return accounts
      .filter((a) => a.type === 'INVESTMENT')
      .reduce((acc, a) => acc + Math.max(0, a.balance), 0);
  }, [accounts]);

  const totalLiabilities = useMemo(() => {
    return accounts.reduce((acc, a) => (a.balance < 0 ? acc + Math.abs(a.balance) : acc), 0);
  }, [accounts]);

  // Current Month Inflow vs Outflow
  const { monthlyIncome, monthlyExpenses } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    for (const tx of transactions) {
      if (tx.type === 'INCOME') inc += tx.amount;
      if (tx.type === 'EXPENSE') exp += tx.amount;
    }
    return { monthlyIncome: inc, monthlyExpenses: exp };
  }, [transactions]);

  const monthlySavings = Math.max(0, monthlyIncome - monthlyExpenses);
  const savingsRate = monthlyIncome > 0 ? Math.round((monthlySavings / monthlyIncome) * 100) : 0;

  const totalBudgetLimit = useMemo(() => {
    return budgets.reduce((acc, b) => acc + b.monthly_budget, 0);
  }, [budgets]);

  const totalBudgetSpent = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const budgetRemaining = Math.max(0, totalBudgetLimit - totalBudgetSpent);

  const primaryGoal = useMemo(() => {
    return goals.find((g) => g.is_primary) || goals[0];
  }, [goals]);

  // Actions
  const addTransaction = (data: Omit<Transaction, 'id'>): Transaction => {
    const newTx: Transaction = {
      ...data,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update account balance
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === newTx.account_id) {
          const delta = newTx.type === 'INCOME' ? newTx.amount : -newTx.amount;
          return { ...acc, balance: acc.balance + delta };
        }
        return acc;
      })
    );

    return newTx;
  };

  const deleteTransaction = (id: string) => {
    const target = transactions.find((t) => t.id === id);
    if (!target) return;

    setTransactions((prev) => prev.filter((t) => t.id !== id));

    // Revert account balance
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === target.account_id) {
          const revertDelta = target.type === 'INCOME' ? -target.amount : target.amount;
          return { ...acc, balance: acc.balance + revertDelta };
        }
        return acc;
      })
    );
  };

  const bulkDeleteTransactions = (ids: string[]) => {
    const targets = transactions.filter((t) => ids.includes(t.id));
    if (targets.length === 0) return;

    setTransactions((prev) => prev.filter((t) => !ids.includes(t.id)));

    setAccounts((prev) =>
      prev.map((acc) => {
        const accTargets = targets.filter((t) => t.account_id === acc.id);
        const delta = accTargets.reduce((sum, t) => {
          return sum + (t.type === 'INCOME' ? -t.amount : t.amount);
        }, 0);
        return { ...acc, balance: acc.balance + delta };
      })
    );
  };

  const addAccount = (accData: Omit<Account, 'id' | 'created_at'>): Account => {
    const newAccount: Account = {
      ...accData,
      id: `acc-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    if (newAccount.is_default) {
      setAccounts((prev) => [newAccount, ...prev.map((a) => ({ ...a, is_default: false }))]);
    } else {
      setAccounts((prev) => [...prev, newAccount]);
    }

    return newAccount;
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return { ...a, ...updates };
        }
        if (updates.is_default && a.id !== id) {
          return { ...a, is_default: false };
        }
        return a;
      })
    );
  };

  const deleteAccount = (id: string): boolean => {
    const hasTransactions = transactions.some((t) => t.account_id === id);
    if (hasTransactions) {
      return false; // protect account with active transactions
    }
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    return true;
  };

  const setDefaultAccount = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) => ({
        ...a,
        is_default: a.id === id,
      }))
    );
  };

  const addGoal = (goalData: Omit<FinancialGoal, 'id'>): FinancialGoal => {
    const newGoal: FinancialGoal = {
      ...goalData,
      id: `goal-${Date.now()}`,
    };
    if (newGoal.is_primary) {
      setGoals((prev) => [newGoal, ...prev.map((g) => ({ ...g, is_primary: false }))]);
    } else {
      setGoals((prev) => [...prev, newGoal]);
    }
    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<FinancialGoal>) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          return { ...g, ...updates };
        }
        if (updates.is_primary && g.id !== id) {
          return { ...g, is_primary: false };
        }
        return g;
      })
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const updateBudgetLimit = (id: string, limit: number) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, monthly_budget: limit } : b))
    );
  };

  const executeSimulation = (query: string, safetyBuffer: number): SimulationResult => {
    const result = runDeterministicSimulation({
      query,
      safetyBuffer,
      baselineIncome: monthlyIncome,
      baselineExpenses: monthlyExpenses,
      primaryGoal,
    });

    setCurrentSimulation(result);
    setScenarioHistory((prev) => [result, ...prev.filter((item) => item.query !== query).slice(0, 19)]);
    return result;
  };

  const resetAllData = () => {
    setAccounts(INITIAL_ACCOUNTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    setGoals(INITIAL_GOALS);
    setScenarioHistory(INITIAL_SCENARIO_HISTORY);
    setCurrentSimulation(INITIAL_SCENARIO_HISTORY[0]);
    localStorage.removeItem(STORAGE_KEYS.ACCOUNTS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.BUDGETS);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setCurrentUser(DEMO_USER);
  };

  const login = (email: string, name?: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const isRahul = trimmedEmail === 'rahul@wealth.demo' || trimmedEmail.startsWith('rahul');
    const displayName = name?.trim() || (isRahul ? 'Rahul Sharma' : email.split('@')[0]);

    const initials = displayName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      name: displayName,
      email: email.trim(),
      tier: 'Private Wealth Member',
      avatar_initials: initials || 'MW',
    };

    setCurrentUser(user);
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        accounts,
        transactions,
        budgets,
        goals,
        scenarioHistory,
        currentSimulation,
        activeTab,
        setActiveTab,
        totalBalance,
        totalLiquidAssets,
        totalInvestments,
        totalLiabilities,
        monthlyIncome,
        monthlyExpenses,
        monthlySavings,
        savingsRate,
        totalBudgetLimit,
        totalBudgetSpent,
        budgetRemaining,
        primaryGoal,
        addTransaction,
        deleteTransaction,
        bulkDeleteTransactions,
        addAccount,
        updateAccount,
        deleteAccount,
        setDefaultAccount,
        addGoal,
        updateGoal,
        deleteGoal,
        updateBudgetLimit,
        executeSimulation,
        setCurrentSimulation,
        resetAllData,
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
