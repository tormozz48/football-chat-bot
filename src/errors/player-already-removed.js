'use strict';

class PlayerAlreadyRemovedError extends Error {
    constructor(message = 'playerAlreadyRemovedError', ...args) {
        super(message, ...args);
    }
}

module.exports = PlayerAlreadyRemovedError;
