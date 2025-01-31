const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FOLLOW_US_MEDIA_SCHEMA = new Schema(
    {
        thumbnail_media: {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        },
        thumbnail_media_url: {
            type: String,
        },
        instagramUserName: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

const FOLLOW_US_MEDIA_DATA = mongoose.model("follow_us_media", FOLLOW_US_MEDIA_SCHEMA);
module.exports = FOLLOW_US_MEDIA_DATA;