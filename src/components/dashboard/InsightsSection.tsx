import { useDashboard } from "@/context/DashboardContext";
import { useMemo } from "react";
import { Zap, TrendingUp, AlertTriangle, PiggyBank } from "lucide-react";

const InsightsSection = () => {
  const { transactions } = useDashboard();

  const insights = useMemo(() => {
    if (transactions.length === 0) return [];

    const expenses = transactions.filter(t => t.type === "expense");
    const incomes = transactions.filter(t => t.type === "income");

    // Highest spending category
    const byCat: Record<string, number> = {};
    expenses.forEach(t => { byCat[t.category] = (byCat[t.category] || 0) + t.amount; });
    const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];

    // Monthly comparison
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const thisMonthExp = expenses.filter(t => { const d = new Date(t.date); return d.getMonth() === thisMonth && d.getFullYear() === thisYear; }).reduce((s, t) => s + t.amount, 0);
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
    const lastMonthExp = expenses.filter(t => { const d = new Date(t.date); return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear; }).reduce((s, t) => s + t.amount, 0);

    // Savings rate
    const totalInc = incomes.reduce((s, t) => s + t.amount, 0);
    const totalExp = expenses.reduce((s, t) => s + t.amount, 0);
    const savingsRate = totalInc > 0 ? ((totalInc - totalExp) / totalInc * 100) : 0;

    // Average transaction
    const avgExpense = expenses.length > 0 ? totalExp / expenses.length : 0;

    const result = [];

    if (topCat) {
      result.push({
        icon: Zap,
        title: "Top Spending",
        value: topCat[0],
        detail: `$${topCat[1].toLocaleString()} total spent`,
        color: "text-warning",
      });
    }

    if (lastMonthExp > 0) {
      const change = ((thisMonthExp - lastMonthExp) / lastMonthExp * 100);
      result.push({
        icon: change > 0 ? AlertTriangle : TrendingUp,
        title: "Monthly Trend",
        value: `${change > 0 ? "+" : ""}${change.toFixed(1)}%`,
        detail: `Spending ${change > 0 ? "increased" : "decreased"} vs last month`,
        color: change > 0 ? "text-expense" : "text-income",
      });
    }

    result.push({
      icon: PiggyBank,
      title: "Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
      detail: `Avg expense: $${avgExpense.toFixed(0)}`,
      color: savingsRate > 20 ? "text-income" : "text-warning",
    });

    return result;
  }, [transactions]);

  if (insights.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {insights.map((insight, i) => (
        <div
          key={insight.title}
          className="glass-card rounded-lg p-5 animate-fade-in"
          style={{ animationDelay: `${500 + i * 100}ms` }}
        >
          <div className="flex items-center gap-2 mb-2">
            <insight.icon className={`h-4 w-4 ${insight.color}`} />
            <span className="text-xs text-muted-foreground">{insight.title}</span>
          </div>
          <div className="font-mono text-lg font-bold">{insight.value}</div>
          <div className="text-xs text-muted-foreground mt-1">{insight.detail}</div>
        </div>
      ))}
    </div>
  );
};

export default InsightsSection;
