const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SOMETHING_UNIQUE_SCHEMA = new Schema(
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
        name: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

const SOMETHING_UNIQUE_DATA = mongoose.model("something_unique", SOMETHING_UNIQUE_SCHEMA);
module.exports = SOMETHING_UNIQUE_DATA;