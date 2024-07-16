const express = require('express');
const router = express.Router();

const axios = require('axios');

router.get('/', async (req, res) => {
    try {
        const todos = await axios.get('https://jsonplaceholder.typicode.com/todos');
        res.status(200).send({
            result: todos.data
        })
    } catch(err) {
        res.status(500).send({
            message: err.message
        })
    }
});

router.get('/:id', async (req, res) => {
    try {
        const todos = await axios.get(`https://jsonplaceholder.typicode.com/todos/${req.params.id}`);
        res.status(200).send({
            result: todos.data
        })
    } catch(err) {
        res.status(500).send({
            message: err.message
        })
    }
});

module.exports = router;