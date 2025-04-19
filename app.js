const express = require('express');
// init app and middleware
const app = express();
app.use(express.json());

const { connectToDb, getDb } = require('./db');
const PORT = process.env.PORT || 5000;

/* Connet to database */
let db;

connectToDb((err) => {
    console.log(`****connectToDb****`, typeof err);
    if(typeof err !== undefined) {
        // Listen to the server only when database is connected.
        app.listen(PORT, () => {
            console.log(`Server listening on ${PORT}`);
        })

        // get the database connection.
        db = getDb()

        // routes goes here
        app.get('/', async (req, res) => {
            try {
                const movies = await db.collection("movies").find()
                .sort({ year: 1 })
                .limit(10)
                .toArray();
                
                res.status(200).json(movies)
            } catch(err) {
                res.status(500).json({ error: "Could not fetch the documents", err })
            } 
        });
        
        /* Todos apis */
        const todosRoutes = require('./src/routes/todos');
        app.use('/todos', todosRoutes);
        
        /* Users apis */
        const usersRoutes = require('./src/routes/users')(db);
        app.use('/users', usersRoutes);
    }
});