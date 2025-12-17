import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
// ✅ Import global formatters
import { formatCurrencyCompact, formatCurrencyFull } from "../utils/formatters";

export default function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [transactionRes, categoryRes] = await Promise.all([
        API.get("/transactions"),
        API.get("/categories")
      ]);
      setTransactions(transactionRes.data);
      setCategories(categoryRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const getMonthlyData = () => {
    const monthlyData = {};
    transactions.forEach(transaction => {
      const month = new Date(transaction.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      if (!monthlyData[month]) {
        monthlyData[month] = { month, income: 0, expenses: 0 };
      }
      if (transaction.type === "income") {
        monthlyData[month].income += transaction.amount;
      } else {
        monthlyData[month].expenses += transaction.amount;
      }
    });
    return Object.values(monthlyData).sort((a, b) => new Date(a.month) - new Date(b.month));
  };

  const getCategoryData = () => {
    if (!transactions.length || !categories.length) return [];
    const categoryMap = new Map(categories.map(c => [String(c._id), c]));
    const categoryData = {};

    transactions.forEach(transaction => {
      const categoryId = transaction.category?._id || transaction.category;
      const category = categoryMap.get(String(categoryId));
      if (!category) return;

      if (!categoryData[category._id]) {
        categoryData[category._id] = {
          name: category.name,
          amount: 0,
          color: category.color || "#8884d8",
          count: 0,
        };
      }
      categoryData[category._id].amount += transaction.amount;
      categoryData[category._id].count += 1;
    });
    return Object.values(categoryData).sort((a, b) => b.amount - a.amount);
  };

  const monthlyData = getMonthlyData();
  const categoryData = getCategoryData();

  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const netWorth = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-600 mt-1">Deep insights into your financial patterns</p>
        </div>

        {/* Overview Cards with Compact Values */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label: "Total Income", val: totalIncome, icon: TrendingUp, color: "text-green-600", iconCol: "text-green-500" },
            { label: "Total Expenses", val: totalExpenses, icon: TrendingDown, color: "text-red-600", iconCol: "text-red-500" },
            { label: "Net Worth", val: netWorth, icon: DollarSign, color: netWorth >= 0 ? "text-green-600" : "text-red-600", iconCol: "text-blue-500" }
          ].map((card) => (
            <Card key={card.label} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg" title={formatCurrencyFull(card.val)}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">{card.label}</p>
                  <p className={`text-2xl font-bold ${card.color}`}>{formatCurrencyCompact(card.val)}</p>
                </div>
                <card.icon className={`w-8 h-8 ${card.iconCol}`} />
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
            <TabsTrigger value="categories">Category Breakdown</TabsTrigger>
            <TabsTrigger value="comparison">Income vs Expenses</TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader><CardTitle>Monthly Trends</CardTitle></CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} tickFormatter={formatCurrencyCompact} />
                    <Tooltip formatter={(value) => [formatCurrencyFull(value), "Amount"]} />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader><CardTitle>Spending by Category</CardTitle></CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="amount">
                        {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(value) => [formatCurrencyFull(value), 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader><CardTitle>Category Details</CardTitle></CardHeader>
                <CardContent className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {categoryData.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50" title={formatCurrencyFull(cat.amount)}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{cat.name}</p>
                          <p className="text-xs text-slate-500">{cat.count} txns</p>
                        </div>
                      </div>
                      <p className="font-bold shrink-0">{formatCurrencyCompact(cat.amount)}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader><CardTitle>Income vs Expenses</CardTitle></CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} tickFormatter={formatCurrencyCompact} />
                    <Tooltip formatter={(val) => [formatCurrencyFull(val), "Amount"]} />
                    <Legend />
                    <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}