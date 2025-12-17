const Transaction = require('../models/Transaction');

// @desc    Get all transactions for logged-in user
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

// @desc    Add transaction
// @route   POST /api/transactions
exports.addTransaction = async (req, res) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      user: req.user
    });
    console.log("Transaction to be saved:", transaction);
    let savedTransaction = await transaction.save();
    savedTransaction = await savedTransaction.populate("category");

    res.status(201).json(savedTransaction);
  } catch (err) {
    console.error("AddTransaction Error:", err);
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete transaction (user-owned only)
// @route   DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user
    }).populate("category");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await transaction.deleteOne();

    res.status(200).json({
      message: "Transaction removed",
      deletedTransaction: transaction
    });
  } catch (err) {
    console.error("DeleteTransaction Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
