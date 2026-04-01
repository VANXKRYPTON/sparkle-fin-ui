import { DashboardProvider } from "@/context/DashboardContext";
import SummaryCards from "@/components/dashboard/SummaryCards";
import BalanceTrendChart from "@/components/dashboard/BalanceTrendChart";
import SpendingBreakdown from "@/components/dashboard/SpendingBreakdown";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import InsightsSection from "@/components/dashboard/InsightsSection";
import RoleSwitcher from "@/components/dashboard/RoleSwitcher";
import { BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="font-heading font-bold text-sm tracking-tight">FinanceFlow</span>
            </div>
            <RoleSwitcher />
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl">
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
