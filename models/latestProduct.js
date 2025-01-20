const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LATEST_PRODUCT_SCHEMA = new Schema(
    {
        image: {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        },
        name: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

const LATEST_PRODUCT_DATA = mongoose.model("latest_product", LATEST_PRODUCT_SCHEMA);
module.exports = LATEST_PRODUCT_DATA;