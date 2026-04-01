import { useDashboard, CATEGORIES, type Category, type TransactionType } from "@/context/DashboardContext";
import { Search, ArrowUpDown, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TransactionModal from "./TransactionModal";

const TransactionsTable = () => {
  const { role, filteredTransactions, filters, setFilters, deleteTransaction } = useDashboard();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const toggleSort = (field: "date" | "amount") => {
    if (filters.sortBy === field) {
      setFilters({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" });
    } else {
      setFilters({ sortBy: field, sortOrder: "desc" });
    }
  };

  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  return (
    <motion.div
      className="glass-card rounded-lg"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="p-5 border-b border-border/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-sm font-medium text-muted-foreground">Transactions</h3>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={e => setFilters({ search: e.target.value })}
                className="h-8 w-full sm:w-44 rounded-md bg-secondary pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground border-none outline-none focus:ring-1 focus:ring-primary/50 transition-shadow duration-200"
              />
            </div>
            <select
              value={filters.type}
              onChange={e => setFilters({ type: e.target.value as TransactionType | "all" })}
              className="h-8 rounded-md bg-secondary px-2 text-xs text-foreground border-none outline-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              value={filters.category}
              onChange={e => setFilters({ category: e.target.value as Category | "all" })}
              className="h-8 rounded-md bg-secondary px-2 text-xs text-foreground border-none outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <AnimatePresence>
              {role === "admin" && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setEditId(null); setShowModal(true); }}
                  className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border/50 text-muted-foreground">
              <th className="text-left p-3 font-medium cursor-pointer hover:text-foreground transition-colors" onClick={() => toggleSort("date")}>
                <span className="flex items-center gap-1">Date <ArrowUpDown className="h-3 w-3" /></span>
              </th>
              <th className="text-left p-3 font-medium">Description</th>
              <th className="text-left p-3 font-medium">Category</th>
              <th className="text-right p-3 font-medium cursor-pointer hover:text-foreground transition-colors" onClick={() => toggleSort("amount")}>
                <span className="flex items-center justify-end gap-1">Amount <ArrowUpDown className="h-3 w-3" /></span>
              </th>
              {role === "admin" && <th className="text-right p-3 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filteredTransactions.length === 0 ? (
                <motion.tr
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td colSpan={role === "admin" ? 5 : 4} className="p-8 text-center text-muted-foreground">
                    No transactions found
                  </td>
                </motion.tr>
              ) : (
                filteredTransactions.slice(0, 20).map((t, i) => (
                  <motion.tr
                    key={t.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10, height: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3), duration: 0.3 }}
                    className="border-b border-border/30 hover:bg-secondary/50 transition-colors"
                  >
                    <td className="p-3 font-mono text-muted-foreground">{t.date}</td>
                    <td className="p-3">{t.description}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px]">
                        {t.category}
                      </span>
                    </td>
                    <td className={`p-3 text-right font-mono font-medium ${t.type === "income" ? "text-income" : "text-expense"}`}>
                      {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                    </td>
                    {role === "admin" && (
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { setEditId(t.id); setShowModal(true); }}
                            className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="h-3 w-3" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteTransaction(t.id)}
                            className="p-1.5 rounded hover:bg-destructive/20 transition-colors text-muted-foreground hover:text-expense"
                          >
                            <Trash2 className="h-3 w-3" />
                          </motion.button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {filteredTransactions.length > 20 && (
        <div className="p-3 text-center text-xs text-muted-foreground border-t border-border/50">
          Showing 20 of {filteredTransactions.length} transactions
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <TransactionModal editId={editId} onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TransactionsTable;
