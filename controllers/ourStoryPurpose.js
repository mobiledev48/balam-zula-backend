const { default: mongoose } = require('mongoose');
const OUR_STORY_PURPOSE = require('../models/ourStoryPurpose');
const cloudinary = require("../utils/Cloudinary");


exports.addOurStoryPurpose = async function (req, res, next) {

    try {

        const { title, content } = req.body;

        if (!req.file) {
            throw new Error("Please Upload Story-Purpose Image !")
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
                folder: "BALAM_ZULA/OUR_STORY_PURPOSE_IMAGE",
                resource_type: "image"
            });

            if (!imageResult || !imageResult.public_id || !imageResult.secure_url) {
                throw new Error("Story-Purpose Image Upload Failed ! Please Try Again ( Cloudinary ) !")
            }

        }

        const ourStoryPurpose = new OUR_STORY_PURPOSE({
            image: {
                public_id: imageResult.public_id,
                url: imageResult.secure_url
            },
            title,
            content
        });

        await ourStoryPurpose.save();

        res.status(201).json({
            message: 'Our Story-Purpose Details Added Successfully !',
            ourStoryPurpose
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }

}

exports.getOurStoryPurpose = async function (req, res, next) {
    try {

        const ourStoryPurpose = await OUR_STORY_PURPOSE.find();
        const total = await OUR_STORY_PURPOSE.countDocuments();

        if (!ourStoryPurpose || ourStoryPurpose.length === 0) {
            throw new Error("Our Story-Purpose Details Not Found !");
        }

        res.status(200).json({
            message: `Our Story-Purpose Details Fetched Successfully ! Total ${total}`,
            ourStoryPurpose,
            total
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

exports.updateOurStoryPurpose = async function (req, res, next) {
    try {
        const { title, content } = req.body;
        const { updateId } = req.params;

        // Validate the provided ID
        if (!mongoose.Types.ObjectId.isValid(updateId)) {
            throw new Error("Invalid Our Story-Purpose Details Id !");
        }

        // Fetch the existing carousal
        const existingOurStoryPurpose = await OUR_STORY_PURPOSE.findById(updateId);
        if (!existingOurStoryPurpose) {
            throw new Error("Our Story-Purpose Details Not Found !");
        }

        let updatedImage = existingOurStoryPurpose.image; // Default to the current image

        // Handle image upload if a new file is provided
        if (req.file) {
            const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];

            // Validate image format
            if (!allowedFormats.includes(req.file.mimetype)) {
                throw new Error("Invalid Image format! Only JPEG, PNG, JPG, WEBP, and SVG formats are allowed !");
            }

            // Delete the old image from Cloudinary, if exists
            if (existingOurStoryPurpose.image.public_id) {
                try {
                    await cloudinary.uploader.destroy(existingOurStoryPurpose.image.public_id, {
                        resource_type: "image"
                    });
                } catch (error) {
                    throw new Error("Our Story-Purpose Image Delete Failed ! Please Try Again (Cloudinary) !");
                }
            }

            // Upload the new image
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                public_id: req.file.filename.split('.').slice(0, -1).join('.'),
                folder: "BALAM_ZULA/OUR_STORY_PURPOSE_IMAGE",
                resource_type: "image"
            });

            if (!uploadResult || !uploadResult.public_id || !uploadResult.secure_url) {
                throw new Error("Our Story-Purpose Image Update Failed ! Please Try Again (Cloudinary) !");
            }

            updatedImage = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url
            };
        }

        // Prepare updated fields
        const updatedData = {
            image: updatedImage,
            title: title || existingOurStoryPurpose.title,
            content: content || existingOurStoryPurpose.content
        };

        // Update the carousal in the database
        const updatedOurStoryPurpose = await OUR_STORY_PURPOSE.findByIdAndUpdate(updateId, updatedData, { new: true });

        res.status(200).json({
            message: "Home Carousal Updated Successfully!",
            ourStoryPurpose: updatedOurStoryPurpose
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

exports.deleteOurStoryPurpose = async function (req, res, next) {
    try {

        const { deleteId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(deleteId)) {
            throw new Error("Invalid Our Story-Purpose Details Id !")
        }

        const validateOurStoryPurpose = await OUR_STORY_PURPOSE.findById(deleteId);

        if (!validateOurStoryPurpose) {
            throw new Error("Our Story-Purpose Details Not Found !")
        }

        if (validateOurStoryPurpose.image.public_id) {
            await cloudinary.uploader.destroy(validateOurStoryPurpose.image.public_id, {
                resource_type: "image"
            });
        }

        await OUR_STORY_PURPOSE.findByIdAndDelete(deleteId);

        res.status(200).json({
            message: `Our Story-Purpose Details Deleted Successfully !`,
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}