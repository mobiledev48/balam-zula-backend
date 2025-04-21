const { default: mongoose } = require('mongoose');
const OUR_CATEGORIES = require('../models/ourCategories');
const OUR_CATEGORIES_ITEMS = require('../models/ourCategoriesItems');
const ITEM_REVIEW = require('../models/itemReview');
const cloudinary = require("../utils/Cloudinary");


exports.addOurCategories = async function (req, res, next) {

    try {

        const { name } = req.body;

        if (!req.file) {
            throw new Error("Please Upload Category Image !")
        }

        if (!name) {
            throw new Error("Please Category Name it is required !")
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
                folder: "BALAM_ZULA/OUR_CATEGORIES/CATEGORY_IMAGES",
                resource_type: "image"
            });

            if (!imageResult || !imageResult.public_id || !imageResult.secure_url) {
                throw new Error("Category Image Upload Failed ! Please Try Again ( Cloudinary ) !")
            }

        }

        const categoryData = new OUR_CATEGORIES({
            image: {
                public_id: imageResult.public_id,
                url: imageResult.secure_url
            },
            name
        });

        await categoryData.save();

        res.status(201).json({
            message: 'Category Added Successfully !',
            categoryData
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }

}

exports.getOurCategories = async function (req, res, next) {
    try {

        const categoryData = await OUR_CATEGORIES.find();
        const total = await OUR_CATEGORIES.countDocuments();

        if (!categoryData || categoryData.length === 0) {
            throw new Error("Our Category Data Not Found !");
        }

        res.status(200).json({
            message: `Our Category Data Fetched Successfully ! Total ${total}`,
            categoryData,
            total
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

exports.getOurCategoryById = async function (req, res, next) {
    try {
        const { categoryId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            throw new Error("Invalid Category Id !");
        }

        const categoryData = await OUR_CATEGORIES.findById(categoryId);

        if (!categoryData) {
            throw new Error("Category Not Found !");
        }

        res.status(200).json({
            message: "Category Fetched Successfully !",
            categoryData
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

exports.updateOurCategories = async function (req, res, next) {
    try {
        const { name } = req.body;
        const { updateId } = req.params;

        // Validate the provided ID
        if (!mongoose.Types.ObjectId.isValid(updateId)) {
            throw new Error("Invalid Category Id !");
        }

        // Fetch the existing Category
        const existingCategory = await OUR_CATEGORIES.findById(updateId);
        if (!existingCategory) {
            throw new Error("Category Not Found !");
        }

        let updatedImage = existingCategory.image; // Default to the current image

        // Handle image upload if a new file is provided
        if (req.file) {
            const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];

            // Validate image format
            if (!allowedFormats.includes(req.file.mimetype)) {
                throw new Error("Invalid Image format! Only JPEG, PNG, JPG, WEBP, and SVG formats are allowed !");
            }

            // Delete the old image from Cloudinary, if exists
            if (existingCategory.image.public_id) {
                try {
                    await cloudinary.uploader.destroy(existingCategory.image.public_id, {
                        resource_type: "image"
                    });
                } catch (error) {
                    throw new Error("Category Image Delete Failed ! Please Try Again (Cloudinary) !");
                }
            }

            // Upload the new image
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                public_id: req.file.filename.split('.').slice(0, -1).join('.'),
                folder: "BALAM_ZULA/OUR_CATEGORIES/CATEGORY_IMAGES",
                resource_type: "image"
            });

            if (!uploadResult || !uploadResult.public_id || !uploadResult.secure_url) {
                throw new Error("Category Image Update Failed ! Please Try Again (Cloudinary) !");
            }

            updatedImage = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url
            };
        }

        // Prepare updated fields
        const updatedData = {
            image: updatedImage,
            name: name || existingCategory.name
        };

        // Update the category in the database
        const updatedCategoryData = await OUR_CATEGORIES.findByIdAndUpdate(updateId, updatedData, { new: true });

        res.status(200).json({
            message: "Category Updated Successfully!",
            categoryData: updatedCategoryData
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

exports.deleteOurCategories = async function (req, res, next) {
    try {

        const { deleteId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(deleteId)) {
            throw new Error("Invalid Category Id !")
        }

        const validateCategory = await OUR_CATEGORIES.findById(deleteId);

        if (!validateCategory) {
            throw new Error("Category Not Found !")
        }

        if (validateCategory.image.public_id) {
            await cloudinary.uploader.destroy(validateCategory.image.public_id, {
                resource_type: "image"
            });
        }


        // Delete Categories Items Associated with the Category //
        const categoryItems = await OUR_CATEGORIES_ITEMS.find({ createdBy: deleteId });

        if (categoryItems && categoryItems.length > 0) {
            const deleteItemImagePromises = categoryItems.map((item) => {
                if (item.images && item.images.length > 0) {
                    const itemImagePromises = item.images.map((image) => {
                        return cloudinary.uploader.destroy(image.public_id, { resource_type: "image" })
                    });
                    return Promise.all(itemImagePromises);
                }
            });

            await Promise.all(deleteItemImagePromises);
        }


        // Delete Product Reviews Images from Cloudinary and the Database
        const productReviews = await ITEM_REVIEW.find({
            createdBy: { $in: categoryItems.map((item) => item._id) },
        });

        if (productReviews && productReviews.length > 0) {
            // Collect all deletion promises for review images
            const deleteReviewImagePromises = productReviews.map((review) => {
                if (review.reviewImage && review.reviewImage.length > 0) {
                    // Map through each image in the reviewImage array
                    const imageDeletionPromises = review.reviewImage.map((image) =>
                        cloudinary.uploader.destroy(image.public_id, { resource_type: "image" })
                    );
                    return Promise.all(imageDeletionPromises); // Wait for all images in the array to be deleted
                }
            });

            // Wait for all review images to be deleted from Cloudinary
            await Promise.all(deleteReviewImagePromises);

            // Delete the reviews from the database
            await ITEM_REVIEW.deleteMany({ createdBy: { $in: categoryItems.map((item) => item._id) } });
        }


        // Delete the category items from the database
        await OUR_CATEGORIES_ITEMS.deleteMany({ createdBy: deleteId });

        // Delete the category from the database
        await OUR_CATEGORIES.findByIdAndDelete(deleteId);

        res.status(200).json({
            message: `Category Deleted Successfully !`,
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

exports.getTotalCounts = async function (req, res, next) {
    try {
        const totalCategories = await OUR_CATEGORIES.countDocuments();
        const totalCategoryItems = await OUR_CATEGORIES_ITEMS.countDocuments();

        res.status(200).json({
            message: "Total counts fetched successfully!",
            data: {
                totalCategories,
                totalCategoryItems
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}