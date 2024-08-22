const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const connectDB = require('../server/config/connectDB');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;
connectDB();

app.get('/api', (req, res) => {
    res.send('Aviation Management System');
});

app.use("/api/auth", require("../server/routes/auth"));
app.use("/api/flight", require("../server/routes/flight"));
app.use("/api/contact", require("../server/routes/contact"));
app.use("/api/airport", require("../server/routes/airport"));
app.use("/api/payment", require("../server/routes/payment"));
app.use("/api/booking", require("../server/routes/booking"));

app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});

module.exports = app;