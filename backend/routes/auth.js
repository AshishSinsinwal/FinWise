const express = require("express");
const router = express.Router();
const { 
  register, 
  login, 
  googleLogin, // Changed from oauthSuccess
  getMe 
} = require("../controllers/authController");
const auth = require("../middleware/auth");

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/google').post(googleLogin); // New endpoint for the frontend
router.route('/me').get(auth, getMe);

module.exports = router;