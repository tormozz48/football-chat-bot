'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = require('./user');

const ChatSchema = new Schema({
    id: {type: Number, required: true, unique: true},
    type: String,
    members: {type: [UserSchema], default: []}
});

module.exports = ChatSchema;
