const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CONTACT_US_SCHEMA = new Schema(
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
            required: true
        },
        description: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        mobileNumber: {
            type: String,
            required: true
        },
        watsappNumber: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        instagramLink: {
            type: String,
            required: true
        },
        facebookLink: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const CONTACT_US_DATA = mongoose.model("contact_us", CONTACT_US_SCHEMA);
module.exports = CONTACT_US_DATA;