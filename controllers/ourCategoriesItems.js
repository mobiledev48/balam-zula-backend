const { default: mongoose } = require('mongoose');
const OUR_CATEGORIES_ITEMS = require('../models/ourCategoriesItems');
const OUR_CATEGORIES = require('../models/ourCategories');
const WHATSAPP_NUMBER = require('../models/watsappNumber');
const cloudinary = require("../utils/Cloudinary");


exports.addOurCategoriesItems = async function (req, res, next) {
    try {
        const { name, description, tags, height, width, length, material, createdBy,
            warranty, hangingSet, cushion, maintenance, customizationAvailable, additionalInformation
        } = req.body;

        if (!name || !description || !tags || !height || !width || !length || !material || !createdBy ||
            !warranty || !hangingSet || !cushion || !maintenance || !customizationAvailable || !additionalInformation
        ) {
            throw new Error("Please enter all the fields; they are required!");
        }

        if (createdBy) {
            if (!mongoose.Types.ObjectId.isValid(createdBy)) {
                throw new Error("Invalid Category Id ( createdBy )!");
            }

            const category = await OUR_CATEGORIES.findById(createdBy);
            if (!category) {
                throw new Error("Category Not Found with Provided Id ( createdBy )!");
            }
        }

        const parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        const parsedMaintenance = maintenance.split(',').map(maintenance => maintenance.trim()).filter(maintenance => maintenance !== '');
        const parsedAdditionalInformation = additionalInformation.split(',').map(additionalInformation => additionalInformation.trim()).filter(additionalInformation => additionalInformation !== '');

        if (!req.files || !req.files.images || req.files.images.length === 0) {
            throw new Error("No images provided! Please upload at least one image.");
        }

        const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];

        await req.files.images.forEach(file => {
            if (!allowedFormats.includes(file.mimetype)) {
                throw new Error(`Invalid image format (${file.originalname}) ! Only JPEG, PNG, JPG, WEBP, and SVG formats are allowed.`);
            }
        });

        const validateWatsappNumber = await WHATSAPP_NUMBER.findOne().sort({ _id: 1 });

        if (!validateWatsappNumber) {
            throw new Error("watsapp Number Not Found For Creating Category Item & Please Add Watsapp Number First !");
        }

        // Upload images concurrently using Promise.all
        const images = await Promise.all(
            req.files.images.map(async (file) => {
                const imageResult = await cloudinary.uploader.upload(file.path, {
                    public_id: file.filename.split('.').slice(0, -1).join('.'),
                    folder: "BALAM_ZULA/OUR_CATEGORIES/CATEGORY_ITEM_IMAGES",
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
        const categoryItemData = new OUR_CATEGORIES_ITEMS({
            images,
            name,
            description,
            tags: parsedTags,
            height,
            width,
            length,
            material,
            createdBy,
            watsappNumber: validateWatsappNumber.watsappNumber,
            warranty,
            hangingSet,
            cushion,
            maintenance: parsedMaintenance,
            customizationAvailable,
            additionalInformation: parsedAdditionalInformation
        });

        await categoryItemData.save();

        res.status(201).json({
            message: 'Category item added successfully !',
            categoryItemData
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

exports.getOurCategoriesItems = async function (req, res, next) {
    try {

        const { limit, skip } = req.query;

        // Prepare query options for pagination
        const queryOptions = {};
        if (limit) queryOptions.limit = parseInt(limit);
        if (skip) queryOptions.skip = parseInt(skip);

        const categoryItemData = await OUR_CATEGORIES_ITEMS.find().populate('createdBy').limit(queryOptions.limit).skip(queryOptions.skip)
        const total = await OUR_CATEGORIES_ITEMS.countDocuments();

        if (!categoryItemData || categoryItemData.length === 0) {
            throw new Error("Our Category Item Not Found !");
        }

        res.status(200).json({
            message: `Our Category Item Fetched Successfully !`,
            categoryItemData,
            total
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

exports.getSingleOurCategoriesItems = async function (req, res, next) {
    try {

        const { Id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(Id)) {
            throw new Error("Invalid Category Item Id !");
        }

        const categoryItemData = await OUR_CATEGORIES_ITEMS.findById(Id).populate('createdBy');

        if (!categoryItemData) {
            throw new Error("Our Category Item Not Found with Provided Id !");
        }

        res.status(200).json({
            message: `Our Category Single Item Fetched Successfully !`,
            categoryItemData
        });

    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

exports.updateOurCategoriesItems = async function (req, res, next) {
    try {
        const { name, description, tags, height, width, length, material, createdBy,
            warranty, hangingSet, cushion, maintenance, customizationAvailable, additionalInformation
        } = req.body;

        const { updateId } = req.params;

        // Validate the provided ID
        if (!mongoose.Types.ObjectId.isValid(updateId)) {
            throw new Error("Invalid Category Item Id !");
        }

        // Fetch the existing category item
        const existingCategoryItem = await OUR_CATEGORIES_ITEMS.findById(updateId);
        if (!existingCategoryItem) {
            throw new Error("Category Item Not Found !");
        }

        if (createdBy) {
            if (!mongoose.Types.ObjectId.isValid(createdBy)) {
                throw new Error("Invalid Category Id ( createdBy )!");
            }

            const category = await OUR_CATEGORIES.findById(createdBy);
            if (!category) {
                throw new Error("Category Not Found with Provided Id ( createdBy )!");
            }
        }

        // Handle tag parsing if provided
        const parsedTags = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : existingCategoryItem.tags;
        const parsedMaintenance = maintenance ? maintenance.split(',').map(maintenance => maintenance.trim()).filter(maintenance => maintenance !== '') : existingCategoryItem.maintenance;
        const parsedAdditionalInformation = additionalInformation ? additionalInformation.split(',').map(additionalInformation => additionalInformation.trim()).filter(additionalInformation => additionalInformation !== '') : existingCategoryItem.additionalInformation;

        let updatedImages = existingCategoryItem.images; // Default to current images

        // Handle new image uploads if provided
        if (req.files && req.files.images && req.files.images.length > 0) {
            const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];

            // Validate new image formats
            req.files.images.forEach(file => {
                if (!allowedFormats.includes(file.mimetype)) {
                    throw new Error(`Invalid image format (${file.originalname}) ! Only JPEG, PNG, JPG, WEBP, and SVG formats are allowed.`);
                }
            });

            // Delete old images from Cloudinary
            if (existingCategoryItem.images && existingCategoryItem.images.length > 0) {
                const deletePromises = existingCategoryItem.images.map(image =>
                    cloudinary.uploader.destroy(image.public_id, { resource_type: "image" })
                );
                await Promise.all(deletePromises);
            }

            // Upload new images
            const uploadPromises = req.files.images.map(file =>
                cloudinary.uploader.upload(file.path, {
                    public_id: file.filename.split('.').slice(0, -1).join('.'),
                    folder: "BALAM_ZULA/OUR_CATEGORIES/CATEGORY_ITEM_IMAGES",
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
            name: name || existingCategoryItem.name,
            description: description || existingCategoryItem.description,
            tags: parsedTags,
            height: height || existingCategoryItem.height,
            width: width || existingCategoryItem.width,
            length: length || existingCategoryItem.length,
            material: material || existingCategoryItem.material,
            createdBy: createdBy || existingCategoryItem.createdBy,
            images: updatedImages,
            warranty: warranty || existingCategoryItem.warranty,
            hangingSet: hangingSet || existingCategoryItem.hangingSet,
            cushion: cushion || existingCategoryItem.cushion,
            maintenance: parsedMaintenance,
            customizationAvailable: customizationAvailable || existingCategoryItem.customizationAvailable,
            additionalInformation: parsedAdditionalInformation
        };

        // Update the category item in the database
        const updatedCategoryItem = await OUR_CATEGORIES_ITEMS.findByIdAndUpdate(updateId, updatedData, { new: true });

        res.status(200).json({
            message: "Category Item Updated Successfully !",
            categoryItemData: updatedCategoryItem
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

exports.deleteOurCategoriesItems = async function (req, res, next) {
    try {

        const { deleteId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(deleteId)) {
            throw new Error("Invalid Category Id !")
        }

        const validateCategoryItem = await OUR_CATEGORIES_ITEMS.findById(deleteId);

        if (!validateCategoryItem) {
            throw new Error("Category Item Not Found !")
        }

        if (validateCategoryItem.images) {
            await Promise.all(
                validateCategoryItem.images.map(async (image) => {
                    if (image.public_id) {
                        await cloudinary.uploader.destroy(image.public_id, {
                            resource_type: "image"
                        });
                    }
                })
            );
        }

        await OUR_CATEGORIES_ITEMS.findByIdAndDelete(deleteId);

        res.status(200).json({
            message: `Category Item Deleted Successfully !`,
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

exports.getOurCategoriesItemsByCategoryId = async function (req, res, next) {
    try {

        const { categoryId } = req.params;
        const { limit, skip } = req.query;

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            throw new Error("Invalid Category Item Id !");
        }

        const validateCategory = await OUR_CATEGORIES.findById(categoryId);

        if (!validateCategory) {
            throw new Error("Category Not Found !");
        }

        // Prepare query options for pagination
        const queryOptions = {};
        if (limit) queryOptions.limit = parseInt(limit);
        if (skip) queryOptions.skip = parseInt(skip);

        const categoryItems = await OUR_CATEGORIES_ITEMS.find({ createdBy: categoryId }).populate('createdBy').limit(queryOptions.limit).skip(queryOptions.skip);
        const total = await OUR_CATEGORIES_ITEMS.countDocuments({ createdBy: categoryId });

        if (!categoryItems || categoryItems.length === 0) {
            throw new Error("Category Items Not Found for Provided Category !");
        }

        res.status(200).json({
            message: `Category Items Fetched Successfully By Provided Category Id !`,
            categoryItems,
            total
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}