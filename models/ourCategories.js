const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OUR_CATEGORIES_SCHEMA = new Schema(
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

const OUR_CATEGORIES_DATA = mongoose.model("our_categories", OUR_CATEGORIES_SCHEMA);
module.exports = OUR_CATEGORIES_DATA;