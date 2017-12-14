'use strict';

const errors = require('../errors/index');
const answers = require('../../config/answers/commands/player-remove');
const utils = require('../utils');
const playerCommon = require('./common/player');

module.exports = (model) => {
    const replier = utils.createReplier(answers);

    function handleError(error, player) {
        console.error('Error occurred on removing player');
        console.error(error.message);

        if (error instanceof errors.PlayerAlreadyRemovedError) {
            return replier.reply(error.message)(player.fullName());
        } else {
            return replier.replyError()();
        }
    }

    return playerCommon({model, replier, action: 'removePlayer', handleError});
};
