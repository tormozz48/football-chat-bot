'use strict';

const config = require('config');
const mongoose = require('mongoose');
const utils = require('../../../src/utils');
const ChatSchema = require('../../../src/model/chat');
const EventSchema = require('../../../src/model/event');
const eventAddCommand = require('../../../src/commands').eventAdd;

const Chat = mongoose.model('Chat', ChatSchema);
const Event = mongoose.model('Event', EventSchema);

function createCtxStub(id) {
    return {
        message: {chat: {id}},
        reply: sinon.stub()
    };
}

describe('src/commands/event-add', () => {
    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        sandbox.stub(config, 'get').returns(() => {});

        sandbox.stub(Chat, 'findOne');

        sandbox.stub(Event, 'findOne');
        sandbox.stub(Event, 'updateMany');
        sandbox.stub(Event, 'create');

        sandbox.stub(console, 'error');
    });

    afterEach(() => sandbox.restore());

    it('should take event date from config', () => {
        const ctx = createCtxStub();
        const model = {Chat, Event};

        Chat.findOne.resolves({});

        return eventAddCommand(model)(ctx).then(() => {
            assert.calledOnce(config.get);
            assert.calledWith(config.get, 'eventDate');
        });
    });

    it('should deal with current chat', () => {
        const ctx = createCtxStub(12345);
        const model = {Chat, Event};

        Chat.findOne.resolves({});

        return eventAddCommand(model)(ctx).then(() => {
            assert.calledOnce(Chat.findOne);
            assert.calledWith(Chat.findOne, {id: 12345});
        });
    });

    it('should check for existed event for given date', () => {
        const ctx = createCtxStub();
        const model = {Chat, Event};

        Chat.findOne.resolves({});

        const date = Date.now();
        config.get.withArgs('eventDate').returns(() => date);

        return eventAddCommand(model)(ctx).then(() => {
            assert.calledOnce(Event.findOne);
            assert.equal(Event.findOne.firstCall.args[0].date, date);
        });
    });

    it('should handle error if event already exists', () => {
        const ctx = createCtxStub();
        const model = {Chat, Event};

        Chat.findOne.resolves({});
        Event.findOne.resolves({});
        config.get.withArgs('eventDate').returns(() => Date.now());

        const replier = {reply: sandbox.stub().returns(() => {})};
        sandbox.stub(utils, 'createReplier').returns(replier);

        return eventAddCommand(model)(ctx).then(() => {
            assert.calledWithMatch(replier.reply, 'eventAlreadyAddedError');
        });
    });

    it('should make inactive all existed events before new event creation', () => {
        const ctx = createCtxStub();
        const model = {Chat, Event};

        Chat.findOne.resolves({id: 12345});
        config.get.withArgs('eventDate').returns(() => Date.now());

        return eventAddCommand(model)(ctx).then(() => {
            assert.calledOnce(Event.updateMany);
            assert.calledWithMatch(
                Event.updateMany,
                {chat_id: 12345, active: true},
                {active: false}
            );
        });
    });

    it('should create new event for given date', () => {
        const ctx = createCtxStub();
        const model = {Chat, Event};

        Chat.findOne.resolves({id: 12345});

        const date = new Date('2017-12-13');
        config.get.withArgs('eventDate').returns(() => date);

        return eventAddCommand(model)(ctx).then(() => {
            assert.calledOnce(Event.create);
            assert.calledWithMatch(Event.create, {chat_id: 12345, date});
        });
    });

    it('should display information about created event', () => {
        const ctx = createCtxStub();
        const model = {Chat, Event};

        Chat.findOne.resolves({});

        const date = new Date('2017-12-13');
        config.get.withArgs('eventDate').returns(() => date);

        return eventAddCommand(model)(ctx).then(() => {
            assert.calledWithMatch(ctx.reply, '13-12-2017');
            assert.calledWithMatch(ctx.reply, '/add');
            assert.calledWithMatch(ctx.reply, '/remove');
            assert.calledWithMatch(ctx.reply, '/info');
        });
    });

    it('should print errors if error occurs', () => {
        const ctx = createCtxStub();
        const model = {Chat, Event};

        Chat.findOne.rejects(new Error('some db error'));

        return eventAddCommand(model)(ctx).then(() => {
            assert.calledTwice(console.error);
            assert.calledWith(console.error.secondCall, 'some db error');
        });
    });

    it('should reply with error if error occurs', () => {
        const ctx = createCtxStub();
        const model = {Chat, Event};

        Chat.findOne.rejects(new Error('some db error'));

        return eventAddCommand(model)(ctx).then(() => {
            assert.calledWithMatch(ctx.reply, 'some db error');
        });
    });
});
