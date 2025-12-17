const Category = require('../models/Category');

// @desc    Get all categories (user-specific + global)
// @route   GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      $or: [{ user: req.user }, { user: null }]
    });

    res.status(200).json(categories);
  } catch (err) {
    console.error("GetCategories Error:", err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add category (user-specific only)
// @route   POST /api/categories
exports.addCategory = async (req, res) => {
  try {
    const { name, type, color, budget_limit } = req.body;

    const newCategory = new Category({
      name,
      type,
      color,
      budget_limit,
      user: req.user
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    console.error("AddCategory Error:", err);
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update category (ONLY user-owned)
// @route   PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found or not editable' });
    }

    category.name = req.body.name ?? category.name;
    category.type = req.body.type ?? category.type;
    category.color = req.body.color ?? category.color;
    category.budget_limit = req.body.budget_limit ?? category.budget_limit;

    await category.save(); // ensures validation & hooks

    res.status(200).json(category);
  } catch (err) {
    console.error("UpdateCategory Error:", err);
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete category (ONLY user-owned & unused)
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Block global categories
    if (!category.user) {
      return res.status(403).json({ message: "Cannot delete global category" });
    }

    // Ownership check
    if (category.user.toString() !== req.user.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Category.findByIdAndDelete(req.params.id); // triggers model hook
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("DeleteCategory Error:", err);
    res.status(400).json({ message: err.message });
  }
};
