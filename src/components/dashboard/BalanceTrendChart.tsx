import { useDashboard } from "@/context/DashboardContext";
import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const BalanceTrendChart = () => {
  const { transactions } = useDashboard();

  const data = useMemo(() => {
    const monthly: Record<string, { income: number; expense: number }> = {};
    
    transactions.forEach(t => {
      const key = t.date.substring(0, 7); // YYYY-MM
      if (!monthly[key]) monthly[key] = { income: 0, expense: 0 };
      if (t.type === "income") monthly[key].income += t.amount;
      else monthly[key].expense += t.amount;
    });

    return Object.entries(monthly)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, { income, expense }]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        income: Math.round(income),
        expense: Math.round(expense),
        net: Math.round(income - expense),
      }));
  }, [transactions]);

  return (
    <div className="glass-card rounded-lg p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Balance Trend</h3>
      {data.length === 0 ? (
        <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">No data available</div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(152, 69%, 53%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(152, 69%, 53%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(4, 90%, 62%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(4, 90%, 62%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 18%)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(215, 15%, 55%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(215, 15%, 55%)" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 41%, 9%)",
                border: "1px solid hsl(222, 20%, 18%)",
                borderRadius: "8px",
                fontSize: "12px",
                fontFamily: "'JetBrains Mono', monospace",
              }}
              labelStyle={{ color: "hsl(210, 20%, 92%)" }}
            />
            <Area type="monotone" dataKey="income" stroke="hsl(152, 69%, 53%)" fill="url(#incomeGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="expense" stroke="hsl(4, 90%, 62%)" fill="url(#expenseGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default BalanceTrendChart;
