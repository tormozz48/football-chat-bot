'use strict';

const _ = require('lodash');
const config = require('config');
const mongoose = require('mongoose');
const utils = require('../../../src/utils');
const ChatSchema = require('../../../src/model/chat');
const EventSchema = require('../../../src/model/event');
const eventRemoveCommand = require('../../../src/commands').eventRemove;

const Chat = mongoose.model('Chat', ChatSchema);
const Event = mongoose.model('Event', EventSchema);

function createCtxStub(id) {
    return {
        message: {chat: {id}},
        reply: sinon.stub()
    };
}

describe('src/commands/event-remove', () => {
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        sandbox.stub(config, 'get').returns(_.noop);

        sandbox.stub(Chat, 'findOne');
        sandbox.stub(Event, 'findOne');

        sandbox.stub(console, 'error');
    });

    afterEach(() => sandbox.restore());

    it('should take event date from config', () => {
        const ctx = createCtxStub();
        const model = {Chat, Event};

        Chat.findOne.resolves({});

        return eventRemoveCommand(model)(ctx).then(() => {
            assert.calledOnce(config.get);
            assert.calledWith(config.get, 'eventDate');
        });
    });

    it('should deal with current chat', () => {
        const ctx = createCtxStub(12345);
        const model = {Chat, Event};

        Chat.findOne.resolves({});

        return eventRemoveCommand(model)(ctx).then(() => {
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

        return eventRemoveCommand(model)(ctx).then(() => {
            assert.calledOnce(Event.findOne);
            assert.equal(Event.findOne.firstCall.args[0].date, date);
        });
    });

    it('should handle error if event does not exist', () => {
        const ctx = createCtxStub();
        const model = {Chat, Event};

        const replier = {reply: sandbox.stub().returns(_.noop)};
        sandbox.stub(utils, 'createReplier').returns(replier);

        const date = Date.now();
        config.get.withArgs('eventDate').returns(() => date);
        Chat.findOne.resolves({id: 12345});
        Event.findOne.withArgs({chat_id: 12345, active: true, date}).returns(null);

        return eventRemoveCommand(model)(ctx).then(() => {
            assert.calledOnce(replier.reply);
            assert.calledWith(replier.reply, 'eventAlreadyRemovedError');
        });
    });

    it('should remove existed event', () => {
        const ctx = createCtxStub();
        const model = {Chat, Event};

        const date = Date.now();
        config.get.withArgs('eventDate').returns(() => date);
        Chat.findOne.resolves({id: 12345});

        const eventStub = {remove: sinon.stub()};
        Event
            .findOne.withArgs({chat_id: 12345, active: true, date})
            .returns(eventStub);

        return eventRemoveCommand(model)(ctx).then(() => {
            assert.calledOnce(eventStub.remove);
        });
    });

    it('should reply about removed event', () => {
        const ctx = createCtxStub();
        const model = {Chat, Event};

        const date = '2017-12-14';
        config.get.withArgs('eventDate').returns(() => date);
        Chat.findOne.resolves({id: 12345});

        const eventStub = {remove: sinon.stub()};
        Event
            .findOne.withArgs({chat_id: 12345, active: true, date})
            .returns(eventStub);

        return eventRemoveCommand(model)(ctx).then(() => {
            assert.calledWithMatch(ctx.reply, '14-12-2017');
        });
    });

    it('should print errors if error occurs', () => {
        const ctx = createCtxStub();
        const model = {Chat, Event};

        Chat.findOne.rejects(new Error('some db error'));

        return eventRemoveCommand(model)(ctx).then(() => {
            assert.calledTwice(console.error);
            assert.calledWith(console.error.secondCall, 'some db error');
        });
    });

    it('should reply with error if error occurs', () => {
        const ctx = createCtxStub();
        const model = {Chat, Event};

        Chat.findOne.rejects(new Error('some db error'));

        return eventRemoveCommand(model)(ctx).then(() => {
            assert.calledWithMatch(ctx.reply, 'some db error');
        });
    });
});
