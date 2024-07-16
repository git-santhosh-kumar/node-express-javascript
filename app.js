const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Server is running. You are in home page.')
})

const todosRoutes = require('./src/routes/todos');
app.use('/todos', todosRoutes);

app.listen(3000, () => {
    console.log(`Server listening on 3000`);
})