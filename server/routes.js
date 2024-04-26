const router = require('express').Router();
const session = require('express-session');
require('dotenv').config();

router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // console.log(username, password);
    // console.log(process.env.USERNAME, process.env.PASSWORD);
    if (username === process.env.USERNAME && password === process.env.PASSWORD) {
        req.session.loggedIn = true;
        // console.log('Logged in');
        res.redirect('/');
    } else {
        // console.log('Invalid credentials');
        res.redirect('/login');
    }
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', (req, res) => {
    res.redirect('/login');
});

router.use((req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

router.get('/', (req, res) => {
    const data = {"message": "You are logged in!. You can now access our api routes"};
    res.json(data);
});

module.exports = router;