const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json());
const port = process.env.PORT || 3000;

app.use('/', require('./server/routes'));
app.use('/api', require('./server/api'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});