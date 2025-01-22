const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HOME_SLOGAN_SCHEMA = new Schema(
    {
        slogan: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const HOME_SLOGAN_DATA = mongoose.model("home_slogan", HOME_SLOGAN_SCHEMA);
module.exports = HOME_SLOGAN_DATA;