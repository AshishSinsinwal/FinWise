import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function FinancialMetrics({ transactions, isLoading }) {
  // ✅ Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;

  /**
   * ✅ Formats numbers into K, M, B
   * Example: 131242256 -> $131.2M
   */
  const formatCompact = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(val);
  };

  const metrics = [
    {
      title: "Income",
      value: formatCompact(totalIncome),
      fullValue: totalIncome.toLocaleString(),
      icon: TrendingUp,
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      title: "Expenses",
      value: formatCompact(totalExpenses),
      fullValue: totalExpenses.toLocaleString(),
      icon: TrendingDown,
      bgColor: "bg-red-50",
      textColor: "text-red-700",
    },
    {
      title: "Net Income",
      value: formatCompact(netIncome),
      fullValue: netIncome.toLocaleString(),
      icon: Wallet,
      bgColor: netIncome >= 0 ? "bg-blue-50" : "bg-orange-50",
      textColor: netIncome >= 0 ? "text-blue-700" : "text-orange-700",
    },
    {
      title: "Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
      fullValue: `${savingsRate.toFixed(2)}%`,
      icon: Target,
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-slate-200 rounded-lg"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card 
            className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
            title={`Full amount: $${metric.fullValue}`} // Native tooltip
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider truncate">
                    {metric.title}
                  </p>
                  <p className={`text-xl font-bold truncate ${metric.textColor}`}>
                    {metric.value}
                  </p>
                </div>

                {/* Smaller icon size (w-5 h-5) and flex-shrink-0 to prevent squashing */}
                <div className={`flex-shrink-0 p-3 ${metric.bgColor} rounded-xl group-hover:scale-105 transition-transform duration-300`}>
                  <metric.icon className={`w-5 h-5 ${metric.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}