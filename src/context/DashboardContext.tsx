import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

export type Role = "admin" | "viewer";
export type TransactionType = "income" | "expense";
export type Category = "Food" | "Transport" | "Shopping" | "Entertainment" | "Bills" | "Health" | "Salary" | "Freelance" | "Investment" | "Other";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
}

interface Filters {
  search: string;
  type: TransactionType | "all";
  category: Category | "all";
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
  dateFrom: string | null;
  dateTo: string | null;
}

interface DashboardState {
  role: Role;
  transactions: Transaction[];
  filters: Filters;
  setRole: (role: Role) => void;
  setFilters: (filters: Partial<Filters>) => void;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  editTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  filteredTransactions: Transaction[];
}

const CATEGORIES: Category[] = ["Food", "Transport", "Shopping", "Entertainment", "Bills", "Health", "Salary", "Freelance", "Investment", "Other"];

const generateMockData = (): Transaction[] => {
  const descriptions: Record<Category, string[]> = {
    Food: ["Grocery Store", "Restaurant Dinner", "Coffee Shop", "Uber Eats", "Lunch"],
    Transport: ["Uber Ride", "Gas Station", "Metro Pass", "Parking Fee", "Flight Ticket"],
    Shopping: ["Amazon Order", "Clothing Store", "Electronics", "Home Decor", "Gift Purchase"],
    Entertainment: ["Netflix", "Spotify", "Movie Tickets", "Concert", "Gaming"],
    Bills: ["Electricity Bill", "Water Bill", "Internet", "Phone Plan", "Insurance"],
    Health: ["Pharmacy", "Gym Membership", "Doctor Visit", "Supplements", "Dentist"],
    Salary: ["Monthly Salary", "Bonus Payment", "Overtime Pay"],
    Freelance: ["Client Project", "Consulting Fee", "Design Work", "Web Development"],
    Investment: ["Dividend Income", "Stock Sale", "Rental Income"],
    Other: ["Miscellaneous", "Refund", "Gift Received"],
  };

  const transactions: Transaction[] = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
    const isIncome = Math.random() < 0.3;
    const incomeCategories: Category[] = ["Salary", "Freelance", "Investment"];
    const expenseCategories: Category[] = ["Food", "Transport", "Shopping", "Entertainment", "Bills", "Health"];
    
    const category = isIncome
      ? incomeCategories[Math.floor(Math.random() * incomeCategories.length)]
      : expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
    
    const descs = descriptions[category];
    const description = descs[Math.floor(Math.random() * descs.length)];
    
    const amount = isIncome
      ? Math.round((Math.random() * 4000 + 1000) * 100) / 100
      : Math.round((Math.random() * 300 + 10) * 100) / 100;

    transactions.push({
      id: `txn-${i}`,
      date: date.toISOString().split("T")[0],
      description,
      amount,
      type: isIncome ? "income" : "expense",
      category,
    });
  }

  return transactions.sort((a, b) => b.date.localeCompare(a.date));
};

const DashboardContext = createContext<DashboardState | null>(null);

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
};

export { CATEGORIES };

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>("admin");
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("finance-transactions");
    return saved ? JSON.parse(saved) : generateMockData();
  });
  const [filters, setFiltersState] = useState<Filters>({
    search: "",
    type: "all",
    category: "all",
    sortBy: "date",
    sortOrder: "desc",
    dateFrom: null,
    dateTo: null,
  });

  const persist = (txns: Transaction[]) => {
    setTransactions(txns);
    localStorage.setItem("finance-transactions", JSON.stringify(txns));
  };

  const setFilters = useCallback((partial: Partial<Filters>) => {
    setFiltersState(prev => ({ ...prev, ...partial }));
  }, []);

  const addTransaction = useCallback((t: Omit<Transaction, "id">) => {
    const newTxn = { ...t, id: `txn-${Date.now()}` };
    persist([newTxn, ...transactions]);
  }, [transactions]);

  const editTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    persist(transactions.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [transactions]);

  const deleteTransaction = useCallback((id: string) => {
    persist(transactions.filter(t => t.id !== id));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }
    if (filters.type !== "all") result = result.filter(t => t.type === filters.type);
    if (filters.category !== "all") result = result.filter(t => t.category === filters.category);
    if (filters.dateFrom) result = result.filter(t => t.date >= filters.dateFrom!);
    if (filters.dateTo) result = result.filter(t => t.date <= filters.dateTo!);
    result.sort((a, b) => {
      const mul = filters.sortOrder === "asc" ? 1 : -1;
      if (filters.sortBy === "date") return mul * a.date.localeCompare(b.date);
      return mul * (a.amount - b.amount);
    });
    return result;
  }, [transactions, filters]);

  return (
    <DashboardContext.Provider value={{
      role, setRole, transactions, filters, setFilters,
      addTransaction, editTransaction, deleteTransaction, filteredTransactions,
    }}>
      {children}
    </DashboardContext.Provider>
  );
};
