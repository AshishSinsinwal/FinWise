import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
// Import your global formatters
import { formatCurrencyCompact, formatCurrencyFull } from "../../utils/formatters";

export default function ExpenseChart({ transactions, isLoading }) {
  // Prepare data for the last 30 days
  const getDailyData = () => {
    const dailyData = {};
    const today = new Date();
    
    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = format(date, "MMM dd");
      dailyData[dateKey] = { date: dateKey, income: 0, expenses: 0 };
    }

    // Populate with actual data
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const dateKey = format(transactionDate, "MMM dd");
      
      if (dailyData[dateKey]) {
        if (transaction.type === "income") {
          dailyData[dateKey].income += transaction.amount;
        } else {
          dailyData[dateKey].expenses += transaction.amount;
        }
      }
    });

    return Object.values(dailyData);
  };

  const chartData = getDailyData();

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="h-80 bg-slate-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">
          Daily Cash Flow (Last 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                minTickGap={30} // Prevents X-axis date labels from overlapping
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                // ✅ Compact format for the side labels
                tickFormatter={(value) => formatCurrencyCompact(value)}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                }}
                // ✅ Full format for the hover popup
                formatter={(value, name) => [
                  formatCurrencyFull(value), 
                  name === "income" ? "Income" : "Expenses"
                ]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend iconType="circle" />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorIncome)"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorExpenses)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}