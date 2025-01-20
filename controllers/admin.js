require('dotenv').config();
const ADMIN = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.adminRegistration = async (req, res, next) => {

    try {

        const { email, password, confirm_password } = req.body;

        if (!email || !password || !confirm_password) {
            throw new Error("Please enter all the fields it is required !")
        }

        if (password !== confirm_password) {
            throw new Error("Password and confirm password should be same !")
        }

        const existingAdmin = await ADMIN.findOne({ email, userType: 'admin' });

        if (existingAdmin) {
            throw new Error("Admin with this creadentials already exists !")
        }

        const admin = await ADMIN.create({
            email,
            password,
            userType: 'admin'
        });

        res.status(201).json({
            message: "Admin Registration successfully !",
            admin
        })
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }

}

exports.adminLogin = async (req, res, next) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error("Please enter all the fields it is required !")
        }

        const validateEmail = await ADMIN.findOne({ email: email, userType: 'admin' });

        if (!validateEmail) {
            throw new Error("Invalid credentials, Please try again later !")
        }

        const validatePassword = await bcrypt.compare(password, validateEmail.password)

        if (!validatePassword) {
            throw new Error("Invalid credentials, Please try again later !")
        }

        const token = await jwt.sign({ _id: validateEmail._id }, process.env.JWT_SECRET_KEY);

        res.status(200).json({
            message: "Admin log in successfully !",
            token
        })
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }

}

exports.GetallAdmin = async (req, res, next) => {
    try {

        const admins = await ADMIN.find({ userType: "admin" });

        if (admins.length <= 0) {
            throw new Error("No admin Found !")
        }

        res.status(200).json({
            message: "All Admins Fetched Sucessfully ! Total " + admins.length,
            admins,
            totalAdmins: admins.length
        });

    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};