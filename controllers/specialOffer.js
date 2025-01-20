const { default: mongoose } = require('mongoose');
const SPECIAL_OFFER = require('../models/specialOffer');
const cloudinary = require("../utils/Cloudinary");


exports.addSpecialOffer = async function (req, res, next) {

    try {

        const { title, content } = req.body;

        if (!req.file) {
            throw new Error("Please Upload Special Offer Background Image !")
        }

        if (!title || !content) {
            throw new Error("Please enter all the fields it is required !")
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
                folder: "BALAM_ZULA/SPECIAL_OFFER_IMAGE",
                resource_type: "image"
            });

            if (!imageResult || !imageResult.public_id || !imageResult.secure_url) {
                throw new Error("Special Offer Background Image Upload Failed ! Please Try Again ( Cloudinary ) !")
            }

        }

        const specialOffer = new SPECIAL_OFFER({
            image: {
                public_id: imageResult.public_id,
                url: imageResult.secure_url
            },
            title,
            content
        });

        await specialOffer.save();

        res.status(201).json({
            message: 'Special Offer Details Added Successfully !',
            specialOffer
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }

}

exports.getSpecialOffer = async function (req, res, next) {
    try {

        const specialOffer = await SPECIAL_OFFER.findOne().sort({ _id: -1 });

        if (!specialOffer) {
            throw new Error("Special Offer Details Not Found !");
        }

        res.status(200).json({
            message: `Special Offer Details Fetched Successfully !`,
            specialOffer
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

exports.updateSpecialOffer = async function (req, res, next) {
    try {
        const { title, content } = req.body;
        const { updateId } = req.params;

        // Validate the provided ID
        if (!mongoose.Types.ObjectId.isValid(updateId)) {
            throw new Error("Invalid Special Offer Details Id !");
        }

        // Fetch the existing carousal
        const existingSpecialOffer = await SPECIAL_OFFER.findById(updateId);
        if (!existingSpecialOffer) {
            throw new Error("Special Offer Details Not Found !");
        }

        let updatedImage = existingSpecialOffer.image; // Default to the current image

        // Handle image upload if a new file is provided
        if (req.file) {
            const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];

            // Validate image format
            if (!allowedFormats.includes(req.file.mimetype)) {
                throw new Error("Invalid Image format! Only JPEG, PNG, JPG, WEBP, and SVG formats are allowed !");
            }

            // Delete the old image from Cloudinary, if exists
            if (existingSpecialOffer.image.public_id) {
                try {
                    await cloudinary.uploader.destroy(existingSpecialOffer.image.public_id, {
                        resource_type: "image"
                    });
                } catch (error) {
                    throw new Error("Special Offer Background Delete Failed ! Please Try Again (Cloudinary) !");
                }
            }

            // Upload the new image
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                public_id: req.file.filename.split('.').slice(0, -1).join('.'),
                folder: "BALAM_ZULA/SPECIAL_OFFER_IMAGE",
                resource_type: "image"
            });

            if (!uploadResult || !uploadResult.public_id || !uploadResult.secure_url) {
                throw new Error("Special Offer Background Update Failed ! Please Try Again (Cloudinary) !");
            }

            updatedImage = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url
            };
        }

        // Prepare updated fields
        const updatedData = {
            image: updatedImage,
            title: title || existingSpecialOffer.title,
            content: content || existingSpecialOffer.content
        };

        // Update the carousal in the database
        const updatedSpecialOffer = await SPECIAL_OFFER.findByIdAndUpdate(updateId, updatedData, { new: true });

        res.status(200).json({
            message: "Special Offer Details Updated Successfully!",
            specialOffer: updatedSpecialOffer
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

exports.deleteSpecialOffer = async function (req, res, next) {
    try {

        const { deleteId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(deleteId)) {
            throw new Error("Invalid Special Offer Details Id !")
        }

        const validateSpecialOffer = await SPECIAL_OFFER.findById(deleteId);

        if (!validateSpecialOffer) {
            throw new Error("Special Offer Details Not Found !")
        }

        if (validateSpecialOffer.image.public_id) {
            await cloudinary.uploader.destroy(validateSpecialOffer.image.public_id, {
                resource_type: "image"
            });
        }

        await SPECIAL_OFFER.findByIdAndDelete(deleteId);

        res.status(200).json({
            message: `Special Offer Details Deleted Successfully !`,
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}