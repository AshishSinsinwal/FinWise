import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function FinancialMetrics({ transactions, isLoading }) {
  // ✅ Use transactions as passed from parent (already filtered)
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((netIncome / totalIncome) * 100) : 0;

  const metrics = [
    {
      title: "Income",
      value: `$${totalIncome.toFixed(2)}`,
      icon: TrendingUp,
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "Expenses",
      value: `$${totalExpenses.toFixed(2)}`,
      icon: TrendingDown,
      bgColor: "bg-red-50",
      textColor: "text-red-700"
    },
    {
      title: "Net Income",
      value: `$${netIncome.toFixed(2)}`,
      icon: Wallet,
      bgColor: netIncome >= 0 ? "bg-blue-50" : "bg-orange-50",
      textColor: netIncome >= 0 ? "text-blue-700" : "text-orange-700"
    },
    {
      title: "Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
      icon: Target,
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                  <p className={`text-2xl font-bold ${metric.textColor}`}>{metric.value}</p>
                </div>
                <div className={`p-4 ${metric.bgColor} rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                  <metric.icon className={`w-6 h-6 ${metric.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
