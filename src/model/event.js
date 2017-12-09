'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = require('./user');
const errors = require('../errors/index');

const MAX_PLAYERS_AMOUNT = 12

const EventSchema = new Schema({
    id: Number,
    date: {type: Date, default: new Date()},
    players: {type: [UserSchema], default: []},
    players_max: {type: Number, default: MAX_PLAYERS_AMOUNT},
    active: {type: Boolean, default: true}
});

EventSchema.methods.addPlayer = function(player) {
    const existed = _.find(this.players, {id: player.id});

    if (existed) {
        throw new errors.PlayerAlreadyAddedError();
    }

    if (this.getVacanciesAmount() === 0) {
        throw new errors.PlayersLimitExceedError();
    }

    this.players.push(player);
};

EventSchema.methods.removePlayer = function(player) {
    const existed = _.find(this.players, {id: player.id});

    if (!existed) {
        throw new errors.PlayerAlreadyRemovedError();
    }

    this.players = this.players.filter((_player) => _player.id !== player.id);
};

EventSchema.methods.getPlayersAmount = function() {
    return this.players.length;
};

EventSchema.methods.getVacanciesAmount = function() {
    return this.players_max - this.getPlayersAmount();
};

module.exports = EventSchema;