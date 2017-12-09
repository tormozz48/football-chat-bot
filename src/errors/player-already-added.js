'use strict';

class PlayerAlreadyAddedError extends Error {
    constructor(message = 'playerAlreadyAddedError', ...args) {
        super(message, ...args);
    }
}

module.exports = PlayerAlreadyAddedError;
