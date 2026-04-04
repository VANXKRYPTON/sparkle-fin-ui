import { useDashboard } from "@/context/DashboardContext";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";

const DateRangePicker = () => {
  const { filters, setFilters } = useDashboard();

  const fromDate = filters.dateFrom ? new Date(filters.dateFrom + "T00:00:00") : undefined;
  const toDate = filters.dateTo ? new Date(filters.dateTo + "T00:00:00") : undefined;

  const handleFromChange = (date: Date | undefined) => {
    setFilters({ dateFrom: date ? format(date, "yyyy-MM-dd") : null });
  };

  const handleToChange = (date: Date | undefined) => {
    setFilters({ dateTo: date ? format(date, "yyyy-MM-dd") : null });
  };

  const clearRange = () => {
    setFilters({ dateFrom: null, dateTo: null });
  };

  const hasRange = filters.dateFrom || filters.dateTo;

  return (
    <motion.div
      className="flex items-center gap-2 flex-wrap"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-8 px-3 text-xs font-normal bg-secondary border-border/50 hover:bg-secondary/80",
              !fromDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-1.5 h-3 w-3" />
            {fromDate ? format(fromDate, "MMM d, yyyy") : "From"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={fromDate}
            onSelect={handleFromChange}
            disabled={(date) => (toDate ? date > toDate : false)}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>

      <span className="text-xs text-muted-foreground">–</span>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-8 px-3 text-xs font-normal bg-secondary border-border/50 hover:bg-secondary/80",
              !toDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-1.5 h-3 w-3" />
            {toDate ? format(toDate, "MMM d, yyyy") : "To"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={toDate}
            onSelect={handleToChange}
            disabled={(date) => (fromDate ? date < fromDate : false)}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>

      <AnimatePresence>
        {hasRange && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={clearRange}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DateRangePicker;
