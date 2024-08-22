const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const User = require('../model/users');
const mailSender = require("../config/mailer");
const fetchUser = require("../middleware/fetchUser");


// ROUTE 1 - Create a user with endpoint (POST : '/auth/newuser').
router.post("/newuser", [
    body('name', "Name should not be less than 3 characters.").isLength({ min: 3 }),
    body('email', "Enter a valid email address.").isEmail(),
    body('password', "Password should not be less than 8 characters.").isLength({ min: 8 })
], async (req, res) => {

    // Return bad requests for errors
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            type: "error",
            message: error.array()
        });
    }

    const { name, email, password, confirmPassword, verification_url } = req.body;
    try {
        let existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(409).json({
                type: "error",
                message: "Email already used."
            });

        if (password !== confirmPassword)
            return res.status(400).json({
                type: "error",
                message: "Password does not match."
            });

        // Send value in Database
        const user = await User.create({
            name,
            email,
            password: CryptoJS.AES.encrypt(password, process.env.CRYPTOJS_SECRET_KEY).toString()
        });

        // If user created successfully, then send a mail to user
        if (user.id) {
            let mail_data = `<h1>Verify Your Account</h1>
            <p>Welcome to <b>Let's Fly</b>.</p>
            <a href="${verification_url}?code=${user.verificationCode}&user=${user.id}">Click Here</a><br/>`;

            let mailsent = await mailSender(email, "Account Verification", mail_data);

            // If mail sent successfully, then send a response to user
            if (mailsent) {
                res.status(200).json({
                    type: "success",
                    message: "Email sent successfully, please verify your account.",
                });
            } else {
                res.status(500).json({
                    type: "error",
                    message: "Error while sending the verifiation mail."
                });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong.",
        });
    }
});

// ROUTE 2 - Verify the user account with endpoint (POST : '/auth/verify')
router.post('/verify', async (req, res) => {
    try {
        const { code, user_id } = req.body;
        if (!code || !user_id)
            return res.status(400).json({
                type: "error",
                message: "Invalid request."
            });

        if (!user_id.match(/^[0-9a-fA-F]{24}$/))
            return res.status(400).json({
                type: "error",
                message: "Invalid request."
            });

        const user = await User.findById(user_id);
        if (!user)
            return res.status(400).json({
                type: "error",
                message: "Could not verify user."
            });

        // Check if the user is already verified or not
        if (user.verified)
            return res.status(400).json({
                type: "error",
                message: "User already verified."
            });

        // Check if the verification code is correct or not
        if (user.verificationCode === code) {
            user.verified = true;
            await user.save();

            res.status(200).json({
                type: "success",
                message: "User verified successfully."
            });
        } else {
            res.status(400).json({
                type: "error",
                message: "Could not verify user."
            });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 3 - Authenticate a user with endpoint (POST : '/auth/login')
router.post('/login', [
    body('email', "Enter a valid Email").isEmail(),
    body('password', "Password should not be blank").exists()
], async (req, res) => {
    // Return bad requests for errors
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            type: "error",
            message: error.array()
        });
    }

    const { email, password } = req.body;
    try {
        // Check if the user exist or not
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                type: "error",
                message: "Invalid Credentials."
            });
        }

        // Check if the user is verified or not
        if (!user.verified) {
            return res.status(400).json({
                type: "error",
                message: "Please verify your email."
            });
        }

        // Check if the password is correct or not
        let pass = CryptoJS.AES.decrypt(user.password, process.env.CRYPTOJS_SECRET_KEY);
        let decryptedPassword = pass.toString(CryptoJS.enc.Utf8);
        if (password !== decryptedPassword) {
            return res.status(400).json({
                type: "error",
                message: "Invalid Credentials."
            });
        }

        // Create a token and send it to user
        const user_data = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
        const authToken = jwt.sign(user_data, process.env.JWT_SECRET_KEY);
        res.status(200).json({
            type: "success",
            message: "Loggedin successfully.",
            data: authToken
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 4 - Send the reset mail with endpoint (POST : '/auth/reset')
router.post('/reset', async (req, res) => {
    try {
        const { email, url } = req.body;

        if (!email)
            return res.status(400).json({
                type: "error",
                message: "Please fill all the details."
            });

        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).json({
                type: "error",
                message: "No user found with this email."
            });

        user.passwordResetCode = uuidv4();
        await user.save();

        let mail_data = `<h1>Reset Your Password</h1>
        <p>We received a request to reset your password. Don't worry, we are here to help you.</p>
        <a href="${url}?code=${user.passwordResetCode}&user=${user._id}">Click Here</a>
        <br/><br/>
        <strong>Didn't request a password reset?</strong>
        <p>You can safely ignore this message.</p>`;

        let mailsent = await mailSender(email, "Password Reset", mail_data);
        if (mailsent) {
            res.status(200).json({
                type: "success",
                message: "Email sent successfully, please check your inbox.",
            });
        } else {
            res.status(500).json({
                type: "error",
                message: "Error while sending the verifiation mail."
            });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 5 - Reset the password with endpoint (PUT : '/auth/reset')
router.put('/reset', async (req, res) => {
    try {
        const { password, confirmPassword, code, user_id } = req.body;

        if (!password || !confirmPassword || !code || !user_id)
            return res.status(400).json({
                type: "error",
                message: "Please fill all the details."
            });

        if (!user_id.match(/^[0-9a-fA-F]{24}$/))
            return res.status(400).json({
                type: "error",
                message: "Invalid request."
            });

        if ((password && password.length < 8) || (confirmPassword && confirmPassword.length < 8))
            return res.status(400).json({
                type: "error",
                message: "Password should be more than 8 characters."
            });

        if (password !== confirmPassword)
            return res.status(400).json({
                type: "error",
                message: "Password does not match."
            });

        const user = await User.findById(user_id);

        if (!user)
            return res.status(400).json({
                type: "error",
                message: "Could not reset password."
            });

        if (user.passwordResetCode !== code)
            return res.status(400).json({
                type: "error",
                message: "Could not reset password."
            });

        user.password = CryptoJS.AES.encrypt(password, process.env.CRYPTOJS_SECRET_KEY).toString();
        user.passwordResetCode = null;
        await user.save();

        res.status(200).json({
            type: "success",
            message: "Password reset successfully."
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 6 - Get loggedin user details with endpoint (POST : '/auth/getuser')
router.post('/getuser', fetchUser, async (req, res) => {
    try {
        // Get user details
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json({
            type: "success",
            message: "User details fetched successfully.",
            data: user
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 7 - Get all user details with endpoint (POST : '/auth/users')
router.post('/users', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        const users = await User.find();
        if (users.length === 0)
            return res.status(200).json({
                type: "success",
                message: "No users found.",
                data: []
            });

        res.status(200).json({
            type: "success",
            message: "User details fetched successfully.",
            data: users
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 8 - Get the user details from ID with endpoint (POST : '/auth/user/:id')
router.post('/user/:id', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        const user = await User.findById(req.params.id);
        if (!user)
            return res.status(404).json({
                type: "error",
                message: "User not found."
            });

        res.status(200).json({
            type: "success",
            message: "User details fetched successfully.",
            data: user
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 9 - Update the user details with endpoint (PUT : '/auth/update/:id')
router.put('/update/:id', fetchUser, async (req, res) => {
    try {
        const { name, email, password, role, verified } = req.body;

        if (name && name.length < 3)
            return res.status(400).json({
                type: "error",
                message: "Name should be more than 3 characters."
            });

        if (password && password.length < 8)
            return res.status(400).json({
                type: "error",
                message: "Password should be more than 8 characters."
            });

        const hashPass = CryptoJS.AES.encrypt(password, process.env.CRYPTOJS_SECRET_KEY).toString();

        const existingUser = await User.findById(req.params.id);
        if (!existingUser)
            return res.status(404).json({
                type: "error",
                message: "User not found."
            });

        let user;
        if (req.user.role === "admin") {
            if (!name || !email || !password || !role || !verified)
                return res.status(400).json({
                    type: "error",
                    message: "Please enter a valid data."
                });

            user = await User.findByIdAndUpdate(req.params.id, {
                name: name ? name : existingUser.name,
                email: email ? email : existingUser.email,
                password: password ? hashPass : existingUser.password,
                role: role ? role : existingUser.role,
                verified: verified ? verified : existingUser.verified
            }, { new: true });
        } else {
            if (req.user.id !== req.params.id)
                return res.status(401).json({
                    type: "error",
                    message: "You are not authorized to perform this action."
                });

            if (email || role || verified)
                return res.status(401).json({
                    type: "error",
                    message: "You are not authorized to perform this action."
                });

            user = await User.findByIdAndUpdate(req.params.id, {
                name: name ? name : existingUser.name,
                password: password ? hashPass : existingUser.password,
            }, { new: true });
        }

        if (!user)
            return res.status(404).json({
                type: "error",
                message: "User not found."
            });

        res.status(200).json({
            type: "success",
            message: "User details updated successfully.",
            data: user
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 10 - Delete the user details with endpoint (DELETE : '/auth/delete/:id')
router.delete('/delete/:id', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        let user = await User.findByIdAndDelete(req.params.id);
        if (!user)
            return res.status(404).json({
                type: "error",
                message: "User not found."
            });

        res.status(200).json({
            type: "success",
            message: "User details deleted successfully."
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