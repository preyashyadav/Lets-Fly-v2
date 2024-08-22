const express = require("express");
const router = express.Router();

const Booking = require('../model/bookings');
const fetchUser = require("../middleware/fetchUser");

// ROUTE 1 - Get all booking details with endpoint (POST : '/booking/all') - admin
router.post('/admin/all', fetchUser, async (req, res) => {
    try {
        if(req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        let data = await Booking.find();

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

// ROUTE 2 - Get all booking details with endpoint (POST : '/booking/all')
router.post('/all', fetchUser, async (req, res) => {
    try {
        let data = await Booking.find({
            user_id: req.user.id
        });

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

// ROUTE 3 - Get the booking details from ID with endpoint (POST : '/booking/:id') - user
router.post('/:id', fetchUser, async (req, res) => {
    try {
        let data = await Booking.find({
            user_id: req.user.id,
            _id: req.params.id
        });

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

// ROUTE 4 - Get the booking details from ID with endpoint (POST : '/booking/:id') - admin
router.post('/admin/:id', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        let data = await Booking.findById(req.params.id);

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

// ROUTE 5 - Update the booking status with endpoint (PUT : '/booking/:id')
router.put('/:id', fetchUser, async (req, res) => {
    try {
        const existingData = await Booking.find({ _id: req.params.id, user_id: req.user.id });
        if (!existingData)
            return res.status(404).json({
                type: "error",
                message: "Data not found."
            });

        let newData = existingData[0].add_on || { meal: "YES" };
        if (req.body) {
            newData = {
                ...newData,
                ...req.body.data
            }
        }

        let data = await Booking.findByIdAndUpdate(req.params.id, {
            add_on: newData,
        }, { new: true });

        if (!data)
            return res.status(404).json({
                type: "error",
                message: "Booking did not updated."
            });

        res.status(200).json({
            type: "success",
            message: "Booking updated successfully."
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 6 - Delete the booking details with endpoint (DELETE : '/booking/:id')
router.delete('/:id', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        let data = await Booking.findByIdAndDelete(req.params.id);
        if (!data)
            return res.status(404).json({
                type: "error",
                message: "Booking not found."
            });

        return res.status(200).json({
            type: "success",
            message: "Booking deleted successfully."
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