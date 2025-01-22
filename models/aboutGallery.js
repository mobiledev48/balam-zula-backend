const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ABOUT_GALLERY_SCHEMA = new Schema(
    {

        title: {
            type: String,
        },
        description: [
            String
        ],
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
        ]
    },
    {
        timestamps: true
    }
)

const ABOUT_GALLERY_DATA = mongoose.model("about_gallery", ABOUT_GALLERY_SCHEMA);
module.exports = ABOUT_GALLERY_DATA;