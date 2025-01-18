const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WATSAPP_NUMBER_SCHEMA = new Schema(
    {
        watsappNumber: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const WATSAPP_NUMBER_DATA = mongoose.model("watsapp_number", WATSAPP_NUMBER_SCHEMA);
module.exports = WATSAPP_NUMBER_DATA;