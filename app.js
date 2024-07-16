const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Server is running. You are in home page.')
})

app.listen(3000, () => {
    console.log(`Server listening on 3000`);
})