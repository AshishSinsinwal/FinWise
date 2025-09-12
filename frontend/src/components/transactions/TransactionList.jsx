import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function TransactionList({
  transactions,
  isLoading,
  onTransactionUpdate,
}) {
  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-slate-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle>
          Transaction History ({transactions.length} transactions)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {transactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction._id} // ✅ use MongoDB _id
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50 transition-colors duration-200"
                    >
                      {/* Type */}
                      <TableCell>
                        <div
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${
                            transaction.type === "income"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="text-sm font-medium capitalize">
                            {transaction.type}
                          </span>
                        </div>
                      </TableCell>

                      {/* Description + Notes */}
                      <TableCell>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          {transaction.notes && (
                            <p className="text-sm text-slate-500 truncate max-w-xs">
                              {transaction.notes}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {/* ✅ show category name if populated */}
                          {transaction.category?.name || "Uncategorized"}
                        </Badge>
                      </TableCell>

                      {/* Date */}
                      <TableCell>
                        {transaction.date
                          ? format(new Date(transaction.date), "MMM dd, yyyy")
                          : "—"}
                      </TableCell>

                      {/* Amount */}
                      <TableCell className="text-right">
                        <span
                          className={`font-bold text-lg ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(transaction.amount)}
                        </span>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No transactions found
            </h3>
            <p className="text-slate-600">
              Try adjusting your filters or add some transactions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
