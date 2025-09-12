const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

// @desc    Get all transactions for the logged-in user
// @route   GET /api/transactions
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user })
            .sort({ date: -1 })
            .populate("category");

        res.status(200).json(transactions);
    } catch (err) {
        console.error("GetTransactions Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Add a transaction for the logged-in user
// @route   POST /api/transactions
exports.addTransaction = async (req, res) => {
    try {
        console.log("Incoming transaction body:", req.body);

        const newTransaction = new Transaction({
            ...req.body,
            user: req.user, // associate with the logged-in user
        });

        let savedTransaction = await newTransaction.save();

        // Populate category before sending response
        savedTransaction = await savedTransaction .populate("category");

        res.status(201).json(savedTransaction);
    } catch (err) {
        console.error("AddTransaction Error:", err);
        res.status(400).json({ message: "Invalid data" });
    }
};

// @desc    Delete a transaction (only if it belongs to the logged-in user)
// @route   DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res) => {
    try {
        let transaction = await Transaction.findOne({ _id: req.params.id, user: req.user })
            .populate("category");

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        await transaction.deleteOne(); // remove the document

        res.status(200).json({
            message: "Transaction removed",
            deletedTransaction: transaction
        });
    } catch (err) {
        console.error("DeleteTransaction Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};
