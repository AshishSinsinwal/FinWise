import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { Button } from "@/components/ui/button";
import { Plus, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import CategoryCard from "../components/categories/CategoryCard";
import CategoryForm from "../components/categories/CategoryForm";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  // Auto-clear error after 3 seconds
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(t);
    }
  }, [error]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [transactionRes, categoryRes] = await Promise.all([
        API.get("/transactions"),
        API.get("/categories"),
      ]);

      setTransactions(transactionRes.data);
      setCategories(categoryRes.data);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load categories");
    }
    setIsLoading(false);
  };

  const handleSubmit = async (categoryData) => {
    try {
      if (editingCategory) {
        await API.put(`/categories/${editingCategory._id}`, categoryData);
      } else {
        await API.post("/categories", categoryData);
      }
      setShowForm(false);
      setEditingCategory(null);
      loadData();
    } catch (err) {
      console.error("Save category error:", err);
      setError(err.response?.data?.message || "Failed to save category");
      setShowForm(false);
      setEditingCategory(null);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (category) => {
    try {
      await API.delete(`/categories/${category._id}`);
      loadData();
    } catch (err) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setError(
        "category cannot be deleted: transactions are associated with it"
      );
    }
  };

  const getCategoryStats = (categoryName) => {
    const categoryTransactions = transactions.filter(
      (t) => t.category?.name === categoryName
    );

    const totalSpent = categoryTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalEarned = categoryTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalSpent,
      totalEarned,
      transactionCount: categoryTransactions.length,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
            <p className="text-slate-600 mt-1">
              Organize your finances with custom categories
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Category
          </Button>
        </div>

        {/* ERROR BANNER */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-100 text-red-700 px-4 py-2 rounded-md"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Form */}
        <AnimatePresence>
          {showForm && (
            <CategoryForm
              category={editingCategory}
              onSuccess={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingCategory(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {categories.map((category) => (
              <CategoryCard
                key={category._id}
                category={category}
                stats={getCategoryStats(category.name)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                disableActions={!category.user} 
              />
            ))}
          </AnimatePresence>
        </div>

        {!isLoading && categories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Tag className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No categories yet
            </h3>
            <p className="text-slate-600 mb-6">
              Create your first category to start organizing your finances
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Category
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
