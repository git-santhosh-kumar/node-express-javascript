const express = require('express');
require('dotenv').config();
const app = express();
const PORT = 8080;

// Middleware
app.use(express.json()); // Parse JSON

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const authRoutes = require('./src/routes/authRoutes');
app.use('/api', authRoutes);

// Routes
app.get('/', (req,   res) => {
  res.send('Hello from Express!');
});

// http://localhost:8080/user/1
app.get('/user/:id', (req, res) => {
    res.status(200).json({
        message: 'User ID',
        id: req.params.id
    });
});

// http://localhost:8080/search?name=santhosh
app.get('/search', (req, res) => {
    res.json({query: req.query});
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
