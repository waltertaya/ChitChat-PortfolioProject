const express = require('express');
const session = require('express-session');
require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json());
const port = process.env.PORT || 3000;

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use('/', require('./server/routes'));
app.use('/api', require('./server/api'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
