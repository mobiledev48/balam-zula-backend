const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ITEM_REVIEW_SCHEMA = new Schema(
    {
        name: {
            type: String,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        reviewImage: [
            {
                public_id: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                }
            }
        ],
        reviewContent: {
            type: String,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "our_categories_items",
            required: true
        }
    },
    {
        timestamps: true
    }
)

const ITEM_REVIEW_DATA = mongoose.model("item_review", ITEM_REVIEW_SCHEMA);
module.exports = ITEM_REVIEW_DATA; 