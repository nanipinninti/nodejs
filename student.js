const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
},{collection : "login"});

const StudentModel = mongoose.model('Student', StudentSchema);
module.exports = StudentModel;
