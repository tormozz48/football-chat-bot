'use strict';

const _ = require('lodash');
const errors = require('../../../src/errors');
const utils = require('../../../src/utils');
const playerRemoveCommand = require('../../../src/commands').playerRemove;

function createReplierStub() {
    return {
        reply: sinon.stub().returns(_.noop),
        replySuccess: sinon.stub().returns(_.noop),
        replyError: sinon.stub().returns(_.noop)
    };
}

function createCtxStub(id, command = {}) {
    return {
        message: {chat: {id}},
        state: {command},
        reply: sinon.stub()
    };
}

function createModelStub(chatId, eventStub = {}) {
    return {
        Chat: {findOne: sinon.stub().returns({id: chatId})},
        Event: {findOne: sinon.stub().returns(eventStub)},
        User: function() {}
    };
}

describe('src/commands/player-remove', () => {
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        sandbox.stub(utils, 'findOrCreatePlayer');
        sandbox.stub(utils, 'createReplier').returns(createReplierStub());
        sandbox.stub(console, 'error');
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should deal with current chat', () => {
        const model = createModelStub(12345);
        const ctx = createCtxStub(12345);

        return playerRemoveCommand(model)(ctx).then(() => {
            assert.calledOnce(model.Chat.findOne);
            assert.calledWith(model.Chat.findOne, {id: 12345});
        });
    });

    it('should find active event for current chat', () => {
        const model = createModelStub(12345);
        const ctx = createCtxStub(12345);

        return playerRemoveCommand(model)(ctx).then(() => {
            assert.calledOnce(model.Event.findOne);
            assert.calledWith(model.Event.findOne, {chat_id: 12345, active: true});
        });
    });

    it('should find player from given message arguments', () => {
        const model = createModelStub(12345);
        const ctx = createCtxStub(12345, {args: 'some-player'});

        return playerRemoveCommand(model)(ctx).then(() => {
            assert.calledOnce(utils.findOrCreatePlayer);
            assert.calledWithMatch(utils.findOrCreatePlayer, {name: 'some-player'});
        });
    });

    it('should find player from trimmed message arguments', () => {
        const model = createModelStub(12345);
        const ctx = createCtxStub(12345, {args: '  some-player  '});

        return playerRemoveCommand(model)(ctx).then(() => {
            assert.calledOnce(utils.findOrCreatePlayer);
            assert.calledWithMatch(utils.findOrCreatePlayer, {name: 'some-player'});
        });
    });

    it('should deattach player from event', () => {
        const model = createModelStub(12345);
        const ctx = createCtxStub(12345, {args: 'some-player'});

        const eventStub = {
            removePlayer: sandbox.stub(),
            save: sandbox.stub()
        };
        model.Event.findOne.returns(eventStub);

        utils.findOrCreatePlayer.returns({username: 'some-username', fullName: _.noop});

        return playerRemoveCommand(model)(ctx).then(() => {
            assert.calledOnce(eventStub.removePlayer);
            assert.calledWithMatch(eventStub.removePlayer, {username: 'some-username'});
        });
    });

    it('should save event', () => {
        const model = createModelStub(12345);
        const ctx = createCtxStub(12345, {args: 'some-player'});

        const eventStub = {
            removePlayer: sandbox.stub(),
            save: sandbox.stub()
        };
        model.Event.findOne.returns(eventStub);

        utils.findOrCreatePlayer.returns({username: 'some-username', fullName: _.noop});

        return playerRemoveCommand(model)(ctx).then(() => {
            assert.calledOnce(eventStub.save);
        });
    });

    it('should reply with success answer', () => {
        const model = createModelStub(12345);
        const ctx = createCtxStub(12345, {args: 'some-player'});

        model.Event.findOne.returns({
            removePlayer: sandbox.stub(),
            save: sandbox.stub()
        });

        const replierStub = {replySuccess: sandbox.stub().returns(_.noop)};
        utils.createReplier.returns(replierStub);

        utils.findOrCreatePlayer.returns({username: 'some-username', fullName: _.noop});

        return playerRemoveCommand(model)(ctx).then(() => {
            assert.calledOnce(replierStub.replySuccess);
        });
    });

    it('should print errors if error occur on adding player', () => {
        const model = createModelStub(12345);
        const ctx = createCtxStub(12345, {args: 'some-player'});

        model.Chat.findOne.rejects(new Error('some db error'));

        return playerRemoveCommand(model)(ctx).then(() => {
            assert.calledTwice(console.error);
            assert.calledWith(console.error.secondCall, 'some db error');
        });
    });

    it('should reply with special answer on "PlayerAlreadyAddedError"', () => {
        const model = createModelStub(12345);
        const ctx = createCtxStub(12345, {args: 'some-player'});

        const replierStub = {reply: sandbox.stub().returns(_.noop)};
        utils.createReplier.returns(replierStub);

        model.Event.findOne.returns({
            removePlayer: sandbox.stub().throws(new errors.PlayerAlreadyRemovedError()),
            save: sandbox.stub()
        });
        utils.findOrCreatePlayer.returns({username: 'some-username', fullName: _.noop});

        return playerRemoveCommand(model)(ctx).then(() => {
            assert.calledOnce(replierStub.reply);
            assert.calledWith(replierStub.reply, 'playerAlreadyRemovedError');
        });
    });

    it('shoud reply with common error message on other errors', () => {
        const model = createModelStub(12345);
        const ctx = createCtxStub(12345, {args: 'some-player'});

        const replierStub = {replyError: sandbox.stub().returns(_.noop)};
        utils.createReplier.returns(replierStub);

        model.Chat.findOne.rejects(new Error('some db error'));

        return playerRemoveCommand(model)(ctx).then(() => {
            assert.calledOnce(replierStub.replyError);
        });
    });
});
