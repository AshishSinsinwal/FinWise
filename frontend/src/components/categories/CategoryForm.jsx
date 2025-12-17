import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Palette, Save, X } from "lucide-react";
import API from "@/utils/api";
const PRESET_COLORS = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
  "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1"
];

export default function CategoryForm({ category, onCancel, onSuccess }) {
  const [formData, setFormData] = useState(category || {
    name: "",
    type: "expense",
    color: PRESET_COLORS[0],
    budget_limit: ""
  });

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      ...formData,
      budget_limit: formData.budget_limit ? parseFloat(formData.budget_limit) : undefined,
    };

    let res;
    if (category) {
      res = await API.put(`/categories/${category._id}`, payload);
    } else {
      res = await API.post('/categories', payload);
    }

    if (onSuccess) onSuccess(res.data);
  } catch (error) {
    console.error("Error saving category:", error.response?.data || error.message);
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            {category ? "Edit Category" : "Create New Category"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name + Type */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Groceries, Salary, Entertainment"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Category Type</Label>
                <Select 
                  value={formData.type}
                  onValueChange={(value) => setFormData({...formData, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Color Picker */}
            <div className="space-y-2">
              <Label>Category Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({...formData, color})}
                    className={`w-12 h-12 rounded-xl transition-all duration-200 hover:scale-110 ${
                      formData.color === color ? "ring-4 ring-slate-300 ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Budget Limit (only for expense) */}
            {formData.type === "expense" && (
              <div className="space-y-2">
                <Label htmlFor="budget_limit">Monthly Budget Limit (Optional)</Label>
                <Input
                  id="budget_limit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.budget_limit}
                  onChange={(e) => setFormData({...formData, budget_limit: e.target.value})}
                  placeholder="e.g. 500.00"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {category ? "Update" : "Create"} Category
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
