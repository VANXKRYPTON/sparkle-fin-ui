import { useDashboard, CATEGORIES, type Category, type TransactionType } from "@/context/DashboardContext";
import { X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  editId: string | null;
  onClose: () => void;
}

const TransactionModal = ({ editId, onClose }: Props) => {
  const { transactions, addTransaction, editTransaction } = useDashboard();
  const existing = editId ? transactions.find(t => t.id === editId) : null;

  const [form, setForm] = useState({
    date: existing?.date || new Date().toISOString().split("T")[0],
    description: existing?.description || "",
    amount: existing?.amount?.toString() || "",
    type: (existing?.type || "expense") as TransactionType,
    category: (existing?.category || "Food") as Category,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      date: form.date,
      description: form.description,
      amount: parseFloat(form.amount),
      type: form.type,
      category: form.category,
    };
    if (editId) editTransaction(editId, data);
    else addTransaction(data);
    onClose();
  };

  const inputClass = "w-full h-9 rounded-md bg-secondary px-3 text-sm text-foreground border border-border/50 outline-none focus:ring-1 focus:ring-primary/50 transition-shadow duration-200";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <motion.div
        className="relative w-full max-w-md glass-card rounded-lg p-6"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">{editId ? "Edit" : "Add"} Transaction</h3>
          <motion.button
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="p-1 rounded hover:bg-secondary text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </motion.button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={inputClass} required />
          <input placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={inputClass} required />
          <input type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className={inputClass} required />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as TransactionType }))} className={inputClass}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))} className={inputClass}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium"
          >
            {editId ? "Save Changes" : "Add Transaction"}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TransactionModal;
