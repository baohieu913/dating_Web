const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
var bodyParser = require("body-parser");
const methodOverride = require('method-override');
const path = require('path');


const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const homeRouter = require('./routes/home');
const conversationRouter = require('./routes/conversation');
const messageRouter = require('./routes/message');

dotenv.config();

// CONNECT DB
const db = require('./config/db');
db.connect();

const app = express();

app.use(bodyParser.json({limit:"50mb"}));
app.use(methodOverride('_method'));
app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(cookieParser());
// app.use(express.json());
app.use(morgan('common'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ROUTES
app.use('/api/auth', authRouter);
app.use('/v1/user', userRouter);
app.use('/v1/message', messageRouter);
app.use('/v1/conversation', conversationRouter);
app.use('/v1', homeRouter);

app.listen(process.env.PORT || 3000 , () => {
    console.log("Server is running...");
});