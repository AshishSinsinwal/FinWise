const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            provider: 'local'
        });

        const savedUser = await user.save();

        // Generate token
        const token = generateToken(savedUser._id);

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                avatar: savedUser.avatar
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if user registered with OAuth
        if (!user.password) {
            return res.status(400).json({ 
                message: 'Please sign in with your social account' 
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);
        console.log(`${user._id} loged in ----------------------------`);
        console.log(token);
        console.log(`${user._id} , ${user.name} , ${user.email} , ${user.avatar}`);
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });
        console.log(res.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// controllers/authController.js
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// @desc    OAuth Success
// @route   GET /api/auth/oauth/success
exports.oauthSuccess = (req, res) => {
    if (req.user) {
        const token = generateToken(req.user._id);
        
        // Redirect to frontend with token
        res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
    } else {
        res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
    }
};