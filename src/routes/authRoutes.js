const express = require('express');
const { register, login, getProfile, verifyEmail, adminRoute } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.get('/admin', authenticate, authorizeRoles('admin'), adminRoute);

module.exports = router;
