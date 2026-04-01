import { useDashboard } from "@/context/DashboardContext";
import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "hsl(152, 69%, 53%)",
  "hsl(192, 91%, 56%)",
  "hsl(4, 90%, 62%)",
  "hsl(38, 92%, 60%)",
  "hsl(280, 65%, 60%)",
  "hsl(200, 70%, 50%)",
];

const SpendingBreakdown = () => {
  const { transactions } = useDashboard();

  const data = useMemo(() => {
    const byCategory: Record<string, number> = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });
    return Object.entries(byCategory)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const total = data.reduce((s, d) => s + d.value, 0);
  const fmt = (n: number) => `$${n.toLocaleString()}`;

  return (
    <div className="glass-card rounded-lg p-5 animate-fade-in" style={{ animationDelay: "300ms" }}>
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Spending Breakdown</h3>
      {data.length === 0 ? (
        <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">No expenses</div>
      ) : (
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222, 41%, 9%)",
                  border: "1px solid hsl(222, 20%, 18%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
                formatter={(value: number) => fmt(value)}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 w-full lg:w-auto min-w-[140px]">
            {data.slice(0, 5).map((item, i) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-muted-foreground truncate">{item.name}</span>
                <span className="ml-auto font-mono text-foreground">{((item.value / total) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendingBreakdown;
