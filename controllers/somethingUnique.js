const { default: mongoose } = require('mongoose');
const SOMETHING_UNIQUE = require('../models/somethingUnique');
const cloudinary = require("../utils/Cloudinary");


exports.addSomethingUnique = async function (req, res, next) {

    try {

        const { name } = req.body;

        if (!req.file) {
            throw new Error("Please Upload Something-Unique Item Image !")
        }

        if (!name) {
            throw new Error("Please Something-Unique Item Name it is required !")
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
                folder: "BALAM_ZULA/SOMETHING_UNIQUE",
                resource_type: "image"
            });

            if (!imageResult || !imageResult.public_id || !imageResult.secure_url) {
                throw new Error("Something-Unique Item Image Upload Failed ! Please Try Again ( Cloudinary ) !")
            }

        }

        const somethingUniqueData = new SOMETHING_UNIQUE({
            image: {
                public_id: imageResult.public_id,
                url: imageResult.secure_url
            },
            name
        });

        await somethingUniqueData.save();

        res.status(201).json({
            message: 'Something-Unique Item Added Successfully !',
            somethingUniqueData
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }

}

exports.getSomethingUnique = async function (req, res, next) {
    try {

        const somethingUniqueData = await SOMETHING_UNIQUE.find();
        const total = await SOMETHING_UNIQUE.countDocuments();

        if (!somethingUniqueData || somethingUniqueData.length === 0) {
            throw new Error("Something-Unique Item Data Not Found !");
        }

        res.status(200).json({
            message: `Something-Unique Item Data Fetched Successfully ! Total ${total}`,
            somethingUniqueData,
            total
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

exports.updateSomethingUnique = async function (req, res, next) {
    try {
        const { name } = req.body;
        const { updateId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(updateId)) {
            throw new Error("Invalid Something-Unique Item Id !");
        }

        const existingSomethingUnique = await SOMETHING_UNIQUE.findById(updateId);
        if (!existingSomethingUnique) {
            throw new Error("Something-Unique Item Not Found !");
        }

        let updatedImage = existingSomethingUnique.image; // Default to the current image

        // Handle image upload if a new file is provided
        if (req.file) {
            const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];

            // Validate image format
            if (!allowedFormats.includes(req.file.mimetype)) {
                throw new Error("Invalid Image format! Only JPEG, PNG, JPG, WEBP, and SVG formats are allowed !");
            }

            // Delete the old image from Cloudinary, if exists
            if (existingSomethingUnique.image.public_id) {
                try {
                    await cloudinary.uploader.destroy(existingSomethingUnique.image.public_id, {
                        resource_type: "image"
                    });
                } catch (error) {
                    throw new Error("Something-Unique Item Image Delete Failed ! Please Try Again (Cloudinary) !");
                }
            }

            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                public_id: req.file.filename.split('.').slice(0, -1).join('.'),
                folder: "BALAM_ZULA/SOMETHING_UNIQUE",
                resource_type: "image"
            });

            if (!uploadResult || !uploadResult.public_id || !uploadResult.secure_url) {
                throw new Error("Something-Unique Item Image Update Failed ! Please Try Again (Cloudinary) !");
            }

            updatedImage = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url
            };
        }

        const updatedData = {
            image: updatedImage,
            name: name || existingSomethingUnique.name
        };

        const updatedSomethingUniqueData = await SOMETHING_UNIQUE.findByIdAndUpdate(updateId, updatedData, { new: true });

        res.status(200).json({
            message: "Something-Unique Item Updated Successfully!",
            somethingUniqueData: updatedSomethingUniqueData
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

exports.deleteSomethingUnique = async function (req, res, next) {
    try {

        const { deleteId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(deleteId)) {
            throw new Error("Invalid Something-Unique Item Id !")
        }

        const validateSomethingUnique = await SOMETHING_UNIQUE.findById(deleteId);

        if (!validateSomethingUnique) {
            throw new Error("Something-Unique Item Not Found !")
        }

        if (validateSomethingUnique.image.public_id) {
            await cloudinary.uploader.destroy(validateSomethingUnique.image.public_id, {
                resource_type: "image"
            });
        }

        await SOMETHING_UNIQUE.findByIdAndDelete(deleteId);

        res.status(200).json({
            message: `Something-Unique Item Deleted Successfully !`,
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}