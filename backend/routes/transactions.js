const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const {
    getTransactions,
    addTransaction,
    deleteTransaction,
} = require('../controllers/transactionController');
// Apply auth middleware to all routes
router.use(auth);

router.route('/').get(getTransactions).post(addTransaction);
router.route('/:id').delete(deleteTransaction);

module.exports = router;