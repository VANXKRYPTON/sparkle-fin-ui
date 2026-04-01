import { useDashboard, type Role } from "@/context/DashboardContext";
import { Shield, Eye } from "lucide-react";
import { motion } from "framer-motion";

const RoleSwitcher = () => {
  const { role, setRole } = useDashboard();

  return (
    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-secondary">
      {(["admin", "viewer"] as Role[]).map(r => (
        <button
          key={r}
          onClick={() => setRole(r)}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
        >
          {role === r && (
            <motion.div
              layoutId="role-pill"
              className="absolute inset-0 bg-primary rounded-md"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className={`relative z-10 flex items-center gap-1.5 ${role === r ? "text-primary-foreground" : "text-muted-foreground"}`}>
            {r === "admin" ? <Shield className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {r === "admin" ? "Admin" : "Viewer"}
          </span>
        </button>
      ))}
    </div>
  );
};

export default RoleSwitcher;
