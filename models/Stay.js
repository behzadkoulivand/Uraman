const mongoose = require('mongoose');

const {schema} = require('./secure/stayValidation');

const staySchema = new mongoose.Schema({
    typeStay: {
        type: String,
        default: "ویلا",
        enum: ["ویلا", "آپارتمان", "بوم گردی"]
    },
    status: {
        type: String,
        default: "فعال",
        enum: ["فعال", "غیر فغال"]
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    amenities: Array,
    rules: Array,
    phoneNumber: String,

    address: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: Array,
    },
    details: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

staySchema.index({title: "text"});

staySchema.statics.stayValidation = function(body) {
    return schema.validate(body, {abortEarly: false});
}

module.exports = mongoose.model("Stay", staySchema);