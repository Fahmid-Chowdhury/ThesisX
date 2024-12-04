const express = require('express');

const app = express();

const LoginSignupRoutes = require('./routes/LoginSignup');

app.use('/user', LoginSignupRoutes);


module.exports = app;