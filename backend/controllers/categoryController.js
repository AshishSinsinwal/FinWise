const Category = require('../models/Category');

// @desc    Get all categories for the logged-in user (or global ones)
// @route   GET /api/categories
exports.getCategories = async (req, res) => {
    try {
       const categories = await Category.find({
  $or: [{ user: req.user}, { user: null }],
});
        
        console.log(categories);
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a category for the logged-in user
// @route   POST /api/categories
exports.addCategory = async (req, res) => {
  try {
    console.log("here------------------------------");
    console.log("user:", req.user);
    console.log("body:", req.body);

    const { name, type, color, budget_limit } = req.body;

    const newCategory = new Category({
      name,
      type,
      color,
      budget_limit,
      user: req.user, // always ObjectId
    });

    const savedCategory = await newCategory.save();

    console.log("savedCategory:", savedCategory);
    return res.status(201).json(savedCategory);
  } catch (err) {
    console.error("AddCategory Error:", err);
    return res.status(400).json({ message: err.message });
  }
};

// @desc    Update a category (only if it belongs to the logged-in user)
// @route   PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
    try {
        let category = await Category.findOne({ _id: req.params.id,   $or: [{ user: req.user}, { user: null }] });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};


exports.deleteCategory = async(req , res) => {
  try {
    const category = await Category.findById(req.params.id);
    console.log("Deleting category:", category);
    console.log("Logged-in user:", req.user.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Prevent deleting global categories
    if (!category.user) {
      return res.status(403).json({ message: "Cannot delete global category" });
    }

    // Prevent deleting another user's category
    if (category.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await category.deleteOne();
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
