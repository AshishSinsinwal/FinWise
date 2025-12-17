import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from "lucide-react";
// Import your global formatters
import { formatCurrencyCompact, formatCurrencyFull } from "../../utils/formatters";

export default function CategoryBreakdown({ transactions, isLoading }) {
  const getCategoryData = () => {
    const expenseTransactions = transactions.filter(t => t.type === "expense");
    const categoryTotals = {};

    expenseTransactions.forEach(transaction => {
      const categoryName = transaction.category?.name || "Uncategorized";
      if (!categoryTotals[categoryName]) {
        categoryTotals[categoryName] = {
          name: categoryName,
          value: 0,
          color: transaction.category?.color || "#64748b"
        };
      }
      categoryTotals[categoryName].value += transaction.amount;
    });

    return Object.values(categoryTotals).sort((a, b) => b.value - a.value);
  };

  const data = getCategoryData();

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="h-64 bg-slate-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <PieChartIcon className="w-5 h-5" />
          Expense Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <>
            <div className="h-48 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60} // Made slightly larger for a cleaner "Donut" look
                    outerRadius={80}
                    paddingAngle={5} // Increased padding for better separation
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} className="outline-none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    // ✅ Uses Full Currency in the tooltip for precision
                    formatter={(value) => [formatCurrencyFull(value), 'Total Spent']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3">
              {data.slice(0, 5).map((category) => (
                <div 
                  key={category.name} 
                  className="flex items-center justify-between group"
                  title={formatCurrencyFull(category.value)} // Hover shows exact amount
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm text-slate-600 truncate font-medium">
                      {category.name}
                    </span>
                  </div>
                  
                  {/* ✅ Compact format for the side list to keep layout stable */}
                  <span className="text-sm font-bold text-slate-800 shrink-0">
                    {formatCurrencyCompact(category.value)}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">No expense data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}