const { default: mongoose } = require('mongoose');
const CONTACT_US = require('../models/contactUs');


exports.addContactUs = async function (req, res, next) {

    try {

        const { address, mobileNumber, email, instagramLink, facebookLink } = req.body;

        if (!address || !mobileNumber || !email || !instagramLink || !facebookLink) {
            throw new Error("Please Enter All Contact Us Details it is required !")
        }

        const contactUsData = new CONTACT_US({
            address,
            mobileNumber,
            email,
            instagramLink,
            facebookLink
        });

        await contactUsData.save();

        res.status(201).json({
            message: 'Contact Us Details Added Successfully !',
            contactUsData
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }

}

exports.getContactUs = async function (req, res, next) {
    try {

        const contactUsData = await CONTACT_US.findOne().sort({ _id: 1 });

        if (!contactUsData) {
            throw new Error("Contact Us Details Not Found !");
        }

        res.status(200).json({
            message: `Contact Us Details Fetched Successfully !`,
            contactUsData
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

exports.updateContactUs = async function (req, res, next) {
    try {
        const { address, mobileNumber, email, instagramLink, facebookLink } = req.body;
        const { updateId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(updateId)) {
            throw new Error("Invalid Contact Us Details Id !");
        }

        const existingContactUs = await CONTACT_US.findById(updateId);
        if (!existingContactUs) {
            throw new Error("Contact Us Not Found !");
        }
        const updatedData = {
            address: address || existingContactUs.address,
            mobileNumber: mobileNumber || existingContactUs.mobileNumber,
            email: email || existingContactUs.email,
            instagramLink: instagramLink || existingContactUs.instagramLink,
            facebookLink: facebookLink || existingContactUs.facebookLink
        };

        const updatedContactUsData = await CONTACT_US.findByIdAndUpdate(updateId, updatedData, { new: true });

        res.status(200).json({
            message: "Contact Us Updated Successfully !",
            contactUsData: updatedContactUsData
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

exports.deleteContactUs = async function (req, res, next) {
    try {

        const { deleteId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(deleteId)) {
            throw new Error("Invalid Contact Us Details Id !")
        }

        const validateContactUsDetails = await CONTACT_US.findById(deleteId);

        if (!validateContactUsDetails) {
            throw new Error("Contact Us Details Not Found !")
        }

        await CONTACT_US.findByIdAndDelete(deleteId);

        res.status(200).json({
            message: `Contact Us Details Deleted Successfully !`,
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}