const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FinWiseUser',
      required: true
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FinWiseCategory',
      required: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    notes: {
      type: String
    }
  },
  { timestamps: true }
);

/**
 * Common query index
 */
TransactionSchema.index({ user: 1, date: -1 });

/**
 * VALIDATIONS:
 * 1. Category must exist
 * 2. Category must be global OR belong to same user
 * 3. Category type must match transaction type (unless 'both')
 */
TransactionSchema.pre('save', async function (next) {
  const Category = mongoose.model('FinWiseCategory');

  const category = await Category.findById(this.category);
  if (!category) {
    return next(new Error('Category not found'));
  }

  if (category.user && String(category.user) !== String(this.user)) {
    return next(new Error('Category does not belong to this user'));
  }

  if (category.type !== 'both' && category.type !== this.type) {
    return next(
      new Error(`Category type mismatch: ${category.type} vs ${this.type}`)
    );
  }

  next();
});

/**
 * Validate updates as well
 */
TransactionSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (!update) return next();

  const doc = await this.model.findOne(this.getQuery());
  if (!doc) return next();

  const newCategory =
    update.category || (update.$set && update.$set.category);
  const newType =
    update.type || (update.$set && update.$set.type);

  if (!newCategory && !newType) return next();

  const Category = mongoose.model('FinWiseCategory');
  const category = await Category.findById(newCategory || doc.category);
  if (!category) {
    return next(new Error('Category not found'));
  }

  if (category.user && String(category.user) !== String(doc.user)) {
    return next(new Error('Category does not belong to this user'));
  }

  const typeToCheck = newType || doc.type;
  if (category.type !== 'both' && category.type !== typeToCheck) {
    return next(new Error('Category type mismatch'));
  }

  next();
});

module.exports = mongoose.model('FinWiseTransaction', TransactionSchema);
