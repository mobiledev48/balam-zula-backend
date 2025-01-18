const { default: mongoose } = require('mongoose');
const HOME_CAROUSAL = require('../models/homeCarousal');
const cloudinary = require("../utils/Cloudinary");


exports.addHomeCarousal = async function (req, res, next) {

    try {

        const { title, content } = req.body;

        if (!req.file) {
            throw new Error("Please Upload Carousal Image !")
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
                folder: "BALAM_ZULA/HOME_CAROUSAL_IMAGES",
                resource_type: "image"
            });

            if (!imageResult || !imageResult.public_id || !imageResult.secure_url) {
                throw new Error("Carousal Image Upload Failed ! Please Try Again ( Cloudinary ) !")
            }

        }

        const homeCarousal = new HOME_CAROUSAL({
            image: {
                public_id: imageResult.public_id,
                url: imageResult.secure_url
            },
            title,
            content
        });

        await homeCarousal.save();

        res.status(201).json({
            message: 'Home Carousal Added Successfully !',
            homeCarousal
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }

}

exports.getHomeCarousal = async function (req, res, next) {
    try {

        const homeCarousal = await HOME_CAROUSAL.find();
        const total = await HOME_CAROUSAL.countDocuments();

        if (!homeCarousal || homeCarousal.length === 0) {
            throw new Error("Home Carousals Not Found !");
        }

        res.status(200).json({
            message: `Home Carousals Fetched Successfully ! Total ${total}`,
            homeCarousal,
            total
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

exports.updateHomeCarousal = async function (req, res, next) {
    try {
        const { title, content } = req.body;
        const { updateId } = req.params;

        // Validate the provided ID
        if (!mongoose.Types.ObjectId.isValid(updateId)) {
            throw new Error("Invalid Home Carousal Id !");
        }

        // Fetch the existing carousal
        const existingCarousal = await HOME_CAROUSAL.findById(updateId);
        if (!existingCarousal) {
            throw new Error("Home Carousal Not Found !");
        }

        let updatedImage = existingCarousal.image; // Default to the current image

        // Handle image upload if a new file is provided
        if (req.file) {
            const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];

            // Validate image format
            if (!allowedFormats.includes(req.file.mimetype)) {
                throw new Error("Invalid Image format! Only JPEG, PNG, JPG, WEBP, and SVG formats are allowed !");
            }

            // Delete the old image from Cloudinary, if exists
            if (existingCarousal.image.public_id) {
                try {
                    await cloudinary.uploader.destroy(existingCarousal.image.public_id, {
                        resource_type: "image"
                    });
                } catch (error) {
                    throw new Error("Carousal Image Delete Failed ! Please Try Again (Cloudinary) !");
                }
            }

            // Upload the new image
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                public_id: req.file.filename.split('.').slice(0, -1).join('.'),
                folder: "BALAM_ZULA/HOME_CAROUSAL_IMAGES",
                resource_type: "image"
            });

            if (!uploadResult || !uploadResult.public_id || !uploadResult.secure_url) {
                throw new Error("Carousal Image Update Failed ! Please Try Again (Cloudinary) !");
            }

            updatedImage = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url
            };
        }

        // Prepare updated fields
        const updatedData = {
            image: updatedImage,
            title: title || existingCarousal.title,
            content: content || existingCarousal.content
        };

        // Update the carousal in the database
        const updatedCarousal = await HOME_CAROUSAL.findByIdAndUpdate(updateId, updatedData, { new: true });

        res.status(200).json({
            message: "Home Carousal Updated Successfully!",
            homeCarousal: updatedCarousal
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

exports.deleteHomeCarousal = async function (req, res, next) {
    try {

        const { deleteId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(deleteId)) {
            throw new Error("Invalid Home Carousal Id !")
        }

        const validateHomeCarousal = await HOME_CAROUSAL.findById(deleteId);

        if (!validateHomeCarousal) {
            throw new Error("Home Carousal Not Found !")
        }

        if (validateHomeCarousal.image.public_id) {
            await cloudinary.uploader.destroy(validateHomeCarousal.image.public_id, {
                resource_type: "image"
            });
        }

        await HOME_CAROUSAL.findByIdAndDelete(deleteId);

        res.status(200).json({
            message: `Home Carousal Deleted Successfully !`,
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}