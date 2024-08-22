const mongoose = require('mongoose');
const { Schema } = mongoose;

// Declare the schema (how the contact data will be stored)
const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status:{
        type: String,
        default: "pending"
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model('contact', contactSchema);
module.exports = Contact;