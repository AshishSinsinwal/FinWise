// seeder.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("./models/Category"); // adjust path if needed

dotenv.config(); // loads .env (make sure it has MONGO_URI)

const defaultCategories = [
  // Income categories
  { name: "Salary", type: "income", color: "#22c55e" },
  { name: "Business", type: "income", color: "#16a34a" },
  { name: "Investments", type: "income", color: "#15803d" },
  { name: "Freelance", type: "income", color: "#10b981" },

  // Expense categories
  { name: "Food & Dining", type: "expense", color: "#ef4444" },
  { name: "Transport", type: "expense", color: "#3b82f6" },
  { name: "Shopping", type: "expense", color: "#eab308" },
  { name: "Entertainment", type: "expense", color: "#a855f7" },
  { name: "Bills & Utilities", type: "expense", color: "#f97316" },
  { name: "Healthcare", type: "expense", color: "#06b6d4" },
  { name: "Travel", type: "expense", color: "#0ea5e9" },
  { name: "Groceries", type: "expense", color: "#84cc16" },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");

    // Clear old categories (optional, only if you want fresh start)
    await Category.deleteMany({ user: null });
    console.log("Old global categories removed.");

    // Insert defaults as "global" (user: null)
    const inserted = await Category.insertMany(
      defaultCategories.map((cat) => ({ ...cat, user: null }))
    );

    console.log("Default categories seeded:", inserted.length);
    process.exit(0);
  } catch (err) {
    console.error("Seeder Error:", err);
    process.exit(1);
  }
};

seedCategories();
