const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const ADMIN_SCHEMA = new Schema(
    {
        email: {
            type: String,
            lowercase: true,
            default: null
        },
        password: {
            type: String,
            default: null
        },
        userType: {
            type: String,
            enum: ['admin'],
            default: 'admin'
        }
    }
    ,
    {
        timestamps: true
    }
)

ADMIN_SCHEMA.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const ADMIN_DATA = mongoose.model('admin', ADMIN_SCHEMA);
module.exports = ADMIN_DATA;