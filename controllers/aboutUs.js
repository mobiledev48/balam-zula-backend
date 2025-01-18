const { default: mongoose } = require('mongoose');
const ABOUT_US = require('../models/aboutUs');
const cloudinary = require("../utils/Cloudinary");


exports.addAboutUs = async function (req, res, next) {
    try {
        // Step 1: Validate required fields
        const {
            yearsOfExperience,
            satisfiedClients,
            zulaItems,
            title,
            description,
            tags
        } = req.body;

        if (!yearsOfExperience || !satisfiedClients || !zulaItems || !title || !description || !tags) {
            throw new Error("Please enter all the fields; they are required!");
        }

        // Step 2: Validate image and video formats (without uploading yet)
        let imageMimeType, videoMimeType;

        if (req.files) {
            if (req.files.image) {

                if (req.files.image.length > 1) {
                    throw new Error("Please upload only one image at a time!");
                }

                imageMimeType = req.files.image[0].mimetype;
                const allowedImageFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];

                if (!allowedImageFormats.includes(imageMimeType)) {
                    throw new Error("Invalid Image format! Only JPEG, PNG, JPG, WEBP, and SVG formats are allowed!");
                }
            } else {
                throw new Error("Please Upload About Us Image !")
            }

            if (req.files.video) {

                if (req.files.video.length > 1) {
                    throw new Error("Please upload only one video at a time!");
                }

                videoMimeType = req.files.video[0].mimetype;
                const allowedVideoFormats = ['video/mp4', 'video/webm'];

                if (!allowedVideoFormats.includes(videoMimeType)) {
                    throw new Error("Invalid Video format! Only MP4, WEBM formats are allowed!");
                }
            } else {
                throw new Error("Please Upload About Us Video !")
            }
        }

        // Step 3: Upload image to Cloudinary if valid
        let imageResult, videoResult;
        if (req.files && req.files.image) {
            imageResult = await cloudinary.uploader.upload(req.files.image[0].path, {
                public_id: req.files.image[0].filename.split('.').slice(0, -1).join('.'),
                folder: "BALAM_ZULA/ABOUT_US/IMAGE",
                resource_type: "image"
            });

            if (!imageResult || !imageResult.public_id || !imageResult.secure_url) {
                throw new Error("About Us Image Upload Failed! Please Try Again (Cloudinary)!");
            }
        }

        // Step 4: Upload video to Cloudinary if valid
        if (req.files && req.files.video) {
            videoResult = await cloudinary.uploader.upload(req.files.video[0].path, {
                public_id: req.files.video[0].filename.split('.').slice(0, -1).join('.'),
                folder: "BALAM_ZULA/ABOUT_US/VIDEO",
                resource_type: "video"
            });
        }

        // Step 5: Handle tags and save to database
        let tagArray = tags.split(',').map(tag => tag.trim());

        const newAboutUs = new ABOUT_US({
            yearsOfExperience,
            satisfiedClients,
            zulaItems,
            title,
            description,
            tags: tagArray,
            image: {
                public_id: imageResult ? imageResult.public_id : null,
                url: imageResult ? imageResult.secure_url : null
            },
            video: {
                public_id: videoResult ? videoResult.public_id : null,
                url: videoResult ? videoResult.secure_url : null
            }
        });

        // Step 6: Save data to the database
        await newAboutUs.save();

        // Step 7: Send success response
        res.status(201).json({
            message: 'About Us data added successfully!',
            aboutUs: newAboutUs
        });
    } catch (error) {
        // Step 8: Handle errors and send the error message
        res.status(400).json({
            message: error.message
        });
    }
};

exports.getAboutUs = async function (req, res, next) {
    try {
        const aboutUs = await ABOUT_US.findOne().sort({ _id: 1 });

        if (!aboutUs) {
            throw new Error("About Us data not found !");
        }

        res.status(200).json({
            message: 'About Us data fetched successfully !',
            aboutUs
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

exports.updateAboutUs = async function (req, res, next) {
    try {

        const { yearsOfExperience, satisfiedClients, zulaItems, title, description, tags } = req.body;
        const { updateId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(updateId)) {
            throw new Error("Invalid About Us Id !");
        }

        const aboutUs = await ABOUT_US.findById(updateId);

        if (!aboutUs) {
            throw new Error("About Us data not found with the given ID !");
        }

        const parsedTags = tags ? tags.split(',').map(tag => tag.trim()) : aboutUs.tags;

        // Step 2: Validate image and video formats (without uploading yet)
        let imageMimeType, videoMimeType;

        if (req.files) {
            if (req.files.image) {

                if (req.files.image.length > 1) {
                    throw new Error("Please upload only one image at a time!");
                }

                imageMimeType = req.files.image[0].mimetype;
                const allowedImageFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];

                if (!allowedImageFormats.includes(imageMimeType)) {
                    throw new Error("Invalid Image format! Only JPEG, PNG, JPG, WEBP, and SVG formats are allowed!");
                }
            }

            if (req.files.video) {

                if (req.files.video.length > 1) {
                    throw new Error("Please upload only one video at a time!");
                }

                videoMimeType = req.files.video[0].mimetype;
                const allowedVideoFormats = ['video/mp4', 'video/webm'];

                if (!allowedVideoFormats.includes(videoMimeType)) {
                    throw new Error("Invalid Video format! Only MP4, WEBM formats are allowed!");
                }
            }
        }

        if (req.files && req.files.image) {
            // Delete the old image from Cloudinary, if exists
            if (aboutUs.image.public_id) {
                try {
                    await cloudinary.uploader.destroy(aboutUs.image.public_id, {
                        resource_type: "image"
                    });
                } catch (error) {
                    throw new Error("About Us Image Delete Failed ! Please Try Again (Cloudinary) !");
                }
            }

            // Upload the new image
            const uploadResult = await cloudinary.uploader.upload(req.files.image[0].path, {
                public_id: req.files.image[0].filename.split('.').slice(0, -1).join('.'),
                folder: "BALAM_ZULA/ABOUT_US/IMAGE",
                resource_type: "image"
            });

            if (!uploadResult || !uploadResult.public_id || !uploadResult.secure_url) {
                throw new Error("About Us Image Upload Failed! Please Try Again (Cloudinary)!");
            }

            aboutUs.image = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url
            }
        }

        if (req.files && req.files.video) {
            // Delete the old video from Cloudinary, if exists
            if (aboutUs.video.public_id) {
                try {
                    await cloudinary.uploader.destroy(aboutUs.video.public_id, {
                        resource_type: "video"
                    });
                } catch (error) {
                    throw new Error("About Us Video Delete Failed ! Please Try Again (Cloudinary) !");
                }
            }

            // Upload the new video
            const uploadResult = await cloudinary.uploader.upload(req.files.video[0].path, {
                public_id: req.files.video[0].filename.split('.').slice(0, -1).join('.'),
                folder: "BALAM_ZULA/ABOUT_US/VIDEO",
                resource_type: "video"
            });

            if (!uploadResult || !uploadResult.public_id || !uploadResult.secure_url) {
                throw new Error("About Us Video Upload Failed! Please Try Again (Cloudinary)!");
            }

            aboutUs.video = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url
            }
        }

        const updateData = {
            image: aboutUs.image,
            video: aboutUs.video,
            yearsOfExperience: yearsOfExperience || aboutUs.yearsOfExperience,
            satisfiedClients: satisfiedClients || aboutUs.satisfiedClients,
            zulaItems: zulaItems || aboutUs.zulaItems,
            title: title || aboutUs.title,
            description: description || aboutUs.description,
            tags: parsedTags
        }

        const updatedAboutUs = await ABOUT_US.findByIdAndUpdate(updateId, updateData, { new: true });

        if (!updatedAboutUs) {
            throw new Error("About Us data update failed!");
        }

        res.status(200).json({
            message: 'About Us data updated successfully!',
            aboutUs: updatedAboutUs
        })
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
}

exports.deleteAboutUs = async function (req, res, next) {
    try {
        const { deleteId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(deleteId)) {
            return res.status(400).json({ message: "Invalid About Us Id !" });
        }

        const validateAboutUs = await ABOUT_US.findById(deleteId);
        if (!validateAboutUs) {
            return res.status(404).json({ message: "About Us not found with the provided Id !" });
        }

        if (validateAboutUs.image) {
            try {
                await cloudinary.uploader.destroy(validateAboutUs.image.public_id, {
                    resource_type: "image",
                });
            } catch (cloudinaryError) {
                console.error("Failed to delete image from Cloudinary :", cloudinaryError);
            }
        }

        if (validateAboutUs.video) {
            try {
                await cloudinary.uploader.destroy(validateAboutUs.video.public_id, {
                    resource_type: "video",
                });
            } catch (cloudinaryError) {
                console.error("Failed to delete video from Cloudinary :", cloudinaryError);
            }
        }

        await ABOUT_US.findByIdAndDelete(deleteId);

        res.status(200).json({
            message: "About Us data deleted successfully !",
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};