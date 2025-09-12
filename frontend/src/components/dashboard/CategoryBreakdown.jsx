import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from "lucide-react";

export default function CategoryBreakdown({ transactions, categories, isLoading }) {
  const getCategoryData = () => {
  const expenseTransactions = transactions.filter(t => t.type === "expense");
  const categoryTotals = {};

  expenseTransactions.forEach(transaction => {
    const categoryName = transaction.category.name; // use name as key
    if (!categoryTotals[categoryName]) {
      categoryTotals[categoryName] = {
        name: categoryName,
        value: 0,
        color: transaction.category.color || "#64748b"
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
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="w-5 h-5" />
          Expense Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {data.slice(0, 4).map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm text-slate-700">{category.name}</span>
                  </div>
                  <span className="text-sm font-medium">${category.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500">No expense data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}