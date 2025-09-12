const categories = [
  // Income
  { name: "Salary", type: "income", color: "#22c55e", icon: "💼" },
  { name: "Freelance", type: "income", color: "#3b82f6", icon: "🖥️" },
  { name: "Investments", type: "income", color: "#facc15", icon: "📈" },
  { name: "Bonus", type: "income", color: "#0ea5e9", icon: "🎁" },

  // Expense
  { name: "Food", type: "expense", color: "#ef4444", icon: "🍔", budget_limit: 500 },
  { name: "Transport", type: "expense", color: "#f59e0b", icon: "🚌", budget_limit: 300 },
  { name: "Entertainment", type: "expense", color: "#8b5cf6", icon: "🎬", budget_limit: 200 },
  { name: "Utilities", type: "expense", color: "#0f172a", icon: "💡", budget_limit: 400 },
  { name: "Shopping", type: "expense", color: "#ec4899", icon: "🛍️", budget_limit: 600 },
  { name: "Healthcare", type: "expense", color: "#f97316", icon: "💊", budget_limit: 300 },

  // Both
  { name: "Savings", type: "both", color: "#14b8a6", icon: "🏦" },
  { name: "Gifts", type: "both", color: "#f43f5e", icon: "🎁" },
  { name: "Education", type: "both", color: "#22d3ee", icon: "📚" },
  { name: "Travel", type: "both", color: "#6366f1", icon: "✈️" },
  { name: "Subscriptions", type: "both", color: "#facc15", icon: "📺" },
];


module.exports = categories;