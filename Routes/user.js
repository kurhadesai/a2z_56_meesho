var express = require('express');
var router = express.Router();
var db = require('../db.js');
var bcrypt = require('bcrypt');
var { sendOTP, generateOTP } = require('../utils/sendOTP');

// Signup page
router.get('/signup', (req, res) => {
    res.render('signup');
});

// Handle signup
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.render('signup', { error: 'All fields are required' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = generateOTP();
        const otpCreatedAt = new Date();

        // Insert user with OTP
        const sql = 'INSERT INTO singup (username, email, password, otp, otp_created_at) VALUES (?, ?, ?, ?, ?)';
        await db(sql, [username, email, hashedPassword, otp, otpCreatedAt]);

        // Send OTP email
        const emailResult = await sendOTP(email, otp);

        if (!emailResult.success) {
            await db('DELETE FROM singup WHERE email = ? AND is_verified = false', [email]);
            return res.render('signup', { error: 'Failed to send OTP. Please try again.' });
        }

        // Store email in session
        req.session.pendingEmail = email;

        res.render('verifyOTP', { email: email });
    } catch (error) {
        console.error('Signup error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.render('signup', { error: 'Username or email already exists' });
        } else {
            res.render('signup', { error: 'An error occurred. Please try again.' });
        }
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { otp, email } = req.body;

        if (!otp || !email) {
            return res.render('verifyOTP', { email, error: 'OTP is required' });
        }

        // Get user
        const sql = 'SELECT * FROM singup WHERE email = ?';
        const singup = await db(sql, [email]);

        if (!singup || singup.length === 0) {
            return res.render('verifyOTP', { email, error: 'User not found' });
        }

        const user = singup[0];

        // Check if OTP has expired (10 minutes)
        const otpCreatedAt = new Date(user.otp_created_at);
        const currentTime = new Date();
        const otpAgeMinutes = (currentTime - otpCreatedAt) / (1000 * 60);

        if (otpAgeMinutes > 10) {
            return res.render('verifyOTP', { email, error: 'OTP has expired. Please sign up again.' });
        }

        // Verify OTP
        if (user.otp !== otp) {
            return res.render('verifyOTP', { email, error: 'Invalid OTP. Please try again.' });
        }

        // Update user as verified
        const updateSql = 'UPDATE singup SET is_verified = true, otp = NULL WHERE email = ?';
        await db(updateSql, [email]);

        // Set session
        req.session.userId = user.id;
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        // Redirect to dashboard or home
        res.redirect('/dashboard');
    } catch (error) {
        console.error('OTP verification error:', error);
        res.render('verifyOTP', { email: req.body.email, error: 'An error occurred. Please try again.' });
    }
});

// Resend OTP
router.get('/resend-otp', async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.redirect('/signup');
        }

        // Get user
        const sql = 'SELECT * FROM singup WHERE email = ?';
        const singup = await db(sql, [email]);

        if (!singup || singup.length === 0) {
            return res.render('verifyOTP', { email, error: 'User not found' });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpCreatedAt = new Date();

        // Update OTP
        const updateSql = 'UPDATE singup SET otp = ?, otp_created_at = ? WHERE email = ?';
        await db(updateSql, [otp, otpCreatedAt, email]);

        // Send OTP email
        const emailResult = await sendOTP(email, otp);

        if (!emailResult.success) {
            return res.render('verifyOTP', { email, error: 'Failed to resend OTP. Please try again.' });
        }

        res.render('verifyOTP', { email, success: 'New OTP sent to your email.' });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.render('verifyOTP', { email: req.query.email, error: 'An error occurred. Please try again.' });
    }
});

// Dashboard (protected route)
router.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.render('dashboard', { user: req.session.user });
});

// Login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('login', { error: 'Email and password are required' });
        }

        // Get user
        const sql = 'SELECT * FROM singup WHERE email = ?';
        const singup = await db(sql, [email]);

        if (!singup || singup.length === 0) {
            return res.render('login', { error: 'Invalid email or password' });
        }

        const user = singup[0];

        // Check if email is verified
        if (!user.is_verified) {
            return res.render('login', { error: 'Please verify your email first' });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.render('login', { error: 'Invalid email or password' });
        }

        // Set session
        req.session.userId = user.id;
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', { error: 'An error occurred. Please try again.' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Error logging out');
        }
        res.redirect('/');
    });
});

// Home page
router.get('/', (req, res) => {
    res.render('user/index', {
        user: req.session.user || null
    });
});

module.exports = router;
