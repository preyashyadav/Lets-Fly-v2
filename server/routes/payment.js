const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Booking = require("../model/bookings");

router.post("/pre", async (req, res) => {
    try {
        if (req.body.price <= 0)
            return res.status(200).json({
                type: "error",
                message: "Price cannot be less than or equal to 0"
            })

        const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })

        const order = await instance.orders.create({
            amount: req.body.price * 100,
            currency: "INR"
        });

        let booking = new Booking({
            user_id: req.body.user_id,
            name: req.body.name,
            email: req.body.email,
            flight_id: req.body.flight_id,
            flight_number: req.body.flight_number,
            company: req.body.company,
            price: req.body.price,
            distance: req.body.distance,
            flight_time: req.body.flight_time,
            arrival_ap: req.body.arrival_ap,
            departure_ap: req.body.departure_ap,
            order_id: order.id,
        });
        await booking.save();

        return res.status(200).json({
            type: "success",
            message: "Order created successfully",
            data: order,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong"
        });
    }
});

router.post("/post", async (req, res) => {
    try {

        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        let body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest("hex");

        let authenticated = expectedSignature === razorpay_signature;

        await Booking.findOneAndUpdate({ order_id: razorpay_order_id },
            {
                status: (authenticated && "Success") || "Failed",
                transaction_id: razorpay_payment_id
            });

        return res.status(200).json({
            type: "success",
            message: "Payment successful",
            data: razorpay_order_id
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong"
        });
    }
});

module.exports = router;