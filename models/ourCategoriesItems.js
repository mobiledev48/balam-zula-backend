const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OUR_CATEGORIES_ITEMS_SCHEMA = new Schema(
    {
        images: [
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
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        tags: [
            String
        ],
        height: {
            type: String,
        },
        width: {
            type: String,
        },
        length: {
            type: String,
        },
        material: {
            type: String,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "our_categories",
            required: true
        },
        watsappNumber: {
            type: String,
        },
        warranty: {
            type: String,
        },
        hangingSet: {
            type: String,
        },
        cushion: {
            type: String,
        },
        maintenance: [
            String
        ],
        customizationAvailable: {
            type: String,
        },
        additionalInformation: [
            String
        ],
        isDisplaingInSomethingUnique: {
            type: Boolean
        }
    },
    {
        timestamps: true
    }
)

const OUR_CATEGORIES_ITEMS_DATA = mongoose.model("our_categories_items", OUR_CATEGORIES_ITEMS_SCHEMA);
module.exports = OUR_CATEGORIES_ITEMS_DATA;