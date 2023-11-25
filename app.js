require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;
const http = require('http');

const { connectDB, conn } = require('./src/db/connection');
const User = require('./src/db/user')
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');

// app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));
// app.use(cors());
// app.use(json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const server = http.createServer(app);

// connection with Database
connectDB();

const { auth } = require('./src/middleware/auth')
const { RegisterUser, LoginUser, LogoutUser, getUserDetails } = require('./src/controller/auth_controller');

app.post('/api/user/register', RegisterUser);
app.post('/api/user/login', LoginUser);
app.get('/api/user/auth', auth, getUserDetails);
app.get('/api/user/logout', auth, LogoutUser);


// get user data

app.get('/api/user/data', auth, async(req, res) => {
    console.log(req.isAuth);
    if (!req.isAuth) {
        res.redirect('/login');
        return;
    }
    try {
        const user = await User.findOne({ name: req.user.name }, '-password');
        res.json(user);
    } catch (error) {
        console.log(error);
    }
});

app.post('/api/user/newfile', auth, async(req, res) => {
    if (!req.isAuth) {
        res.redirect('/login');
        return;
    }
    try {
        const user = await User.findOneAndUpdate({ name: req.user.name }, { $push: { files: req.body.file } });
        res.json(user);
    } catch (error) {
        console.log(error);
    }
});

app.post('/api/user/newfolder', auth, async(req, res) => {
    if (!req.isAuth) {
        res.redirect('/login');
        return;
    }
    // const fname = req.body.folderName;
    // const folobj = [{ folname: req.body.folderName }, { uuid: req.body.uuid }, { "kind": "folder" }]
    try {
        const user = await User.findOneAndUpdate({ name: req.user.name }, { $push: { files: { Fname: req.body.folderName, Fuuid: req.body.uuid, Ffiles: [] } } });
        console.log("folder created")
        res.json(user);
    } catch (error) {
        console.log(error);
    }
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/views/login2.html');

})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/views/register.html');
})

app.get('/:name', auth, (req, res) => {
    if (!req.isAuth) {
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + '/public/views/home.html');
});

app.get('/', auth, (req, res) => {
    if (!req.isAuth) {
        res.redirect('/login');
        return;
    }
    res.redirect('/' + req.user.name);
});

app.get('/folder/:name', auth, (req, res) => {
    console.log("came to backend")
    if (!req.isAuth) {
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + '/public/views/folder.html');
});

// app.get('/folder', auth, (req, res) => {
//     if (!req.isAuth) {
//         res.redirect('/login');
//         return;
//     }
//     res.sendFile(__dirname + '/public/views/folder.html');
//     res.redirect('/folder/' + req.params.name);
// })

server.listen(PORT, () => {
    console.log(`Express app listening to PORT ${PORT}`);
})