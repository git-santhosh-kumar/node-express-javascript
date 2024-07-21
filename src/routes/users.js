const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router()

module.exports = (db) => {
    router.get('/', async (req, res) => {
        try {
            const users = await db.collection('users').find().limit(50).toArray();

            res.status(200).json(users);
        } catch(err) {
            res.status(500).json({ message: err.message });
        }
    });

    router.get('/:id', async (req, res) => {
        try {
            const userId = req.params.id;
            console.log("***", userId)
            if(!req.params.id) {
                throw new Error(`Not a valid id.`)
            }

            const users = await db.collection('users').findOne({ _id: ObjectId(userId) }).limit(50).toArray();

            res.status(200).json(users);
        } catch(err) {
            res.status(500).json({ message: err.message });
        }
    });

    router.post('/', async (req, res) => {
        try {
            /*
                Input query example:
                {
                    "name": {
                        "$in": ["Petyr Baelish", "Samwell Tarly"]
                    }
                }
            */
            const reqBody = req.body;
            const users = await db.collection('users').find(reqBody).limit(50).toArray();

            res.status(200).json(users);
        } catch(err) {
            res.status(500).json({ message: err.message });
        }
    });

    return router;
};