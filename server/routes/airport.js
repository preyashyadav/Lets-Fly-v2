const express = require("express");
let xml2json = require('xml2json');
const axios = require("axios");
const router = express.Router();

const Airport = require("../model/airports");

const stateName = (stateCode) => {
    const data = {
        "AN": "Andaman and Nicobar Islands",
        "AP": "Andhra Pradesh",
        "AR": "Arunachal Pradesh",
        "AS": "Assam",
        "BR": "Bihar",
        "CH": "Chandigarh",
        "CT": "Chhattisgarh",
        "DN": "Dadra and Nagar Haveli",
        "DD": "Daman and Diu",
        "DL": "Delhi",
        "GA": "Goa",
        "GJ": "Gujarat",
        "HR": "Haryana",
        "HP": "Himachal Pradesh",
        "JK": "Jammu and Kashmir",
        "JH": "Jharkhand",
        "KA": "Karnataka",
        "KL": "Kerala",
        "LD": "Lakshadweep",
        "MP": "Madhya Pradesh",
        "MH": "Maharashtra",
        "MN": "Manipur",
        "ML": "Meghalaya",
        "MZ": "Mizoram",
        "NL": "Nagaland",
        "OR": "Odisha",
        "PY": "Puducherry",
        "PB": "Punjab",
        "RJ": "Rajasthan",
        "SK": "Sikkim",
        "TN": "Tamil Nadu",
        "TG": "Telangana",
        "TR": "Tripura",
        "UP": "Uttar Pradesh",
        "UT": "Uttarakhand",
        "WB": "West Bengal"
    };
    return data[stateCode];
}

const cityName = (cityCode) => {
    const data = {
        "AGX": "Agatti Island",
        "IXA": "Agartala",
        "AGR": "Agra",
        "AMD": "Ahmedabad",
        "AJL": "Aizawl",
        "ATQ": "Amritsar",
        "IXU": "Aurangabad",
        "IXB": "Bagdogra",
        "BEK": "Bareilly",
        "IXG": "Belagavi",
        "BLR": "Bengaluru",
        "BHO": "Bhopal",
        "BBI": "Bhubaneswar",

        "IXC": "Chandigarh",
        "MAA": "Chennai",
        "CJB": "Coimbatore",
        "DBR": "Darbhanga",
        "DED": "Dehradun",
        "DEL": "Delhi",
        "DGH": "Deoghar",
        "DIB": "Dibrugarh",
        "DMU": "Dimapur",
        "RDP": "Durgapur",
        "GAY": "Gaya",
        "GOI": "Goa",
        "GOP": "Gorakhpur",
        "GAU": "Guwahati",
        "GWL": "Gwalior",
        "HBX": "Hubli",
        "HYD": "Hyderabad",
        "IMF": "Imphal",
        "IDR": "Indore",
        "HGI": "Itanagar",
        "JLR": "Jabalpur",
        "JAI": "Jaipur",
        "IXJ": "Jammu",
        "JDH": "Jodhpur",
        "JRH": "Jorhat",
        "CDP": "Kadapa",
        "CNN": "Kannur",
        "KNU": "Kanpur",
        "COK": "Kochi",
        "KLH": "Kolhapur",
        "CCU": "Kolkata",
        "CCJ": "Kozhikode",
        "KJB": "Kurnool",
        "IXL": "Leh",
        "LKO": "Lucknow",
        "IXM": "Madurai",
        "IXE": "Mangaluru",
        "BOM": "Mumbai",
        "MYQ": "Mysuru",
        "NAG": "Nagpur",
        "GOX": "North Goa",
        "PGH": "Pantnagar",
        "PAT": "Patna",
        "IXZ": "Port-Blair",
        "IXD": "Prayagraj",
        "PNQ": "Pune",
        "RPR": "Raipur",
        "RJA": "Rajahmundry",
        "RAJ": "Rajkot",
        "IXR": "Ranchi",
        "SHL": "Shillong",
        "SAG": "Shirdi",
        "IXS": "Silchar",
        "SXR": "Srinagar",
        "STV": "Surat",
        "TRV": "Thiruvananthapuram",
        "TRZ": "Tiruchirappalli",
        "TIR": "Tirupati",
        "TCR": "Tuticorin",
        "UDR": "Udaipur",
        "BDQ": "Vadodara",
        "VNS": "Varanasi",
        "VGA": "Vijayawada",
        "VTZ": "Visakhapatnam"
    };
    return data[cityCode];
}

router.get("/", async (req, res) => {
    try {
        const Airports = await Airport.find();
        res.json({
            type: "success",
            message: "Airports fetched successfully",
            data: Airports
        });
    } catch (err) {
        res.json({ message: err });
    }
});

router.post("/add", async (req, res) => {
    try {
        // let airportData = await axios.request({
        //     method: 'GET',
        //     url: `${process.env.FLIGHT_API}/airports/countries/IN/`,
        //     headers: {
        //         "X-RapidAPI-Key": process.env.X_RapidAPI_Key,
        //         "X-RapidAPI-Host": process.env.X_RapidAPI_Host,
        //     },
        // });
        // let airport = xml2json.toJson(airportData.data, { object: true });

        // airport.Airports.Airport.forEach(async (airport) => {
        //     airport["CountryName"] = "India";
        //     airport["StateName"] = stateName(airport.State);
        //     airport["CityName"] = cityName(airport.IATACode) || "NA";

        //     await Airport.create({
        //         airport_code: airport.IATACode,
        //         airport_name: airport.Name,
        //         country_code: airport.Country,
        //         country_name: airport.CountryName,
        //         state_code: airport.State || "NA",
        //         state_name: airport.StateName || "NA",
        //         city: airport.CityName,
        //         longitude: airport.Longitude,
        //         latitude: airport.Latitude
        //     });
        // });

        // res.json({ airports: airport.Airports.Airport, len: airport.Airports.Airport.length });
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;
