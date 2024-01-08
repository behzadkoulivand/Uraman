const mongoose = require('mongoose');

const reserveSchema = new mongoose.Schema({
    reservatore: String,
    stay: String,
    entryDate: {
        type: String,
        //required: true,
    },
    exitDate: {
        type: String,
        //required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Reserve", reserveSchema);