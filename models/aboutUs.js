const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ABOUT_US_SCHEMA = new Schema(
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
        yearsOfExperience: {
            type: String,
        },
        satisfiedClients: {
            type: String,
        },
        zulaItems: {
            type: String,
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        tags: [
            String
        ],
        video: {
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

const ABOUT_US_DATA = mongoose.model("about_us", ABOUT_US_SCHEMA);
module.exports = ABOUT_US_DATA;