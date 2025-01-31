const { default: mongoose } = require('mongoose');
const CONTACT_US = require('../models/contactUs');
const cloudinary = require("../utils/Cloudinary");


exports.addContactUs = async function (req, res, next) {

    try {

        const { address, mobileNumber, email, instagramLink, facebookLink, title, description, watsappNumber } = req.body;

        if (!req.file) {
            throw new Error("Please Upload Contact Us Image !")
        }

        if (!address || !mobileNumber || !email || !instagramLink || !facebookLink || !title || !description || !watsappNumber) {
            throw new Error("Please Enter All Contact Us Details it is required !")
        }

        let imageResult;
        if (req.file) {

            // Validate image format
            const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];
            const fileMimeType = req.file.mimetype;

            if (!allowedFormats.includes(fileMimeType)) {
                throw new Error("Invalid Image format ! Only JPEG, PNG, JPG, WEBP, and SVG formats are allowed !");
            }

            imageResult = await cloudinary.uploader.upload(req.file.path, {
                public_id: req.file.filename.split('.').slice(0, -1).join('.'),
                folder: "BALAM_ZULA/CONTACT_US_IMAGE",
                resource_type: "image"
            });

            if (!imageResult || !imageResult.public_id || !imageResult.secure_url) {
                throw new Error("Contact Us Image Upload Failed ! Please Try Again ( Cloudinary ) !")
            }

        }

        const contactUsData = new CONTACT_US({
            address,
            mobileNumber,
            email,
            instagramLink,
            facebookLink,
            image: {
                public_id: imageResult.public_id,
                url: imageResult.secure_url
            },
            title,
            description,
            watsappNumber
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
        const { address, mobileNumber, email, instagramLink, facebookLink, title, description, watsappNumber } = req.body;
        const { updateId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(updateId)) {
            throw new Error("Invalid Contact Us Details Id !");
        }

        const existingContactUs = await CONTACT_US.findById(updateId);
        if (!existingContactUs) {
            throw new Error("Contact Us Not Found !");
        }

        let updatedImage = existingContactUs.image; // Default to the current image

        // Handle image upload if a new file is provided
        if (req.file) {
            const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];

            // Validate image format
            if (!allowedFormats.includes(req.file.mimetype)) {
                throw new Error("Invalid Image format! Only JPEG, PNG, JPG, WEBP, and SVG formats are allowed !");
            }

            // Delete the old image from Cloudinary, if exists
            if (existingContactUs.image.public_id) {
                try {
                    await cloudinary.uploader.destroy(existingContactUs.image.public_id, {
                        resource_type: "image"
                    });
                } catch (error) {
                    throw new Error("Contact Us Image Delete Failed ! Please Try Again (Cloudinary) !");
                }
            }

            // Upload the new image
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                public_id: req.file.filename.split('.').slice(0, -1).join('.'),
                folder: "BALAM_ZULA/CONTACT_US_IMAGE",
                resource_type: "image"
            });

            if (!uploadResult || !uploadResult.public_id || !uploadResult.secure_url) {
                throw new Error("Contact Us Image Update Failed ! Please Try Again (Cloudinary) !");
            }

            updatedImage = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url
            };
        }

        const updatedData = {
            image: updatedImage,
            address: address || existingContactUs.address,
            mobileNumber: mobileNumber || existingContactUs.mobileNumber,
            email: email || existingContactUs.email,
            instagramLink: instagramLink || existingContactUs.instagramLink,
            facebookLink: facebookLink || existingContactUs.facebookLink,
            title: title || existingContactUs.title,
            description: description || existingContactUs.description,
            watsappNumber: watsappNumber || existingContactUs.watsappNumber
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

        if (validateContactUsDetails.image.public_id) {
            await cloudinary.uploader.destroy(validateContactUsDetails.image.public_id, {
                resource_type: "image"
            });
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