const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'FinWiseUser' , required : false}, // optional, for personal categories
    name: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense', 'both'], required: true },
    color: { type: String, required: true },
    icon: { type: String },
    budget_limit: { type: Number },
}, { timestamps: true });
// compound index: user + name must be unique together
CategorySchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Category', CategorySchema);

