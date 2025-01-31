const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ABOUT_FRENCHISE_SCHEMA = new Schema(
    {

        title: {
            type: String,
        },
        descriptionOne: {
            type: String,
        },
        descriptionTwo: {
            type: String,
        },
        tags: [
            String
        ],
        image:
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
    },
    {
        timestamps: true
    }
)

const ABOUT_FRENCHISE_DATA = mongoose.model("about_franchise", ABOUT_FRENCHISE_SCHEMA);
module.exports = ABOUT_FRENCHISE_DATA;