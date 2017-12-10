'use strict';

class EventAlreadyAddedError extends Error {
    constructor(message = 'eventAlreadyAddedError', ...args) {
        super(message, ...args);
    }
}

module.exports = EventAlreadyAddedError;
