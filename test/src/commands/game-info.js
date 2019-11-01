'use strict';

const mongoose = require('mongoose');
const EventSchema = require('../../../src/model/event');
const gameInfoCommand = require('../../../src/commands').gameInfo;

const Event = mongoose.model('Event', EventSchema);

function createCtxStub(id) {
    return {
        message: {chat: {id}},
        reply: sinon.stub()
    };
}

function createModelStub(event) {
    return {
        Event: {
            findOne: sinon.stub().returns(new Event(event))
        }
    };
}

describe('src/commands/game-info', () => {
    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        sandbox.stub(console, 'error');
    });

    afterEach(() => sandbox.restore());

    it('should load active event for current chat', () => {
        const model = createModelStub({});
        const ctx = createCtxStub(12345);

        return gameInfoCommand(model)(ctx).then(() => {
            assert.calledOnce(model.Event.findOne);
            assert.calledWith(model.Event.findOne, {chat_id: 12345, active: true});
        });
    });

    it('should show event information', () => {
        const date = new Date('2017-12-13');
        const model = createModelStub({
            chat_id: 12345,
            active: true,
            date
        });
        const ctx = createCtxStub(12345);

        return gameInfoCommand(model)(ctx).then(() => {
            assert.calledOnce(ctx.reply);
            assert.calledWithMatch(ctx.reply, '13-12-2017');
        });
    });

    it('should print errors if error occurs', () => {
        const model = createModelStub({});
        const ctx = createCtxStub(12345);

        model.Event.findOne.rejects(new Error('some db error'));

        return gameInfoCommand(model)(ctx).then(() => {
            assert.calledTwice(console.error);
            assert.calledWith(console.error.secondCall, 'some db error');
        });
    });

    it('should reply with error if error occurs', () => {
        const model = createModelStub({});
        const ctx = createCtxStub(12345);

        model.Event.findOne.rejects(new Error('some db error'));

        return gameInfoCommand(model)(ctx).then(() => {
            assert.calledWithMatch(ctx.reply, 'some db error');
        });
    });
});
