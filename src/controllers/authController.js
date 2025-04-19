const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usersFile = path.join(__dirname, '../rawdata/users.json');
const JWT_SECRET = process.env.JWT_SECRET;

// Read/Write users
const getUsers = () => JSON.parse(fs.readFileSync(usersFile, 'utf8'));
const saveUsers = users => fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

exports.register = (req, res) => {
    const { username, password } = req.body;
  
    try {
        const users = getUsers();

        if (users.find(u => u.username === username)) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        users.push({ username, password: hashedPassword });
        saveUsers(users);

        res.status(201).json({ message: 'User registered successfully' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    try {
        const users = getUsers();

        const user = users.find(u => u.username === username);
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getProfile = (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}` });
};
