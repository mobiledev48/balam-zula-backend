const { default: mongoose } = require('mongoose');
const LATEST_PRODUCT = require('../models/latestProduct');
const cloudinary = require("../utils/Cloudinary");


exports.addLatestProduct = async function (req, res, next) {

    try {

        const { name } = req.body;

        if (!req.file) {
            throw new Error("Please Upload Latest Product Image !")
        }

        if (!name) {
            throw new Error("Please Latest Product Name it is required !")
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
                folder: "BALAM_ZULA/LATEST_PRODUCT",
                resource_type: "image"
            });

            if (!imageResult || !imageResult.public_id || !imageResult.secure_url) {
                throw new Error("Latest Product Image Upload Failed ! Please Try Again ( Cloudinary ) !")
            }

        }

        const latestProductData = new LATEST_PRODUCT({
            image: {
                public_id: imageResult.public_id,
                url: imageResult.secure_url
            },
            name
        });

        await latestProductData.save();

        res.status(201).json({
            message: 'Latest Product Added Successfully !',
            latestProductData
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }

}

exports.getLatestProduct = async function (req, res, next) {
    try {

        const latestProductData = await LATEST_PRODUCT.find();
        const total = await LATEST_PRODUCT.countDocuments();

        if (!latestProductData || latestProductData.length === 0) {
            throw new Error("Latest Product Data Not Found !");
        }

        res.status(200).json({
            message: `Latest Product Data Fetched Successfully ! Total ${total}`,
            latestProductData,
            total
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

exports.updateLatestProduct = async function (req, res, next) {
    try {
        const { name } = req.body;
        const { updateId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(updateId)) {
            throw new Error("Invalid Latest Product Id !");
        }

        const existingLatestProduct = await LATEST_PRODUCT.findById(updateId);
        if (!existingLatestProduct) {
            throw new Error("Latest Product Not Found with Provided Id !");
        }

        let updatedImage = existingLatestProduct.image; // Default to the current image

        // Handle image upload if a new file is provided
        if (req.file) {
            const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];

            // Validate image format
            if (!allowedFormats.includes(req.file.mimetype)) {
                throw new Error("Invalid Image format! Only JPEG, PNG, JPG, WEBP, and SVG formats are allowed !");
            }

            // Delete the old image from Cloudinary, if exists
            if (existingLatestProduct.image.public_id) {
                try {
                    await cloudinary.uploader.destroy(existingLatestProduct.image.public_id, {
                        resource_type: "image"
                    });
                } catch (error) {
                    throw new Error("Latest Product Image Delete Failed ! Please Try Again (Cloudinary) !");
                }
            }

            // Upload the new image
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                public_id: req.file.filename.split('.').slice(0, -1).join('.'),
                folder: "BALAM_ZULA/LATEST_PRODUCT",
                resource_type: "image"
            });

            if (!uploadResult || !uploadResult.public_id || !uploadResult.secure_url) {
                throw new Error("Latest Product Image Update Failed ! Please Try Again (Cloudinary) !");
            }

            updatedImage = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url
            };
        }

        // Prepare updated fields
        const updatedData = {
            image: updatedImage,
            name: name || existingLatestProduct.name
        };

        const updatedLatestProduct = await LATEST_PRODUCT.findByIdAndUpdate(updateId, updatedData, { new: true });

        res.status(200).json({
            message: "Latest Product Updated Successfully!",
            latestProductData: updatedLatestProduct
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

exports.deleteLatestProduct = async function (req, res, next) {
    try {

        const { deleteId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(deleteId)) {
            throw new Error("Invalid Latest Product Id !")
        }

        const validateLatestProduct = await LATEST_PRODUCT.findById(deleteId);

        if (!validateLatestProduct) {
            throw new Error("Latest Product Not Found !")
        }

        if (validateLatestProduct.image.public_id) {
            await cloudinary.uploader.destroy(validateLatestProduct.image.public_id, {
                resource_type: "image"
            });
        }

        await LATEST_PRODUCT.findByIdAndDelete(deleteId);

        res.status(200).json({
            message: `Latest Product Deleted Successfully !`,
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}