const express = require('express');
const router = express.Router();
const {
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const auth = require('../middleware/auth'); // Add this

// Apply auth middleware to all routes
router.use(auth);
router.route('/').get(getCategories).post(addCategory);
router.route('/:id').put(updateCategory).delete(deleteCategory);


module.exports = router;