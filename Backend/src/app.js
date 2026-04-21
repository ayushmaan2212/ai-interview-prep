const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: '*',
    credentials: true
}))

/*  require all the routes */
const authRouter = require('../src/routes/auth.route');
const interviewRouter = require('../src/routes/interview.route');

/*  using all the routes */
app.use("/api/auth" , authRouter);
app.use("/api/interview" , interviewRouter);



module.exports = app;