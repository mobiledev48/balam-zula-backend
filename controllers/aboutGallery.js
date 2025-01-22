const { default: mongoose } = require('mongoose');
const ABOUT_GALLERY = require('../models/aboutGallery');
const cloudinary = require("../utils/Cloudinary");


exports.addAboutGallery = async function (req, res, next) {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            throw new Error("Please enter all the fields; they are required !");
        }

        const parsedDescription = description.split(',').map(description => description.trim()).filter(description => description !== '');

        if (!req.files || !req.files.images || req.files.images.length === 0) {
            throw new Error("No images provided! Please upload exactly 4 image.");
        }

        const imageCount = req.files.images.length;
        if (imageCount !== 4) {
            throw new Error(`Invalid number of images! Exactly 4 images are required, but you provided ${imageCount}.`);
        }

        const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];

        await req.files.images.forEach(file => {
            if (!allowedFormats.includes(file.mimetype)) {
                throw new Error(`Invalid image format (${file.originalname}) ! Only JPEG, PNG, JPG, WEBP, and SVG formats are allowed.`);
            }
        });

        // Upload images concurrently using Promise.all
        const images = await Promise.all(
            req.files.images.map(async (file) => {
                const imageResult = await cloudinary.uploader.upload(file.path, {
                    public_id: file.filename.split('.').slice(0, -1).join('.'),
                    folder: "BALAM_ZULA/ABOUT_GALLERY",
                    resource_type: "image"
                });

                if (!imageResult || !imageResult.public_id || !imageResult.secure_url) {
                    throw new Error(`Image upload failed for ${file.originalname}! Please try again.`);
                }

                return {
                    public_id: imageResult.public_id,
                    url: imageResult.secure_url
                };
            })
        );

        // Create and save the category item
        const aboutGalleryData = new ABOUT_GALLERY({
            title,
            description: parsedDescription,
            images
        });

        await aboutGalleryData.save();

        res.status(201).json({
            message: 'About Gallery added successfully !',
            aboutGalleryData
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

exports.getAboutGallery = async function (req, res, next) {
    try {

        const aboutGalleryData = await ABOUT_GALLERY.findOne().sort({ _id: 1 });

        if (!aboutGalleryData) {
            throw new Error("About Gallery Details Not Found !");
        }

        res.status(200).json({
            message: `About Gallery Details Fetched Successfully !`,
            aboutGalleryData
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

exports.updateAboutGallery = async function (req, res, next) {
    try {
        const { title, description } = req.body;

        const { updateId } = req.params;

        // Validate the provided ID
        if (!mongoose.Types.ObjectId.isValid(updateId)) {
            throw new Error("Invalid About Gallery Id !");
        }

        // Fetch the existing category item
        const existingAboutGallery = await ABOUT_GALLERY.findById(updateId);
        if (!existingAboutGallery) {
            throw new Error("About Gallery Details Not Found !");
        }

        const parsedDescription = description ? description.split(',').map(description => description.trim()).filter(description => description !== '') : existingAboutGallery.description;

        let updatedImages = existingAboutGallery.images; // Default to current images

        // Handle new image uploads if provided
        if (req.files && req.files.images && req.files.images.length > 0) {

            // Validate the number of images
            const imageCount = req.files.images.length;
            if (imageCount !== 4) {
                throw new Error(`Invalid number of images! Exactly 4 images are required, but you provided ${imageCount}.`);
            }

            const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];

            // Validate new image formats
            req.files.images.forEach(file => {
                if (!allowedFormats.includes(file.mimetype)) {
                    throw new Error(`Invalid image format (${file.originalname}) ! Only JPEG, PNG, JPG, WEBP, and SVG formats are allowed.`);
                }
            });

            // Delete old images from Cloudinary
            if (existingAboutGallery.images && existingAboutGallery.images.length > 0) {
                const deletePromises = existingAboutGallery.images.map(image =>
                    cloudinary.uploader.destroy(image.public_id, { resource_type: "image" })
                );
                await Promise.all(deletePromises);
            }

            // Upload new images
            const uploadPromises = req.files.images.map(file =>
                cloudinary.uploader.upload(file.path, {
                    public_id: file.filename.split('.').slice(0, -1).join('.'),
                    folder: "BALAM_ZULA/ABOUT_GALLERY",
                    resource_type: "image"
                })
            );
            const uploadedImages = await Promise.all(uploadPromises);

            // Map the uploaded image results
            updatedImages = uploadedImages.map(imageResult => ({
                public_id: imageResult.public_id,
                url: imageResult.secure_url
            }));
        }

        // Prepare updated fields
        const updatedData = {
            title: title || existingAboutGallery.title,
            description: parsedDescription,
            images: updatedImages
        };

        // Update the category item in the database
        const updatedAboutGallery = await ABOUT_GALLERY.findByIdAndUpdate(updateId, updatedData, { new: true });

        res.status(200).json({
            message: "About Gallery Updated Successfully !",
            aboutGalleryData: updatedAboutGallery
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

exports.deleteAboutGallery = async function (req, res, next) {
    try {

        const { deleteId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(deleteId)) {
            throw new Error("Invalid About Gallery Id !")
        }

        const validateAboutGallery = await ABOUT_GALLERY.findById(deleteId);

        if (!validateAboutGallery) {
            throw new Error("About Gallery Details Not Found !")
        }

        if (validateAboutGallery.images) {
            await Promise.all(
                validateAboutGallery.images.map(async (image) => {
                    if (image.public_id) {
                        await cloudinary.uploader.destroy(image.public_id, {
                            resource_type: "image"
                        });
                    }
                })
            );
        }

        await ABOUT_GALLERY.findByIdAndDelete(deleteId);

        res.status(200).json({
            message: `About Gallery Details Deleted Successfully !`,
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}