const mongoose = require('mongoose');

function DbConnect() {
    const DB_URL = "mongodb://127.0.0.1:27017/CallX"
    console.log('connecting to...', DB_URL);

    mongoose.connect(DB_URL);

    const db = mongoose.connection;

    db.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    db.once('open', () => {
        console.log('DB connected...');
    });
}

module.exports = DbConnect;
