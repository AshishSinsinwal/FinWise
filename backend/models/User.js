const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      select: false // not required for OAuth, hidden by default
    },
    googleId: { type: String, unique: true, sparse: true }, 
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    provider: {
      type: String,
      enum: ['local', 'google', 'github'],
      default: 'local'
    }
  },
  { timestamps: true }
);

/**
 * CASCADE DELETE:
 * When a user is deleted, delete:
 * 1. All transactions of the user
 * 2. All user-created categories
 */
UserSchema.post('findOneAndDelete', async function (doc) {
  if (!doc) return;

  const mongoose = require('mongoose');
  const Transaction = mongoose.model('FinWiseTransaction');
  const Category = mongoose.model('FinWiseCategory');

  await Transaction.deleteMany({ user: doc._id });
  await Category.deleteMany({ user: doc._id });
});

module.exports = mongoose.model('FinWiseUser', UserSchema);
