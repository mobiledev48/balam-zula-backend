const { default: mongoose } = require('mongoose');
const WHATSAPP_NUMBER = require('../models/watsappNumber');
const OUR_CATEGORIES_ITEMS = require('../models/ourCategoriesItems');


exports.addWatsappNumber = async function (req, res, next) {

    try {

        const { watsappNumber } = req.body;

        if (!watsappNumber) {
            throw new Error("Please Enter watsapp Number it is required !")
        }

        const watsappNumberData = new WHATSAPP_NUMBER({
            watsappNumber
        });

        await watsappNumberData.save();

        res.status(201).json({
            message: 'Watsapp Number Added Successfully !',
            watsappNumberData
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }

}

exports.getWatsappNumber = async function (req, res, next) {
    try {

        const watsappNumberData = await WHATSAPP_NUMBER.findOne().sort({ _id: 1 });

        if (!watsappNumberData) {
            throw new Error("watsapp Number Not Found !");
        }

        res.status(200).json({
            message: `watsapp Number Fetched Successfully !`,
            watsappNumberData
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

exports.updateWatsappNumber = async function (req, res, next) {
    try {
        const { watsappNumber } = req.body;
        const { updateId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(updateId)) {
            throw new Error("Invalid Watsapp Number Id !");
        }

        const existingwatsappNumber = await WHATSAPP_NUMBER.findById(updateId);
        if (!existingwatsappNumber) {
            throw new Error("Watsapp Number Not Found !");
        }
        const updatedData = {
            watsappNumber: watsappNumber || existingwatsappNumber.watsappNumber
        };

        const updatedWatsappNumberData = await WHATSAPP_NUMBER.findByIdAndUpdate(updateId, updatedData, { new: true });

        await OUR_CATEGORIES_ITEMS.updateMany({}, { $set: { watsappNumber } });

        res.status(200).json({
            message: "Watsapp Number Updated Successfully !",
            watsappNumberData: updatedWatsappNumberData
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

exports.deleteWatsappNumber = async function (req, res, next) {
    try {

        const { deleteId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(deleteId)) {
            throw new Error("Invalid watsapp Number Id !")
        }

        const validatewatsappNumber = await WHATSAPP_NUMBER.findById(deleteId);

        if (!validatewatsappNumber) {
            throw new Error("Watsapp Number Not Found !")
        }

        await WHATSAPP_NUMBER.findByIdAndDelete(deleteId);

        res.status(200).json({
            message: `Watsapp Number Deleted Successfully !`,
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}