const { default: mongoose } = require('mongoose');
const CUSTOMER_REVIEW_VIDEO = require('../models/customerReviewVideo');
const cloudinary = require("../utils/Cloudinary");

exports.addCustomerReviewVideo = async function (req, res, next) {
    try {
        let videoMimeType;

        if (req.files) {

            if (req.files.video) {

                if (req.files.video.length > 1) {
                    throw new Error("Please upload only one video at a time ! ");
                }

                videoMimeType = req.files.video[0].mimetype;
                const allowedVideoFormats = ['video/mp4', 'video/webm'];

                if (!allowedVideoFormats.includes(videoMimeType)) {
                    throw new Error("Invalid Video format! Only MP4, WEBM formats are allowed!");
                }

            } else {
                throw new Error("Please Upload Customer Review Video !")
            }

        } else {
            throw new Error("Please Upload Customer Review Video !");
        }


        let videoResult;

        if (req.files && req.files.video) {
            videoResult = await cloudinary.uploader.upload(req.files.video[0].path, {
                public_id: req.files.video[0].filename.split('.').slice(0, -1).join('.'),
                folder: "BALAM_ZULA/CUSTOMER_REVIEW_VIDEO",
                resource_type: "video"
            });
        }

        const newCustomerReviewVideo = new CUSTOMER_REVIEW_VIDEO({
            video: {
                public_id: videoResult.public_id,
                url: videoResult.secure_url
            }
        });

        await newCustomerReviewVideo.save();

        res.status(201).json({
            message: 'Customer Review Video data added successfully !',
            customerReviewVideo: newCustomerReviewVideo
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

exports.getCustomerReviewVideo = async function (req, res, next) {
    try {

        const customerReviewVideo = await CUSTOMER_REVIEW_VIDEO.find();
        const total = await CUSTOMER_REVIEW_VIDEO.countDocuments();

        if (!customerReviewVideo | customerReviewVideo.length === 0) {
            throw new Error("Customer Review Video data not found !");
        }

        res.status(200).json({
            message: `Customer Review Video data fetched successfully ! Total ${total}`,
            customerReviewVideo,
            total
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

exports.updateCustomerReviewVideo = async function (req, res, next) {
    try {

        const { updateId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(updateId)) {
            throw new Error("Invalid Customer Review Video Id !");
        }

        const customerReviewVideo = await CUSTOMER_REVIEW_VIDEO.findById(updateId);

        if (!customerReviewVideo) {
            throw new Error("Customer Review Video found with the given ID !");
        }


        let videoMimeType;

        if (req.files && req.files.video && req.files.video.length > 0) {

            if (req.files.video.length > 1) {
                throw new Error("Please upload only one video at a time!");
            }

            videoMimeType = req.files.video[0].mimetype;
            const allowedVideoFormats = ['video/mp4', 'video/webm'];

            if (!allowedVideoFormats.includes(videoMimeType)) {
                throw new Error("Invalid Video format! Only MP4, WEBM formats are allowed!");
            }

            if (customerReviewVideo.video.public_id) {
                try {
                    await cloudinary.uploader.destroy(customerReviewVideo.video.public_id, {
                        resource_type: "video"
                    });
                } catch (error) {
                    throw new Error("Customer Review Video Delete Failed ! Please Try Again (Cloudinary) !");
                }
            }

            const uploadResult = await cloudinary.uploader.upload(req.files.video[0].path, {
                public_id: req.files.video[0].filename.split('.').slice(0, -1).join('.'),
                folder: "BALAM_ZULA/CUSTOMER_REVIEW_VIDEO",
                resource_type: "video"
            });

            if (!uploadResult || !uploadResult.public_id || !uploadResult.secure_url) {
                throw new Error("Customer Review Video Upload Failed! Please Try Again (Cloudinary)!");
            }

            customerReviewVideo.video = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url
            }

        }

        const updateData = {
            video: customerReviewVideo.video
        }

        const updatedCustomerReviewVideo = await CUSTOMER_REVIEW_VIDEO.findByIdAndUpdate(updateId, updateData, { new: true });

        if (!updatedCustomerReviewVideo) {
            throw new Error("Customer Review Video update failed !");
        }

        res.status(200).json({
            message: 'Customer Review Video updated successfully !',
            customerReviewVideo: updatedCustomerReviewVideo
        })
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
}

exports.deleteCustomerReviewVideo = async function (req, res, next) {
    try {
        const { deleteId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(deleteId)) {
            return res.status(400).json({ message: "Invalid Customer Review Video Id !" });
        }

        const validateCustomerReviewVideo = await CUSTOMER_REVIEW_VIDEO.findById(deleteId);
        if (!validateCustomerReviewVideo) {
            return res.status(404).json({ message: "Customer Review Video not found with the provided Id !" });
        }

        if (validateCustomerReviewVideo.video) {
            try {
                await cloudinary.uploader.destroy(validateCustomerReviewVideo.video.public_id, {
                    resource_type: "video",
                });
            } catch (cloudinaryError) {
                console.error("Failed to delete video from Cloudinary :", cloudinaryError);
            }
        }

        await CUSTOMER_REVIEW_VIDEO.findByIdAndDelete(deleteId);

        res.status(200).json({
            message: "Customer Review Video data deleted successfully !",
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};