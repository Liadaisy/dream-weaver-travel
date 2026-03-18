import { motion } from "framer-motion";

interface BudgetItem {
  category: string;
  amount: number;
  icon: string;
}

interface BudgetBreakdownProps {
  total: number;
  items: BudgetItem[];
}

export default function BudgetBreakdown({ total, items }: BudgetBreakdownProps) {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
      <h3 className="font-display text-lg text-foreground mb-4">Budget Breakdown</h3>
      <div className="space-y-3">
        {items.map((item, i) => {
          const pct = (item.amount / total) * 100;
          return (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">
                  {item.icon} {item.category}
                </span>
                <span className="font-medium text-foreground">₹{item.amount.toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="h-full rounded-full gradient-ocean"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-border flex justify-between font-medium text-foreground">
        <span>Total</span>
        <span>₹{total.toLocaleString()}</span>
      </div>
    </div>
  );
}
