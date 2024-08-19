const mongoose = require('mongoose');
const dotenv = require('dotenv').config();


function dbConection() {
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', err);
    }
}

module.exports = {
    dbConection
}