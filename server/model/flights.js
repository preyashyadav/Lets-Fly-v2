const mongoose = require('mongoose');
const { Schema } = mongoose;

const flightSchema = new Schema({
    flight_data: {
        type: Object
    }
});

const Flight = mongoose.model('flight', flightSchema);
module.exports = Flight;