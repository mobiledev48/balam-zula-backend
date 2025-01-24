const { default: mongoose } = require('mongoose');
const FOLLOW_US_MEDIA = require('../models/followUsMedia');
const cloudinary = require("../utils/Cloudinary");


exports.addFollowUsMedia = async function (req, res, next) {
    try {

        const { thumbnail_media_url } = req.body;

        if (!req.file) {
            throw new Error("Please Upload Follow Us Media Thumbnail Media !")
        }

        if (!thumbnail_media_url) {
            throw new Error("Please Enter Media Url it is required !")
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
                folder: "BALAM_ZULA/FOLLOW_US_MEDIA",
                resource_type: "image"
            });

            if (!imageResult || !imageResult.public_id || !imageResult.secure_url) {
                throw new Error("Follow Us Media Image Upload Failed ! Please Try Again ( Cloudinary ) !")
            }

        }

        const followUsMediaData = new FOLLOW_US_MEDIA({
            thumbnail_media: {
                public_id: imageResult.public_id,
                url: imageResult.secure_url
            },
            thumbnail_media_url
        });

        await followUsMediaData.save();

        res.status(201).json({
            message: 'Follow Us Thumbnail Media Added Successfully !',
            followUsMediaData
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }

}

exports.getFollowUsMedia = async function (req, res, next) {
    try {

        const followUsMediaData = await FOLLOW_US_MEDIA.find();
        const total = await FOLLOW_US_MEDIA.countDocuments();

        if (!followUsMediaData || followUsMediaData.length === 0) {
            throw new Error("Follow Us Thumbnail Media Data Not Found !");
        }

        res.status(200).json({
            message: `Follow Us Thumbnail Media Fetched Successfully ! Total ${total}`,
            followUsMediaData,
            total
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

exports.updateFollowUsMedia = async function (req, res, next) {
    try {
        const { thumbnail_media_url } = req.body;
        const { updateId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(updateId)) {
            throw new Error("Invalid Follow Us Thumbnail Media Id !");
        }

        const existingFollowUsMedia = await FOLLOW_US_MEDIA.findById(updateId);
        if (!existingFollowUsMedia) {
            throw new Error("Follow Us Thumbnail Media Not Found !");
        }

        let updatedThumbnailMedia = existingFollowUsMedia.thumbnail_media; // Default to the current image

        // Handle image upload if a new file is provided
        if (req.file) {
            const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];

            // Validate image format
            if (!allowedFormats.includes(req.file.mimetype)) {
                throw new Error("Invalid Image format! Only JPEG, PNG, JPG, WEBP, and SVG formats are allowed !");
            }

            // Delete the old image from Cloudinary, if exists
            if (existingFollowUsMedia.thumbnail_media.public_id) {
                try {
                    await cloudinary.uploader.destroy(existingFollowUsMedia.thumbnail_media.public_id, {
                        resource_type: "image"
                    });
                } catch (error) {
                    throw new Error("Follow Us Videos Thumbnail Media Delete Failed ! Please Try Again (Cloudinary) !");
                }
            }

            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                public_id: req.file.filename.split('.').slice(0, -1).join('.'),
                folder: "BALAM_ZULA/FOLLOW_US_MEDIA",
                resource_type: "image"
            });

            if (!uploadResult || !uploadResult.public_id || !uploadResult.secure_url) {
                throw new Error("Follow Us Media Thumbnail Media Update Failed ! Please Try Again (Cloudinary) !");
            }

            updatedThumbnailMedia = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url
            };
        }

        const updatedData = {
            thumbnail_media: updatedThumbnailMedia,
            thumbnail_media_url: thumbnail_media_url || existingFollowUsMedia.thumbnail_media_url
        };

        const updatedFollowUsMediaData = await FOLLOW_US_MEDIA.findByIdAndUpdate(updateId, updatedData, { new: true });

        res.status(200).json({
            message: "Follow Us Media Updated Successfully!",
            followUsMediaData: updatedFollowUsMediaData
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

exports.deleteFollowUsMedia = async function (req, res, next) {
    try {

        const { deleteId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(deleteId)) {
            throw new Error("Invalid Follow Us Media Id !")
        }

        const validateFollowUsMedia = await FOLLOW_US_MEDIA.findById(deleteId);

        if (!validateFollowUsMedia) {
            throw new Error("Follow Us Media Not Found !")
        }

        if (validateFollowUsMedia.thumbnail_media.public_id) {
            await cloudinary.uploader.destroy(validateFollowUsMedia.thumbnail_media.public_id, {
                resource_type: "image"
            });
        }

        await FOLLOW_US_MEDIA.findByIdAndDelete(deleteId);

        res.status(200).json({
            message: `Follow Us Media Deleted Successfully !`,
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}