var express = require('express');
var app = express();

var session = require('express-session');
var fileupload = require('express-fileupload');
require('dotenv').config();

var app = express();

var setupDatabase = require('./dbSetup');
var admin = require('./Routes/admin.js');
var user = require('./Routes/user.js');
var setupDatabase = require('./dbSetup');
var admin = require('./routes/admin.js');
var user = require('./routes/user.js');

// Initialize database on startup
setupDatabase();

// View engine and middleware
// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(fileupload());

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'mysecretkey',
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true
}));

// Mount routes
app.use('/', user);
app.use('/admin', admin);

// Start server
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log('Server running on port ' + PORT);
});
// Routes
app.use('/', user);
app.use('/admin', admin);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
