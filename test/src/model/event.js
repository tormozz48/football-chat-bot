'use strict';

const mongoose = require('mongoose');
const errors = require('../../../src/errors');
const model = require('../../../src/model');

describe('src/model/event', () => {
    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        sandbox.stub(mongoose, 'connect');
    });

    afterEach(() => sandbox.restore());

    describe('addPlayer', () => {
        it('should attach new player to event', () => {
            return model.initialize().then(({Event, User}) => {
                const event = new Event({});

                assert.equal(event.getPlayersAmount(), 0);
                event.addPlayer(new User({username: 'some-player'}));
                assert.equal(event.getPlayersAmount(), 1);
            });
        });

        it('should not attach existed player', () => {
            let event;

            return model.initialize()
                .then(({Event, User}) => {
                    event = new Event({});
                    event.addPlayer(new User({id: 12345, username: 'some-player'}));
                    event.addPlayer(new User({id: 12345, username: 'some-player'}));
                })
                .catch((error) => {
                    assert.instanceOf(error, errors.PlayerAlreadyAddedError);
                    assert.equal(event.getPlayersAmount(), 1);
                });
        });

        it('should not exceed players limit', () => {
            let event;

            return model.initialize()
                .then(({Event, User}) => {
                    event = new Event({players_max: 1});
                    event.addPlayer(new User({id: 12345, username: 'some-player'}));
                    event.addPlayer(new User({id: 67890, username: 'some-player'}));
                })
                .catch((error) => {
                    assert.instanceOf(error, errors.PlayersLimitExceedError);
                    assert.equal(event.getPlayersAmount(), 1);
                });
        });
    });

    describe('removePlayer', () => {
        it('should deattach existed player from event', () => {
            return model.initialize().then(({Event, User}) => {
                const event = new Event({});

                event.addPlayer(new User({id: 12345, username: 'some-player'}));
                assert.equal(event.getPlayersAmount(), 1);
                event.removePlayer(new User({id: 12345, username: 'some-player'}));
                assert.equal(event.getPlayersAmount(), 0);
            });
        });

        it('should throw error if player does not attached', () => {
            let event;

            return model.initialize()
                .then(({Event, User}) => {
                    event = new Event({});
                    event.addPlayer(new User({id: 12345, username: 'some-player'}));
                    event.removePlayer(new User({id: 67890, username: 'some-player'}));
                })
                .catch((error) => {
                    assert.instanceOf(error, errors.PlayerAlreadyRemovedError);
                    assert.equal(event.getPlayersAmount(), 1);
                });
        });
    });
});
