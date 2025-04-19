const User = require('../models/user');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/sendEmails');
const crypto = require('crypto');

const usersFile = path.join(__dirname, '../rawdata/users.json');
const JWT_SECRET = process.env.JWT_SECRET;

// Read/Write users
const getUsers = () => JSON.parse(fs.readFileSync(usersFile, 'utf8'));
const saveUsers = users => fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;
  
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) return res.status(400).json({ error: 'User exists' });

    const hashed = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(20).toString('hex');

    const user = new User({ username, email, password: hashed, role, verifyToken });
    await user.save();

    await sendVerificationEmail(email, verifyToken);
    res.status(201).json({ message: 'User created. Check email to verify.' });
};

exports.verifyEmail = async (req, res) => {
    const { token } = req.query;
    const user = await User.findOne({ verifyToken: token });
    if (!user) return res.status(400).json({ error: 'Invalid token' });
  
    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();
    res.json({ message: 'Email verified. You can now log in.' });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (!user.isVerified) return res.status(403).json({ error: 'Email not verified' });
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Wrong password' });
  
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token });
};

exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
};

exports.adminRoute = async (req, res) => {
    res.json({ message: 'Welcome Admin!' });
};
