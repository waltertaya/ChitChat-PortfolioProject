const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());
const port = process.env.PORT || 3000;

app.use('/api', require('./server/api'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});