const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String,
        // Not required for OAuth
    },
    theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
    }
}, { timestamps: true });

module.exports = mongoose.model('FinWiseUser', UserSchema);