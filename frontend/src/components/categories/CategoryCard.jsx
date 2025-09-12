import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, TrendingUp, TrendingDown, Hash , Trash} from "lucide-react";
import { motion } from "framer-motion";

export default function CategoryCard({ category, stats, onEdit }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: category.color + "20" }}
              >
                <Hash 
                  className="w-6 h-6" 
                  style={{ color: category.color }}
                />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{category.name}</h3>
                <Badge 
                  variant="outline" 
                  className={`capitalize ${
                    category.type === "income" ? "text-green-700 border-green-300" :
                    category.type === "expense" ? "text-red-700 border-red-300" :
                    "text-blue-700 border-blue-300"
                  }`}
                >
                  {category.type}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(category)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-slate-700">Income</span>
              </div>
              <span className="font-bold text-green-600">${stats.totalEarned.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-sm text-slate-700">Expenses</span>
              </div>
              <span className="font-bold text-red-600">${stats.totalSpent.toFixed(2)}</span>
            </div>

            <div className="text-center pt-2">
              <span className="text-sm text-slate-500">{stats.transactionCount} transactions</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}