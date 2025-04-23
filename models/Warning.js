const mongoose = require('mongoose');

const warningSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    file: String,
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Warning', warningSchema);