const mongoose = require('mongoose');
const { Schema } = mongoose;

// Declare the schema (how the airport data will be stored)
const airportSchema = new Schema({
    airport_code: {
        type: String,
        required: true,
    },
    airport_name: {
        type: String,
        required: true,
    },
    country_code: {
        type: String,
        required: true,
    },
    country_name: {
        type: String,
        required: true,
    },
    state_code: {
        type: String,
        required: true,
    },
    state_name: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    longitude: {
        type: String,
        required: true,
    },
    latitude: {
        type: String,
        required: true,
    },
});

const Airport = mongoose.model('airport', airportSchema);
module.exports = Airport;