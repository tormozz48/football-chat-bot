'use strict';

class EventAlreadyRemovedError extends Error {
    constructor(message = 'eventAlreadyRemovedError', ...args) {
        super(message, ...args);
    }
}

module.exports = EventAlreadyRemovedError;
