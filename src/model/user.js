'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id: Number,
    is_bot: Boolean,
    first_name: String,
    last_name: String,
    username: String,
    language_code: String
});

UserSchema.methods.fullName = function() {
    return `${this.first_name} ${this.last_name}`;
};

module.exports = UserSchema;
