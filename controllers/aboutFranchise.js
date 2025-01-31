const { default: mongoose } = require('mongoose');
const ABOUT_FRENCHISE = require('../models/aboutFranchise');
const cloudinary = require("../utils/Cloudinary");


exports.addAboutFranchise = async function (req, res, next) {

    try {

        const { title, descriptionOne, descriptionTwo, tags } = req.body;

        if (!req.file) {
            throw new Error("Please Upload About Franchise Image !")
        }

        if (!title || !descriptionOne || !descriptionTwo || !tags) {
            throw new Error("Please Enter All About Franchise Details it is required !")
        }

        const parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

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
                folder: "BALAM_ZULA/ABOUT_FRANCHISE",
                resource_type: "image"
            });

            if (!imageResult || !imageResult.public_id || !imageResult.secure_url) {
                throw new Error("About Franchise Image Upload Failed ! Please Try Again ( Cloudinary ) !")
            }

        }

        const aboutFranchiseData = new ABOUT_FRENCHISE({
            title,
            descriptionOne,
            descriptionTwo,
            tags: parsedTags,
            image: {
                public_id: imageResult.public_id,
                url: imageResult.secure_url
            }
        });

        await aboutFranchiseData.save();

        res.status(201).json({
            message: 'About Franchise Details Added Successfully !',
            aboutFranchiseData
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }

}

exports.getAboutFranchise = async function (req, res, next) {
    try {

        const aboutFranchiseData = await ABOUT_FRENCHISE.findOne().sort({ _id: 1 });

        if (!aboutFranchiseData) {
            throw new Error("About Franchise Details Not Found !");
        }

        res.status(200).json({
            message: `About Franchise Details Fetched Successfully !`,
            aboutFranchiseData
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

exports.updateAboutFranchise = async function (req, res, next) {
    try {
        const { title, descriptionOne, descriptionTwo, tags } = req.body;
        const { updateId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(updateId)) {
            throw new Error("Invalid About Franchise Details Id !");
        }

        const existingAboutFranchise = await ABOUT_FRENCHISE.findById(updateId);
        if (!existingAboutFranchise) {
            throw new Error("About Franchise Not Found !");
        }

        let updatedImage = existingAboutFranchise.image; // Default to the current image
        let parsedTags = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : existingAboutFranchise.tags;

        // Handle image upload if a new file is provided
        if (req.file) {
            const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];

            // Validate image format
            if (!allowedFormats.includes(req.file.mimetype)) {
                throw new Error("Invalid Image format! Only JPEG, PNG, JPG, WEBP, and SVG formats are allowed !");
            }

            // Delete the old image from Cloudinary, if exists
            if (existingAboutFranchise.image.public_id) {
                try {
                    await cloudinary.uploader.destroy(existingAboutFranchise.image.public_id, {
                        resource_type: "image"
                    });
                } catch (error) {
                    throw new Error("About Franchise Image Delete Failed ! Please Try Again (Cloudinary) !");
                }
            }

            // Upload the new image
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                public_id: req.file.filename.split('.').slice(0, -1).join('.'),
                folder: "BALAM_ZULA/ABOUT_FRANCHISE",
                resource_type: "image"
            });

            if (!uploadResult || !uploadResult.public_id || !uploadResult.secure_url) {
                throw new Error("About Franchise Image Update Failed ! Please Try Again (Cloudinary) !");
            }

            updatedImage = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url
            };
        }

        const updatedData = {
            title: title || existingAboutFranchise.title,
            descriptionOne: descriptionOne || existingAboutFranchise.descriptionOne,
            descriptionTwo: descriptionTwo || existingAboutFranchise.descriptionTwo,
            tags: parsedTags,
            image: updatedImage
        };

        const updatedAboutFranchiseData = await ABOUT_FRENCHISE.findByIdAndUpdate(updateId, updatedData, { new: true });

        res.status(200).json({
            message: "About Franchise Updated Successfully !",
            aboutFranchiseData: updatedAboutFranchiseData
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

exports.deleteAboutFranchise = async function (req, res, next) {
    try {

        const { deleteId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(deleteId)) {
            throw new Error("Invalid About Franchise Details Id !")
        }

        const validateAboutFranchiseDetails = await ABOUT_FRENCHISE.findById(deleteId);

        if (!validateAboutFranchiseDetails) {
            throw new Error("About Franchise Details Not Found !")
        }

        if (validateAboutFranchiseDetails.image.public_id) {
            await cloudinary.uploader.destroy(validateAboutFranchiseDetails.image.public_id, {
                resource_type: "image"
            });
        }

        await ABOUT_FRENCHISE.findByIdAndDelete(deleteId);

        res.status(200).json({
            message: `About Franchise Details Deleted Successfully !`,
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}