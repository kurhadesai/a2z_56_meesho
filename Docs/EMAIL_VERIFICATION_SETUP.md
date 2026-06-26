# Email Verification System Setup Guide

## Overview
This project now has a complete email verification system using OTP (One-Time Password) sent via Gmail.

## What's Been Implemented

### 1. **Database Schema** (`dbSetup.js`)
- Creates a `singup` table with the following fields:
  - `id`: Auto-increment primary key
  - `username`: Unique username
  - `email`: Unique email address
  - `password`: Hashed password using bcrypt
  - `otp`: 6-digit verification code
  - `otp_created_at`: Timestamp for OTP expiration (10 minutes)
  - `is_verified`: Boolean flag for email verification status
  - `created_at`: Account creation timestamp

### 2. **Email Service** (`utils/sendOTP.js`)
- `generateOTP()`: Creates a random 6-digit OTP
- `sendOTP(email, otp)`: Sends OTP via Gmail using Nodemailer

### 3. **User Routes** (`routes/user.js`)
- `GET /signup`: Displays signup form
- `POST /signup`: Creates new user and sends OTP
- `POST /verify-otp`: Verifies OTP and activates account
- `GET /resend-otp`: Resends OTP to email
- `GET /login`: Displays login form
- `POST /login`: Authenticates verified users
- `GET /dashboard`: Protected user dashboard
- `GET /logout`: Destroys user session

### 4. **Views/Frontend**
- `signup.ejs`: Registration form
- `verifyOTP.ejs`: OTP verification form
- `login.ejs`: Login form
- `dashboard.ejs`: User dashboard (protected)

## Setup Instructions

### Prerequisites
- Node.js installed
- MySQL database running locally
- Gmail account with 2-Factor Authentication enabled

### Step 1: Database Setup
1. Create a MySQL database:
```sql
CREATE DATABASE meesho;
```

2. Update `db.js` with your MySQL credentials if different:
```javascript
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',  // Your MySQL password
    database: 'meesho'
});
```

### Step 2: Gmail Configuration
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to myaccount.google.com
   - Security → App passwords
   - Select Mail and Windows Computer
   - Copy the generated 16-character password

3. Update `.env` file:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password (16 characters)
```

### Step 3: Install Dependencies
```bash
npm install
```

The following packages are already in package.json:
- `express`: Web framework
- `ejs`: Template engine
- `mysql2`: Database driver
- `bcrypt`: Password hashing
- `nodemailer`: Email service
- `express-session`: Session management
- `dotenv`: Environment variables

### Step 4: Start the Application
```bash
node app.js
```

The application will:
1. Automatically create the `singup` table if it doesn't exist
2. Listen on port 3000 (configured in `.env`)

## Flow Diagram

```
User → Sign Up Page
         ↓
    Enter Details
         ↓
    Create Account + Generate OTP
         ↓
    Send OTP via Email
         ↓
    Enter OTP
         ↓
    Verify OTP (Must be within 10 minutes)
         ↓
    Account Activated
         ↓
    Login → Dashboard
```

## Testing the System

### Test Account Flow:
1. Go to `http://localhost:3000/signup`
2. Fill in username, email, and password
3. OTP will be sent to your email
4. Go to `http://localhost:3000/verify-otp`
5. Enter the 6-digit OTP received
6. Account is now verified and active
7. Login with email and password

### Features to Test:
- ✅ Signup with valid email
- ✅ Duplicate email prevention
- ✅ OTP expiration (after 10 minutes)
- ✅ Resend OTP functionality
- ✅ Login only works for verified users
- ✅ Session management and logout

## Security Features

1. **Password Hashing**: Uses bcrypt with 10 rounds
2. **OTP Expiration**: OTPs valid for only 10 minutes
3. **Email Verification**: Ensures real email ownership
4. **Session Management**: Secure session cookies
5. **Input Validation**: Server-side validation on all inputs

## Troubleshooting

### OTP Not Sending
- Check `.env` file has correct EMAIL_USER and EMAIL_PASS
- Verify Gmail App Password (16 characters, not regular password)
- Check Gmail 2FA is enabled
- Check internet connection

### Database Connection Error
- Verify MySQL is running
- Check credentials in `db.js` and `.env`
- Ensure database `meesho` exists

### Session Issues
- Clear browser cookies
- Restart the application
- Check SESSION_SECRET in `.env`

### OTP Verification Fails
- Ensure you're entering exactly 6 digits
- Check OTP hasn't expired (10-minute window)
- Click "Resend OTP" to get a new code

## Environment Variables

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=meesho
SESSION_SECRET=mysecret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
```

## File Structure

```
A2Z_56_Meesho/
├── app.js                          # Main application
├── db.js                           # Database connection utility
├── dbSetup.js                      # Database initialization
├── .env                            # Environment variables
├── package.json                    # Dependencies
├── routes/
│   ├── user.js                     # User routes (signup, login, verify)
│   └── admin.js                    # Admin routes
├── utils/
│   └── sendOTP.js                  # Email sending utility
├── views/
│   ├── signup.ejs                  # Registration form
│   ├── verifyOTP.ejs               # OTP verification form
│   ├── login.ejs                   # Login form
│   └── dashboard.ejs               # User dashboard
└── public/                         # Static files
```

## Next Steps

You can extend this system by:
1. Adding password reset functionality
2. Implementing email change verification
3. Adding two-factor authentication
4. Creating an admin panel
5. Adding profile management
6. Implementing email templates

## Support

For issues or questions, check:
- Console logs for error messages
- Browser console for frontend errors
- Check Gmail settings for app password validity
