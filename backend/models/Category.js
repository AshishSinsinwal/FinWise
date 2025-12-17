const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FinWiseUser',
      required: false // null => global / default category
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['income', 'expense', 'both'],
      required: true
    },
    color: {
      type: String,
      required: true
    },
    icon: {
      type: String
    },
    budget_limit: {
      type: Number,
      min: 0
    }
  },
  { timestamps: true }
);

/**
 * user + name must be unique
 * - prevents duplicate categories per user
 * - also enforces uniqueness for global categories
 */
CategorySchema.index({ user: 1, name: 1 }, { unique: true });

/**
 * PREVENT DELETE:
 * A category cannot be deleted if any transaction is associated with it
 */
CategorySchema.pre('findOneAndDelete', async function (next) {
  const category = await this.model.findOne(this.getQuery());
  if (!category) return next();

  const Transaction = mongoose.model('Transaction');

  const count = await Transaction.countDocuments({
    category: category._id
  });

  if (count > 0) {
    return next(
      new Error('Cannot delete category: transactions are associated with it')
    );
  }

  next();
});

module.exports = mongoose.model('FinWiseCategory', CategorySchema);
