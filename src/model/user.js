'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id: {type: Number},
    is_bot: {type: Boolean, default: false},
    first_name: {type: String, default: ''},
    last_name: {type: String, default: ''},
    username: String,
    language_code: String
});

UserSchema.methods.fullName = function() {
    return `${this.first_name} ${this.last_name}`;
};

module.exports = UserSchema;
