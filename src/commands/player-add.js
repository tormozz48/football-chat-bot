'use strict';

const errors = require('../errors/index');
const answers = require('../../config/answers/commands/player-add');
const utils = require('../utils');
const playerCommon = require('./common/player');

module.exports = (model) => {
    const replier = utils.createReplier(answers);

    function handleError(error, player) {
        console.error('Error occurred on adding player');
        console.error(error.message);

        if (error instanceof errors.PlayerAlreadyAddedError ||
            error instanceof errors.PlayersLimitExceedError) {
            return replier.reply(error.message)(player.fullName());
        } else {
            return replier.replyError()(error);
        }
    }

    return playerCommon({model, replier, action: 'addPlayer', handleError});
};
