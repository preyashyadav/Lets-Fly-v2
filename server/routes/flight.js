const express = require("express");
let xml2json = require('xml2json');
const axios = require("axios");
const router = express.Router();

const Flight = require("../model/flights");

router.post("/", async (req, res) => {
    const { from, to, date } = req.body;

    try {
        if (!from || !to || !date)
            return res.status(400).json({
                type: "error",
                message: "Please enter all the fields"
            });

        axios.request({
            method: "GET",
            url: `${process.env.FLIGHT_API}/TimeTable/${from}/${to}/${date}`,
            headers: {
                "X-RapidAPI-Key": process.env.X_RapidAPI_Key,
                "X-RapidAPI-Host": process.env.X_RapidAPI_Host,
            },
        }).then((response) => {
            let data = xml2json.toJson(response.data, { object: true });
            res.status(200).json({
                type: "success",
                message: "Flight details fetched successfully",
                data: {
                    main: data.OTA_AirDetailsRS.FLSResponseFields,
                    flight: data.OTA_AirDetailsRS.FlightDetails
                }
            });
        }).catch((error) => {
            console.error(error);
        });
    } catch (err) {
        res.json({ message: err });
    }
});

router.post("/pushFlight", async (req, res) => {
    try {
        await Flight.create({
            flight_data: req.body
        });

        return res.status(200).json({
            type: "success",
            message: "Flight Pushed successfully.",
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong.",
        });
    }
});

router.get("/getFlight", async (req, res) => {
    try {
        const data = await Flight.find();
        if (data.length === 0)
            return res.status(200).json({
                type: "success",
                message: "Flight Not found.",
                data: []
            });

        return res.status(200).json({
            type: "success",
            message: "Flight fetched successfully.",
            data: data
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong.",
        });
    }
})

module.exports = router;