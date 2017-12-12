'use strict';

const startCommand = require('../../../src/commands').start;

function createBotStub({me = {first_name: 'foo'}, admins = []}) {
    return {
        telegram: {
            getMe: sinon.stub().returns(me),
            getChatAdministrators: sinon.stub().returns(admins)
        }
    };
}

function createModelStub(chat) {
    return {
        Chat: {
            findOne: sinon.stub().returns(chat),
            create: sinon.stub(),
            update: sinon.stub()
        },
        User: function({first_name}) {
            this.first_name = first_name;
        }
    };
}

function createCtxStub(id, type = 'group') {
    return {
        message: {chat: {id, type}},
        reply: sinon.stub()
    };
}

describe('src/commands/start', () => {
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        sandbox.stub(console, 'error');
    });

    afterEach(() => sandbox.restore());

    it('should deal with current chat', () => {
        const bot = createBotStub({});
        const model = createModelStub();
        const ctx = createCtxStub(12345);

        return startCommand(model, bot)(ctx).then(() => {
            assert.calledOnce(model.Chat.findOne);
            assert.calledWith(model.Chat.findOne, {id: 12345});
        });
    });

    it('should take all administrators from current chat', () => {
        const bot = createBotStub({});
        const model = createModelStub();
        const ctx = createCtxStub(12345);

        return startCommand(model, bot)(ctx).then(() => {
            assert.calledOnce(bot.telegram.getChatAdministrators);
            assert.calledWith(bot.telegram.getChatAdministrators, 12345);
        });
    });

    it('shoud create new chat in db if it does not exists yet', () => {
        const bot = createBotStub({});
        const model = createModelStub();
        const ctx = createCtxStub(12345);

        return startCommand(model, bot)(ctx).then(() => {
            assert.calledOnce(model.Chat.create);
            assert.calledWith(model.Chat.create, {id: 12345, type: 'group', members: []});
        });
    });

    it('should update existed chat in db', () => {
        const bot = createBotStub({});
        const model = createModelStub({id: 12345, type: 'group'});
        const ctx = createCtxStub(12345);

        return startCommand(model, bot)(ctx).then(() => {
            assert.calledOnce(model.Chat.update);
            assert.calledWith(model.Chat.update, {id: 12345}, {members: []});
        });
    });

    it('should save administrators as members of chat', () => {
        const admins = [
            {user: {first_name: 'user1'}},
            {user: {first_name: 'user2'}}
        ];
        const bot = createBotStub({admins});
        const model = createModelStub();
        const ctx = createCtxStub(12345);

        return startCommand(model, bot)(ctx).then(() => {
            assert.calledOnce(model.Chat.create);

            const members = model.Chat.create.firstCall.args[0].members;

            assert.equal(members[0].first_name, 'user1');
            assert.equal(members[1].first_name, 'user2');
        });
    });

    it('should print errors if error occurs', () => {
        const bot = createBotStub({});
        const model = createModelStub({});
        const ctx = createCtxStub(12345);

        model.Chat.findOne.rejects(new Error('some db error'));

        return startCommand(model, bot)(ctx).then(() => {
            assert.calledTwice(console.error);
            assert.calledWith(console.error.secondCall, 'some db error');
        });
    });

    it('should respond with valid answer', () => {
        const bot = createBotStub({});
        const model = createModelStub({});
        const ctx = createCtxStub(12345);

        return startCommand(model, bot)(ctx).then(() => {
            assert.calledOnce(ctx.reply);
            assert.calledWith(ctx.reply, 'Hello. I\'m foo');
        });
    });
});
