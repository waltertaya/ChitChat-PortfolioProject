const router = require('express').Router();
const db = require('../DB/db');
const User = require('../DB/models/users');
const Chat = require('../DB/models/chats');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const generateOTP = require('../DB/security/otp');
const { hashPassword, comparePassword } = require('../DB/security/auth');
require('dotenv').config();


router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
        const match = await comparePassword(password, user.password);
        if (match) {
            req.session.loggedIn = true;
            req.session.user = user;
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    const { username, password, email, name, gender } = req.body;
    const existingUser = await User.findOne({ username });
    console.log(existingUser);
    if (existingUser) {
        console.log('User already exists');
        res.redirect('/signup');
    } else {
        let config = {
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_APP_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        };
        let transporter = nodemailer.createTransport(config);
        let otp = generateOTP();
        let message = {
            from: process.env.GMAIL_APP_USER,
            to: email,
            subject: 'Welcome to ChitChat your AI companion',
            html: `<h1> 🎉 Welcome to ChitChat! 🎉 </h1>
            <br><br> <p> Thank you for joining us! Your One-Time Passcode (OTP) awaits:
            <h2><strong>${otp}</strong><h2> <br><br> Happy chatting! </p>`,
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
                req.session.otp = otp;
                const data = { username, password, email, name, gender };
                req.session.data = data;
                res.redirect('/otp');
            }
        });
    }
});

router.get('/otp', (req, res) => {
    res.render('otp');
});

router.post('/otp', async (req, res) => {
    const { otp1, otp2, otp3, otp4, otp5, otp6 } = req.body;

    const otp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;

    if (otp === req.session.otp) {
        const { username, password, email, name, gender } = req.session.data;
        const hashedPassword = await hashPassword(password);
        const newUser = new User({
            username, 
            password: hashedPassword, 
            email,
            name,
            gender
        });
        await newUser.save();
        res.redirect('/login');
    } else {
        res.redirect('/otp');
    }
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

router.get('/profile', (req, res) => {
    res.render('profile');
});

router.get('/update', (req, res) => {
    res.render('edit-profile');
});

router.post('/update', async (req, res) => {
    const { username, password, email, gender } = req.body;
    const user = await User.findOne({ username });
    if (user) {
        user.password = await hashPassword(password);
        user.email = email;
        user.gender = gender;
        await user.save();
        res.redirect('/profile');
    }
});

router.get('/', async (req, res) => {  
    const userChats = await Chat.findOne({ username: req.session.user.username });
    if (userChats) {
        const messages = userChats.messages;
        res.render('index', { messages });
    } else {
        res.render('index');
    }
});

module.exports = router;
