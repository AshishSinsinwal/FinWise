import React, { useState, useEffect } from "react";
import API from "@/utils/api"; // your Axios instance
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import TransactionList from "../components/transactions/TransactionList";
import TransactionFilters from "../components/transactions/TransactionFilters";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    category: "all",
    dateFrom: "",
    dateTo: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [transactionRes, categoryRes] = await Promise.all([
        API.get("/transactions"), // backend route
        API.get("/categories")
      ]);

      // Assuming backend populates category in transaction
      setTransactions(transactionRes.data);
      setCategories(categoryRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const categoryName = transaction.category?.name || "";

    const matchesSearch =
      transaction.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      categoryName.toLowerCase().includes(filters.search.toLowerCase());

    const matchesType = filters.type === "all" || transaction.type === filters.type;
    const matchesCategory =
      filters.category === "all" || transaction.category?._id === filters.category;

    let matchesDateRange = true;
    if (filters.dateFrom) {
      matchesDateRange = new Date(transaction.date) >= new Date(filters.dateFrom);
    }
    if (filters.dateTo && matchesDateRange) {
      matchesDateRange = new Date(transaction.date) <= new Date(filters.dateTo);
    }

    return matchesSearch && matchesType && matchesCategory && matchesDateRange;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">All Transactions</h1>
            <p className="text-slate-600 mt-1">Manage and review your financial history</p>
          </div>
          <Link to={createPageUrl("AddTransaction")}>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-5 h-5 mr-2" />
              Add Transaction
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Total Income</p>
                  <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <ArrowUpDown className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <ArrowUpDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Net Balance</p>
                  <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${(totalIncome - totalExpenses).toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ArrowUpDown className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <TransactionFilters
          filters={filters}
          setFilters={setFilters}
          categories={categories}
        />

        {/* Transaction List */}
        <TransactionList
          transactions={filteredTransactions}
          categories={categories}
          isLoading={isLoading}
          onTransactionUpdate={loadData}
        />
      </div>
    </div>
  );
}
