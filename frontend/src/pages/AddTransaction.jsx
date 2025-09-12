import React, { useState, useEffect } from "react";
import API from "../utils/api"; // centralized axios instance
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { createPageUrl } from "../utils"; // adjust path if needed

export default function AddTransaction() {
  const navigate = useNavigate();
  const location = useLocation(); // Use the hook here
  // Get the default type from the state, or default to "expense"
  const defaultType = location.state?.defaultType || "expense";
  const [categories, setCategories] = useState([]);
  const [transactionType, setTransactionType] = useState(defaultType);
  const [formData, setFormData] = useState({
    type: defaultType,
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

    useEffect(() => {
      // This part ensures that if a user navigates from income to expense without a page refresh, the type updates.
      setTransactionType(defaultType);
      setFormData(prev => ({ ...prev, type: defaultType, category: "" }));
    }, [defaultType]);


  const loadCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await API.post("/transactions", {
        ...formData,
        amount: parseFloat(formData.amount),
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTypeChange = (type) => {
    setTransactionType(type);
    setFormData((prev) => ({
      ...prev,
      type,
      category: "",
    }));
  };

  const filteredCategories = categories.filter(
    (cat) => cat.type === transactionType || cat.type === "both"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="hover:bg-white/80"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Add Transaction</h1>
            <p className="text-slate-600 mt-1">Record your income or expenses</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-xl bg-white/80 backdrop-blur-sm border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                {transactionType === "income" ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
                New {transactionType === "income" ? "Income" : "Expense"}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Transaction Type */}
                <Tabs value={transactionType} onValueChange={handleTypeChange}>
                  <TabsList className="grid w-full grid-cols-2 bg-slate-100">
                    <TabsTrigger
                      value="expense"
                      className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                    >
                      <TrendingDown className="w-4 h-4 mr-2" />
                      Expense
                    </TabsTrigger>
                    <TabsTrigger
                      value="income"
                      className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Income
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-lg font-semibold">
                    Amount
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-slate-600">
                      $
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={(e) =>
                        handleInputChange("amount", e.target.value)
                      }
                      className="text-2xl font-bold pl-8 h-14 border-2"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-lg font-semibold"
                  >
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="What was this transaction for?"
                    className="h-12 text-lg"
                    required
                  />
                </div>

                {/* Category and Date */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="category"
                      className="text-lg font-semibold"
                    >
                      Category
                    </Label>
                    <Select
                      required
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCategories.map((category) => (
                          <SelectItem
                            key={category._id}
                            value={category._id}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-lg font-semibold">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange("date", e.target.value)
                      }
                      className="h-12"
                      required
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-lg font-semibold">
                    Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      handleInputChange("notes", e.target.value)
                    }
                    placeholder="Any additional details..."
                    className="h-24"
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(createPageUrl("Dashboard"))}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 text-white font-semibold ${
                      transactionType === "income"
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        : "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                    }`}
                  >
                    {isLoading
                      ? "Saving..."
                      : `Add ${
                          transactionType === "income" ? "Income" : "Expense"
                        }`}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
