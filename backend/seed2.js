const mongoose = require("mongoose");
const Category = require("./models/Category"); // adjust path if needed

// Replace with your MongoDB connection string
const MONGO_URI = "mongodb://localhost:27017/BasefinanceTrackApp";

async function seedCategories() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ Connected to MongoDB");

    // Sample categories
    const categories = [
      { name: "Salary", type: "income", color: "#22c55e", icon: "💼" },
      { name: "Freelance", type: "income", color: "#3b82f6", icon: "🖥️" },
      { name: "Food", type: "expense", color: "#ef4444", icon: "🍔", budget_limit: 500 },
      { name: "Transport", type: "expense", color: "#f59e0b", icon: "🚌", budget_limit: 300 },
      { name: "Entertainment", type: "expense", color: "#8b5cf6", icon: "🎬", budget_limit: 200 },
      { name: "Savings", type: "both", color: "#14b8a6", icon: "🏦" },
    ];

    // Insert categories
    await Category.insertMany(categories);
    console.log("✅ Categories seeded successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    mongoose.connection.close();
  }
}

seedCategories();
