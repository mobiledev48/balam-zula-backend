const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CUSTOMER_REVIEW_VIDEO_SCHEMA = new Schema(
    {
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

const CUSTOMER_REVIEW_VIDEO_DATA = mongoose.model("customer_review_video", CUSTOMER_REVIEW_VIDEO_SCHEMA);
module.exports = CUSTOMER_REVIEW_VIDEO_DATA;