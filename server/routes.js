const router = require('express').Router();
const session = require('express-session');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const generateOTP = require('../DB/security/otp');
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
    const { username, password, email } = req.body;
    let config = {
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_APP_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    }
    
    let transporter = nodemailer.createTransport(config);
    let otp = generateOTP();
    let message = {
        from: process.env.GMAIL_APP_USER,
        to: email,
        subject: 'Welcome to ChitChat your AI companion',
        html: `<h1>Welcome to ChitChat</h1><p>Thank you for signing up. Your OTP code is <b>${otp}</b> </p>`,
        // attachments: [ 
        //     {
        //       filename: 'receipt_test.pdf',
        //       path: 'receipt_test.pdf',
        //       cid: 'uniqreceipt_test.pdf' 
        //     }
        // ]
    };

    transporter.sendMail(message, (error, info) => {
        if (error) {
            console.log(error);
            res.redirect('/signup');
        } else {
            console.log('Email sent: ' + info.response);
            res.render('otp', { username, password, email, otp });
        }
    });
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