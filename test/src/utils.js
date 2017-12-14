'use strict';

const _ = require('lodash');
const utils = require('../../src/utils');

describe('src/utils', () => {
    describe('findPlayer', () => {
        function createAvailablePlayer(index, fullName = _.noop) {
            return {
                username: `some-player-${index}`,
                first_name: `first_name_${index}`,
                last_name: `last_name_${index}`,
                fullName
            };
        }

        it('should return default player if name was not given', () => {
            const player = utils.findPlayer({
                name: undefined,
                availablePlayers: [],
                defaultPlayer: {
                    id: 12345,
                    first_name: 'some-first-name',
                    username: 'some-user-name'
                },
                createPlayer: sinon.stub().returnsArg(0)
            });

            assert.deepEqual(player, {
                id: 12345,
                first_name: 'some-first-name',
                username: 'some-user-name'
            });
        });

        it('should find player in availables players by user name', () => {
            const player1 = createAvailablePlayer(1);
            const player2 = createAvailablePlayer(2);

            const player = utils.findPlayer({
                name: '@some-player-2',
                availablePlayers: [player1, player2],
                defaultPlayer: undefined,
                createPlayer: sinon.stub().returnsArg(0)
            });

            assert.deepEqual(player, player2);
        });

        it('should find player in availables players by full name', () => {
            const player1 = createAvailablePlayer(1, _.wrap('full-name1'));
            const player2 = createAvailablePlayer(2, _.wrap('full-name2'));

            const player = utils.findPlayer({
                name: 'full-name2',
                availablePlayers: [player1, player2],
                defaultPlayer: undefined,
                createPlayer: sinon.stub().returnsArg(0)
            });

            assert.deepEqual(player, player2);
        });

        it('should return new player with generated identifier', () => {
            const player = utils.findPlayer({
                name: 'some-player',
                availablePlayers: [],
                defaultPlayer: undefined,
                createPlayer: sinon.stub().returnsArg(0)
            });

            assert.equal(/^-\d+/.test(player.id), true);
            assert.equal(player.username, 'some-player');
            assert.equal(player.first_name, 'some-player');
        });
    });
});
