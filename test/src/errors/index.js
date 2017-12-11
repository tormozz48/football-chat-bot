'use strict';

const errors = require('../../../src/errors');

describe('src/errors/index', () => {
    it('PlayerAlreadyAddedError should have valid error message', () => {
        const error = new errors.PlayerAlreadyAddedError();
        assert.equal(error.message, 'playerAlreadyAddedError');
    });

    it('PlayerAlreadyRemovedError should have valid error message', () => {
        const error = new errors.PlayerAlreadyRemovedError();
        assert.equal(error.message, 'playerAlreadyRemovedError');
    });

    it('PlayersLimitExceedError should have valid error message', () => {
        const error = new errors.PlayersLimitExceedError();
        assert.equal(error.message, 'playersLimitExceedError');
    });

    it('EventAlreadyAddedError should have valid error message', () => {
        const error = new errors.EventAlreadyAddedError();
        assert.equal(error.message, 'eventAlreadyAddedError');
    });

    it('EventAlreadyRemovedError should have valid error message', () => {
        const error = new errors.EventAlreadyRemovedError();
        assert.equal(error.message, 'eventAlreadyRemovedError');
    });
});
