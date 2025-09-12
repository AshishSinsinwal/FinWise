const express = require("express");
const router = express.Router();
const {register , login , oauthSuccess , getMe,  } = require("../controllers/authController");
const auth = require("../middleware/auth");
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(auth , getMe);
router.route('/oauth/success').get(auth , oauthSuccess);

module.exports = router;
