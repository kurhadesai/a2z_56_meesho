# Email Verification - Quick Start

## ⚡ 30-Second Setup

### 1. Update `.env` file
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password
```

Get app password from: myaccount.google.com → Security → App passwords

### 2. Create Database
```sql
CREATE DATABASE meesho;
```

### 3. Run Application
```bash
npm install
node app.js
```

### 4. Test
- Visit: http://localhost:3000/signup
- Enter details → Receive OTP → Verify → Login

## 📋 What Was Added

| File | Purpose |
|------|---------|
| `utils/sendOTP.js` | Email sending via Nodemailer |
| `dbSetup.js` | Auto-creates singup table |
| `routes/user.js` | Auth endpoints (signup, login, verify) |
| `views/signup.ejs` | Registration form |
| `views/verifyOTP.ejs` | OTP verification form |
| `views/login.ejs` | Login form |
| `views/dashboard.ejs` | User dashboard |

## 🔑 Key Features

✅ User registration with email OTP verification  
✅ Secure password hashing with bcrypt  
✅ 6-digit OTP sent via Gmail  
✅ 10-minute OTP expiration  
✅ Resend OTP functionality  
✅ Login protection (verified emails only)  
✅ Session management  
✅ Protected routes  

## 🛣️ Available Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/signup` | GET/POST | User registration |
| `/verify-otp` | POST | OTP verification |
| `/resend-otp` | GET | Resend OTP |
| `/login` | GET/POST | User login |
| `/dashboard` | GET | User dashboard (protected) |
| `/logout` | GET | Logout |

## ⚙️ Configuration

**Database**: MySQL (meesho)  
**Email Service**: Gmail SMTP  
**OTP Length**: 6 digits  
**OTP Expiry**: 10 minutes  
**Port**: 3000  

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| OTP not sending | Check EMAIL_PASS in .env (must be 16-char app password) |
| Database error | Ensure MySQL running, database `meesho` exists |
| Can't login | Verify email must be verified first |

## 📚 Full Documentation

See `EMAIL_VERIFICATION_SETUP.md` for complete guide.
