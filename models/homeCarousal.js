const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HOME_CAROUSAL_SCHEMA = new Schema(
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

const HOME_CAROUSAL_DATA = mongoose.model("home_carousal", HOME_CAROUSAL_SCHEMA);
module.exports = HOME_CAROUSAL_DATA; 