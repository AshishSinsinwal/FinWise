import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils/index";
// Import the utilities
import { formatCurrencyCompact, formatCurrencyFull } from "../../utils/formatters";

export default function RecentTransactions({ transactions, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200"
                title={`Full amount: ${formatCurrencyFull(transaction.amount)}`}
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Left: Category (Min-w-0 allows truncation) */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: transaction.category?.color || "#9ca3af" }}
                    />
                    <span className="font-medium truncate">
                      {transaction.category?.name || "Uncategorized"}
                    </span>
                  </div>

                  {/* Right: Amount (Shrink-0 keeps it from disappearing) */}
                  <p
                    className={`font-bold text-lg shrink-0 ${
                      transaction.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrencyCompact(transaction.amount)}
                  </p>
                </div>

                {/* Bottom: Date */}
                <p className="text-xs text-slate-500 mt-1">
                  {format(new Date(transaction.date), "MMM dd")}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500">No transactions yet</p>
              <Link to={createPageUrl("AddTransaction")}>
                <Badge variant="outline" className="mt-2 cursor-pointer hover:bg-slate-100">
                  Add your first transaction
                </Badge>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}