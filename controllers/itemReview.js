const { default: mongoose } = require('mongoose');
const ITEM_REVIEW = require('../models/itemReview');
const OUR_CATEGORIES_ITEMS = require('../models/ourCategoriesItems');
const cloudinary = require("../utils/Cloudinary");

exports.addItemReview = async function (req, res, next) {
    try {
        const { name, rating, reviewContent, createdBy } = req.body;

        if (!name || !rating || !reviewContent || !createdBy) {
            throw new Error("Please enter all the fields ; they are required !");
        }

        if (createdBy) {
            if (!mongoose.Types.ObjectId.isValid(createdBy)) {
                throw new Error("Invalid Category Item Id ( createdBy )!");
            }

            const categoryItem = await OUR_CATEGORIES_ITEMS.findById(createdBy);
            if (!categoryItem) {
                throw new Error("Category Item Not Found with Provided Id ( createdBy )!");
            }
        }

        if (rating > 5 || rating < 1) {
            throw new Error("Rating must be between 1 To 5 !");
        }


        if (!req.files || !req.files.reviewImage || req.files.reviewImage.length === 0) {
            throw new Error("No images provided ! Please upload at least one image.");
        }

        const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];

        await req.files.reviewImage.forEach(file => {
            if (!allowedFormats.includes(file.mimetype)) {
                throw new Error(`Invalid image format (${file.originalname}) ! Only JPEG, PNG, JPG, WEBP, and SVG formats are allowed.`);
            }
        });

        // Upload images concurrently using Promise.all
        const reviewImage = await Promise.all(
            req.files.reviewImage.map(async (file) => {
                const imageResult = await cloudinary.uploader.upload(file.path, {
                    public_id: file.filename.split('.').slice(0, -1).join('.'),
                    folder: "BALAM_ZULA/REVIEW_IMAGES",
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

        const reviewData = new ITEM_REVIEW({
            name,
            rating,
            reviewImage,
            reviewContent,
            createdBy
        });

        await reviewData.save();

        res.status(201).json({
            message: 'Review added successfully !',
            reviewData
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

exports.getItemReview = async function (req, res, next) {
    try {

        const itemReview = await ITEM_REVIEW.find().populate('createdBy');
        const total = await ITEM_REVIEW.countDocuments();

        if (!itemReview || itemReview.length === 0) {
            throw new Error("Item Review Not Found !");
        }

        res.status(200).json({
            message: `Item Review Fetched Successfully !`,
            itemReview,
            total
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

exports.getItemReviewByCategoryItemId = async function (req, res, next) {
    try {

        const { itemId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            throw new Error("Invalid Category Item Id !");
        }

        const validateCategoryItem = await OUR_CATEGORIES_ITEMS.findById(itemId);

        if (!validateCategoryItem) {
            throw new Error("Category Item Not Found !");
        }

        const reviewData = await ITEM_REVIEW.find({ createdBy: itemId }).populate('createdBy');
        const total = await ITEM_REVIEW.countDocuments({ createdBy: itemId });

        if (!reviewData || reviewData.length === 0) {
            throw new Error("Review Not Found for Provided Category Item Id !");
        }

        res.status(200).json({
            message: `Review Fetched Successfully By Provided Category Item Id !`,
            reviewData,
            total
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

exports.deleteItemReview = async function (req, res, next) {
    try {

        const { deleteId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(deleteId)) {
            throw new Error("Invalid Review Id !")
        }

        const validateReview = await ITEM_REVIEW.findById(deleteId);

        if (!validateReview) {
            throw new Error("Review Not Found !")
        }

        if (validateReview.reviewImage) {
            await Promise.all(
                validateReview.reviewImage.map(async (image) => {
                    if (image.public_id) {
                        await cloudinary.uploader.destroy(image.public_id, {
                            resource_type: "image"
                        });
                    }
                })
            );
        }

        await ITEM_REVIEW.findByIdAndDelete(deleteId);

        res.status(200).json({
            message: `Review Deleted Successfully !`,
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}