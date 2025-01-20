const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OUR_STORY_PURPOSE_SCHEMA = new Schema(
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

const OUR_STORY_PURPOSE_DATA = mongoose.model("our_story_purpose", OUR_STORY_PURPOSE_SCHEMA);
module.exports = OUR_STORY_PURPOSE_DATA; 