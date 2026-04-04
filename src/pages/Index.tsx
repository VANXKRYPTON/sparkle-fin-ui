import { DashboardProvider } from "@/context/DashboardContext";
import SummaryCards from "@/components/dashboard/SummaryCards";
import BalanceTrendChart from "@/components/dashboard/BalanceTrendChart";
import SpendingBreakdown from "@/components/dashboard/SpendingBreakdown";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import InsightsSection from "@/components/dashboard/InsightsSection";
import RoleSwitcher from "@/components/dashboard/RoleSwitcher";
import DateRangePicker from "@/components/dashboard/DateRangePicker";
import { useAuth } from "@/context/AuthContext";
import { BarChart3, LogOut } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background">
        <motion.header
          className="border-b border-border/50 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="container mx-auto flex items-center justify-between h-14">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="font-heading font-bold text-sm tracking-tight">FinanceFlow</span>
            </motion.div>
            <RoleSwitcher />
          </div>
        </motion.header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <DateRangePicker />
          </div>
          <SummaryCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3">
              <BalanceTrendChart />
            </div>
            <div className="lg:col-span-2">
              <SpendingBreakdown />
            </div>
          </div>

          <InsightsSection />
          <TransactionsTable />
        </main>
      </div>
    </DashboardProvider>
  );
};

export default Index;
