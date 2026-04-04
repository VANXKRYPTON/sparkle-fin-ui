import { useDashboard } from "@/context/DashboardContext";
import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

const COLORS = [
  "hsl(152, 69%, 53%)",
  "hsl(192, 91%, 56%)",
  "hsl(4, 90%, 62%)",
  "hsl(38, 92%, 60%)",
  "hsl(280, 65%, 60%)",
  "hsl(200, 70%, 50%)",
];

const legendVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.6 },
  },
};

const legendItem = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const SpendingBreakdown = () => {
  const { filteredTransactions } = useDashboard();

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
    <motion.div
      className="glass-card rounded-lg p-5 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Spending Breakdown</h3>
      {data.length === 0 ? (
        <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">No expenses</div>
      ) : (
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
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
                  animationDuration={1000}
                  animationEasing="ease-out"
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
          </motion.div>
          <motion.div
            className="flex flex-col gap-2 w-full lg:w-auto min-w-[140px]"
            variants={legendVariants}
            initial="hidden"
            animate="visible"
          >
            {data.slice(0, 5).map((item, i) => (
              <motion.div key={item.name} variants={legendItem} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-muted-foreground truncate">{item.name}</span>
                <span className="ml-auto font-mono text-foreground">{((item.value / total) * 100).toFixed(0)}%</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default SpendingBreakdown;
