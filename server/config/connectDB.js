const mongoose = require('mongoose');

// Connect to the database
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.DATABASE_URI);

        if (!connection) {
            console.log('Error connecting to the database');
        }

        console.log(`MongoDB connected: ${connection.connection.host}`);

    } catch (err) {
        console.log(err);
    }
}

module.exports = connectDB;