require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const db = require('./config/db');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileupload({
    useTempFiles:true,
}));


//ROUTES
app.use('/api/auth_admin', require('./routes/authAdminRouter'));
app.use('/api/auth_user', require('./routes/authUserRouter'));
app.use('/api', require('./routes/categoryRouter'));
app.use('/api', require('./routes/upload'));
app.use('/api', require('./routes/productRouter'));
app.use('/api', require('./routes/paymentRoute'));
app.use('/api', require('./routes/employeRouter'));
app.use('/api', require('./routes/attendanceRouter'));
app.use('/api', require('./routes/adminRoute'));
app.use('/api', require('./routes/userRoute'));
app.use('/api', require('./routes/salaryRouter'));
app.use('/api', require('./routes/adviseRouter'));
//Connect to mongodb
db.connect();


if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log('Running on PORT', PORT);
});

