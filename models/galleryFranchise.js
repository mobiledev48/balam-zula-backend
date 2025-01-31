const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GALLERY_FRANCHISE_SCHEMA = new Schema(
    {

        title: {
            type: String,
        },
        description: {
            type: String,
        },
        tags: [
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

const GALLERY_FRANCHISE_DATA = mongoose.model("gallery_franchise", GALLERY_FRANCHISE_SCHEMA);
module.exports = GALLERY_FRANCHISE_DATA;