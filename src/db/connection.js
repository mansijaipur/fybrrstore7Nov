const mongoose = require('mongoose');
require('dotenv').config();
let conn;
const URI = process.env.MONGODB_URL;

const connectDB = async() => {
    try {
        await mongoose.connect(URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log('DB Connected!');
    } catch (err) {
        console.log('Error while connecting DB: ' + err);
    }


};

mongoose.connection.on('connected', () => {
    conn = mongoose.connection;
});

module.exports = { connectDB, conn };