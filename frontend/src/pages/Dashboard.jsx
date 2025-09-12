import React, { useState, useEffect } from "react";
import API from "../utils/api"; // centralized axios instance
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Wallet, 
  Plus,
  Tags
} from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import FinancialMetrics from "../components/dashboard/FinancialMetrics";
import ExpenseChart from "../components/dashboard/ExpenseChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown";
import MonthlyTrends from "../components/dashboard/MonthlyTrends";
import { createPageUrl } from "../utils";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("thisMonth");

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

  
  // Calculate filtered transactions based on date filter
  const getFilteredTransactions = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      switch(dateFilter) {
        case "thisMonth":
          return transactionDate.getMonth() === currentMonth && 
                 transactionDate.getFullYear() === currentYear;
        case "lastMonth":
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return transactionDate.getMonth() === lastMonth && 
                 transactionDate.getFullYear() === lastMonthYear;
        case "thisYear":
          return transactionDate.getFullYear() === currentYear;
        case "all":
        default:
          return true;
      }
    });
  };

  const filteredTransactions = getFilteredTransactions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Financial Dashboard
            </h1>
            <p className="text-slate-600 text-lg">Track your money, achieve your goals</p>
          </motion.div>

          <div className="flex gap-4 w-full lg:w-auto">
           
            <Select
              value={dateFilter}
              onValueChange={(value) => setDateFilter(value)}
              className="w-full"
            >
              <SelectTrigger className="h-12 px-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>

            <Link 
              to={createPageUrl("AddTransaction")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Transaction
            </Link>
          </div>
        </div>

        {/* Show welcome message if no data */}
        {!isLoading && transactions.length === 0 ? (
          <div className="text-center py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Welcome to FinanceTracker!</h2>
              <p className="text-slate-600 mb-8">Start by adding your first transaction or creating categories to organize your finances.</p>
              <div className="flex gap-4 justify-center">
                <Link to={createPageUrl("Categories")}>
                  <Button variant="outline">
                    <Tags className="w-4 h-4 mr-2" />
                    Create Categories
                  </Button>
                </Link>
                <Link to={createPageUrl("AddTransaction")}>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Transaction
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Financial Metrics */}
            <FinancialMetrics 
              transactions={filteredTransactions}
              isLoading={isLoading}
              categories={categories}
            />

            {/* Charts and Analytics */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <ExpenseChart 
                  transactions={filteredTransactions}
                  isLoading={isLoading}
                />
                <MonthlyTrends 
                  transactions={transactions}
                  isLoading={isLoading}
                />
              </div>
              
              <div className="space-y-8">
                <CategoryBreakdown 
                  transactions={filteredTransactions}
                  categories={categories}
                  isLoading={isLoading}
                />
                <RecentTransactions 
                  transactions={filteredTransactions.slice(0, 5)}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}





