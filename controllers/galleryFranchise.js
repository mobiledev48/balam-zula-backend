const { default: mongoose } = require('mongoose');
const GALLERY_FRANCHISE = require('../models/galleryFranchise');
const cloudinary = require("../utils/Cloudinary");


exports.addGalleryFranchise = async function (req, res, next) {
    try {
        const { title, description, tags } = req.body;

        if (!title || !description || !tags) {
            throw new Error("Please enter all the fields; they are required !");
        }

        const parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

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
                    folder: "BALAM_ZULA/FRANCHISE_GALLERY",
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

        const galleryFranchiseData = new GALLERY_FRANCHISE({
            title,
            description,
            tags: parsedTags,
            images
        });

        await galleryFranchiseData.save();

        res.status(201).json({
            message: 'Franchise Gallery added successfully !',
            galleryFranchiseData
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

exports.getGalleryFranchise = async function (req, res, next) {
    try {

        const galleryFranchiseData = await GALLERY_FRANCHISE.findOne().sort({ _id: 1 });

        if (!galleryFranchiseData) {
            throw new Error("Franchise Gallery Details Not Found !");
        }

        res.status(200).json({
            message: `Franchise Gallery Details Fetched Successfully !`,
            galleryFranchiseData
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

exports.updateGalleryFranchise = async function (req, res, next) {
    try {
        const { title, description, tags } = req.body;

        const { updateId } = req.params;

        // Validate the provided ID
        if (!mongoose.Types.ObjectId.isValid(updateId)) {
            throw new Error("Invalid Franchise Gallery Id !");
        }

        const existingFranchiseGallery = await GALLERY_FRANCHISE.findById(updateId);
        if (!existingFranchiseGallery) {
            throw new Error("Franchise Gallery Details Not Found !");
        }

        const parsedTags = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : existingFranchiseGallery.tags;

        let updatedImages = existingFranchiseGallery.images; // Default to current images

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
            if (existingFranchiseGallery.images && existingFranchiseGallery.images.length > 0) {
                const deletePromises = existingFranchiseGallery.images.map(image =>
                    cloudinary.uploader.destroy(image.public_id, { resource_type: "image" })
                );
                await Promise.all(deletePromises);
            }

            // Upload new images
            const uploadPromises = req.files.images.map(file =>
                cloudinary.uploader.upload(file.path, {
                    public_id: file.filename.split('.').slice(0, -1).join('.'),
                    folder: "BALAM_ZULA/FRANCHISE_GALLERY",
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
            title: title || existingFranchiseGallery.title,
            description: description || existingFranchiseGallery.description,
            tags: parsedTags,
            images: updatedImages
        };

        // Update the category item in the database
        const updatedFranchiseGallery = await GALLERY_FRANCHISE.findByIdAndUpdate(updateId, updatedData, { new: true });

        res.status(200).json({
            message: "Franchise Gallery Updated Successfully !",
            franchiseGalleryData: updatedFranchiseGallery
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

exports.deleteGalleryFranchise = async function (req, res, next) {
    try {

        const { deleteId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(deleteId)) {
            throw new Error("Invalid Franchise Gallery Id !")
        }

        const validateFranchiseGallery = await GALLERY_FRANCHISE.findById(deleteId);

        if (!validateFranchiseGallery) {
            throw new Error("Franchise Gallery Details Not Found !")
        }

        if (validateFranchiseGallery.images) {
            await Promise.all(
                validateFranchiseGallery.images.map(async (image) => {
                    if (image.public_id) {
                        await cloudinary.uploader.destroy(image.public_id, {
                            resource_type: "image"
                        });
                    }
                })
            );
        }

        await GALLERY_FRANCHISE.findByIdAndDelete(deleteId);

        res.status(200).json({
            message: `Franchise Gallery Details Deleted Successfully !`,
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}