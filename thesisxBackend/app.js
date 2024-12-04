const express = require('express');

const app = express();

const LoginSignupRoutes = require('./routes/AuthRoutes');

app.use('/user', LoginSignupRoutes);


module.exports = app;