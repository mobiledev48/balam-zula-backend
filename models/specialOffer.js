const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SPECIAL_OFFER_SCHEMA = new Schema(
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
        title: {
            type: String,
        },
        content: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

const SPECIAL_OFFER_DATA = mongoose.model("special_offer", SPECIAL_OFFER_SCHEMA);
module.exports = SPECIAL_OFFER_DATA;