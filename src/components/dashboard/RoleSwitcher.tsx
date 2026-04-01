import { useDashboard, type Role } from "@/context/DashboardContext";
import { Shield, Eye } from "lucide-react";

const RoleSwitcher = () => {
  const { role, setRole } = useDashboard();

  return (
    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-secondary">
      {(["admin", "viewer"] as Role[]).map(r => (
        <button
          key={r}
          onClick={() => setRole(r)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            role === r
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {r === "admin" ? <Shield className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          {r === "admin" ? "Admin" : "Viewer"}
        </button>
      ))}
    </div>
  );
};

export default RoleSwitcher;
