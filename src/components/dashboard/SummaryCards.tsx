import { useDashboard } from "@/context/DashboardContext";
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useMemo } from "react";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const SummaryCards = () => {
  const { transactions } = useDashboard();

  const { totalIncome, totalExpense, balance, incomeChange, expenseChange } = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const thisYear = now.getFullYear();
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    let totalIncome = 0, totalExpense = 0;
    let thisMonthIncome = 0, lastMonthIncome = 0;
    let thisMonthExpense = 0, lastMonthExpense = 0;

    transactions.forEach(t => {
      const d = new Date(t.date);
      const m = d.getMonth();
      const y = d.getFullYear();
      if (t.type === "income") {
        totalIncome += t.amount;
        if (m === thisMonth && y === thisYear) thisMonthIncome += t.amount;
        if (m === lastMonth && y === lastMonthYear) lastMonthIncome += t.amount;
      } else {
        totalExpense += t.amount;
        if (m === thisMonth && y === thisYear) thisMonthExpense += t.amount;
        if (m === lastMonth && y === lastMonthYear) lastMonthExpense += t.amount;
      }
    });

    const incomeChange = lastMonthIncome ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0;
    const expenseChange = lastMonthExpense ? ((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100 : 0;

    return { totalIncome, totalExpense, balance: totalIncome - totalExpense, incomeChange, expenseChange };
  }, [transactions]);

  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  const cards = [
    { label: "Total Balance", value: fmt(balance), icon: Wallet, change: null, className: "glow-green border-primary/20", iconColor: "text-primary" },
    { label: "Total Income", value: fmt(totalIncome), icon: TrendingUp, change: incomeChange, className: "border-income/20", iconColor: "text-income" },
    { label: "Total Expenses", value: fmt(totalExpense), icon: TrendingDown, change: expenseChange, className: "border-expense/20", iconColor: "text-expense" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className={`glass-card rounded-lg p-5 ${card.className}`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">{card.label}</span>
            <motion.div
              initial={{ rotate: -20, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
            >
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </motion.div>
          </div>
          <motion.div
            className="font-mono text-2xl font-bold tracking-tight"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
          >
            {card.value}
          </motion.div>
          {card.change !== null && (
            <motion.div
              className="flex items-center gap-1 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {card.change >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-income" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-expense" />
              )}
              <span className={`text-xs font-mono ${card.change >= 0 ? "text-income" : "text-expense"}`}>
                {Math.abs(card.change).toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default SummaryCards;
