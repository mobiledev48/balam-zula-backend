const { default: mongoose } = require('mongoose');
const HOME_SLOGAN = require('../models/homeSlogan');

exports.addHomeSlogan = async function (req, res, next) {

    try {

        const { slogan, description } = req.body;

        if (!slogan || !description) {
            throw new Error("Please Enter All Home Slogan Details it is required !")
        }

        const homeSloganData = new HOME_SLOGAN({
            slogan,
            description
        });

        await homeSloganData.save();

        res.status(201).json({
            message: 'Home Slogan Details Added Successfully !',
            homeSloganData
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }

}

exports.getHomeSlogan = async function (req, res, next) {
    try {

        const homeSloganData = await HOME_SLOGAN.findOne().sort({ _id: 1 });

        if (!homeSloganData) {
            throw new Error("Home Slogan Details Not Found !");
        }

        res.status(200).json({
            message: `Home Slogan Details Fetched Successfully !`,
            homeSloganData
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

exports.updateHomeSlogan = async function (req, res, next) {
    try {
        const { slogan, description } = req.body;
        const { updateId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(updateId)) {
            throw new Error("Invalid Home Slogan Details Id !");
        }

        const existingHomeSlogan = await HOME_SLOGAN.findById(updateId);
        if (!existingHomeSlogan) {
            throw new Error("Home Slogan Not Found !");
        }
        const updatedData = {
            slogan: slogan || existingHomeSlogan.slogan,
            description: description || existingHomeSlogan.description
        };

        const updatedHomeSloganData = await HOME_SLOGAN.findByIdAndUpdate(updateId, updatedData, { new: true });

        res.status(200).json({
            message: "Home Slogan Updated Successfully !",
            homeSloganData: updatedHomeSloganData
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

exports.deleteHomeSlogan = async function (req, res, next) {
    try {

        const { deleteId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(deleteId)) {
            throw new Error("Invalid Home Slogan Details Id !")
        }

        const validateHomeSloganDetails = await HOME_SLOGAN.findById(deleteId);

        if (!validateHomeSloganDetails) {
            throw new Error("Home Slogan Details Not Found !")
        }

        await HOME_SLOGAN.findByIdAndDelete(deleteId);

        res.status(200).json({
            message: `Home Slogan Details Deleted Successfully !`,
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}