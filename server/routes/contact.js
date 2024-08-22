const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');

const Contact = require('../model/contact');
const fetchUser = require("../middleware/fetchUser");

// ROUTE 1 - Create a contact with endpoint (POST : '/contact/newuser').
router.post("/create", [
    body('name', "Name should not be less than 3 characters.").isLength({ min: 3 }),
    body('email', "Enter a valid email address.").isEmail()
], async (req, res) => {

    // Return bad requests for errors
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            type: "error",
            message: error.array()
        });
    }

    const { name, email, subject, message } = req.body;
    try {
        // Send value in Database
        await Contact.create({
            name,
            email,
            subject,
            message
        });

        return res.status(200).json({
            type: "success",
            message: "Query submitted successfully.",
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong.",
        });
    }
});

// ROUTE 2 - Get all contact details with endpoint (POST : '/contact')
router.post('/', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        const data = await Contact.find();
        if (data.length === 0)
            return res.status(200).json({
                type: "success",
                message: "Data Not found.",
                data: []
            });

        return res.status(200).json({
            type: "success",
            message: "Details fetched successfully.",
            data: data
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 3 - Get the contact details from ID with endpoint (POST : '/contact/:id')
router.post('/:id', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        const data = await Contact.findById(req.params.id);
        if (!data)
            return res.status(404).json({
                type: "error",
                message: "Data not found."
            });

        return res.status(200).json({
            type: "success",
            message: "Details fetched successfully.",
            data: data
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 4 - Update the contact status with endpoint (PUT : '/contact/:id')
router.put('/:id', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        const existingData = await Contact.findById(req.params.id);
        if (!existingData)
            return res.status(404).json({
                type: "error",
                message: "Data not found."
            });

        if (existingData.status === "resolved")
            return res.status(401).json({
                type: "error",
                message: "Query already resolved."
            });

        let data = await Contact.findByIdAndUpdate(req.params.id, {
            status: "resolved"
        }, { new: true });

        if (!data)
            return res.status(404).json({
                type: "error",
                message: "Query did not resolved."
            });

        res.status(200).json({
            type: "success",
            message: "Query resolved."
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 5 - Delete the contact details with endpoint (DELETE : '/contact/:id')
router.delete('/:id', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        let data = await Contact.findByIdAndDelete(req.params.id);
        if (!data)
            return res.status(404).json({
                type: "error",
                message: "Data not found."
            });

        return res.status(200).json({
            type: "success",
            message: "Details deleted successfully."
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

module.exports = router;