const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

// Declare the schema (how the booking data will be stored)
const bookingSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    flight_id: {
        type: String,
        required: true,
    },
    flight_number: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "pending",
    },
    order_id: {
        type: String,
        required: true,
        unique: true
    },
    transaction_id: {
        type: String,
    },
    distance: {
        type: String,
        required: true,
    },
    flight_time: {
        type: String,
        required: true,
    },
    arrival_ap: {
        type: Object,
        code: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        terminal: {
            type: String,
            required: true,
        }
    },
    departure_ap: {
        type: Object,
        code: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        terminal: {
            type: String,
            required: true,
        }
    },
    add_on: {
        type: Object,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Booking = mongoose.model('booking', bookingSchema);
module.exports = Booking;