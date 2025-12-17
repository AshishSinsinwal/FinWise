import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, TrendingUp, TrendingDown, Hash, Trash } from "lucide-react";
import { motion } from "framer-motion";
// Import your global formatters
import { formatCurrencyCompact, formatCurrencyFull } from "../../utils/formatters";

export default function CategoryCard({
  category,
  stats,
  onEdit,
  onDelete,
}) {
  const isGlobal = !category.user;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
        <CardContent className="p-6">

          {/* HEADER */}
          <div className="flex items-center justify-between gap-3 mb-4">
            
            {/* LEFT SIDE */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: category.color + "20" }}
              >
                <Hash className="w-6 h-6" style={{ color: category.color }} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3
                    className="font-bold text-slate-900 truncate"
                    title={category.name}
                  >
                    {category.name}
                  </h3>
                </div>

                <Badge
                  variant="outline"
                  className={`capitalize mt-1 inline-block ${
                    category.type === "income"
                      ? "text-green-700 border-green-300"
                      : category.type === "expense"
                      ? "text-red-700 border-red-300"
                      : "text-blue-700 border-blue-300"
                  }`}
                >
                  {category.type}
                </Badge>
              </div>
            </div>

            {/* RIGHT SIDE (ACTIONS) */}
            <div className="flex gap-0 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="icon"
                disabled={isGlobal}
                onClick={() => onEdit(category)}
              >
                <Edit className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                disabled={isGlobal}
                onClick={() => onDelete(category)}
              >
                <Trash className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          </div>

          {/* STATS */}
          <div className="space-y-2">
            <div 
              className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg group/stat"
              title={`Total Earned: ${formatCurrencyFull(stats.totalEarned)}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <TrendingUp className="w-4 h-4 text-green-600 shrink-0" />
                <span className="text-sm text-slate-600 truncate">Income</span>
              </div>
              <span className="font-bold text-green-600 shrink-0">
                {formatCurrencyCompact(stats.totalEarned)}
              </span>
            </div>

            <div 
              className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg group/stat"
              title={`Total Spent: ${formatCurrencyFull(stats.totalSpent)}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <TrendingDown className="w-4 h-4 text-red-600 shrink-0" />
                <span className="text-sm text-slate-600 truncate">Expenses</span>
              </div>
              <span className="font-bold text-red-600 shrink-0">
                {formatCurrencyCompact(stats.totalSpent)}
              </span>
            </div>

            <div className="text-center pt-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {stats.transactionCount} transactions
              </span>
            </div>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}