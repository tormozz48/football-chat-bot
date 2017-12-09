'use strict';

class PlayersLimitExceedError extends Error {
    constructor(message = 'playersLimitExceedError', ...args) {
        super(message, ...args);
    }
}

module.exports = PlayersLimitExceedError;
