'use strict';

const Telegraf = require('telegraf');
const bot = require('../../src/bot');
const commands = require('../../src/commands');

describe('src/bot', () => {
    const sanbox = sinon.sandbox.create();

    beforeEach(() => {
        sanbox.stub(commands, 'start');
        sanbox.stub(commands, 'help');
        sanbox.stub(commands, 'gameInfo');
        sanbox.stub(commands, 'playerAdd');
        sanbox.stub(commands, 'playerRemove');
        sanbox.stub(commands, 'eventAdd');
        sanbox.stub(commands, 'eventRemove');

        sanbox.stub(Telegraf.prototype, 'startPolling');
    });

    afterEach(() => sanbox.restore());

    it('should implement /start command', () => {
        const modelStub = sinon.stub();

        const _bot = bot.create({token: '12345', model: modelStub});

        assert.calledOnce(commands.start);
        assert.calledWith(commands.start, modelStub, _bot);
    });

    it('should implement /help command', () => {
        const modelStub = sinon.stub();

        bot.create({token: '12345', model: modelStub});

        assert.calledOnce(commands.help);
        assert.calledWith(commands.help, modelStub);
    });

    it('should implement /add command', () => {
        const modelStub = sinon.stub();

        bot.create({token: '12345', model: modelStub});

        assert.calledOnce(commands.playerAdd);
        assert.calledWith(commands.playerAdd, modelStub);
    });

    it('should implement /remove command', () => {
        const modelStub = sinon.stub();

        bot.create({token: '12345', model: modelStub});

        assert.calledOnce(commands.playerRemove);
        assert.calledWith(commands.playerRemove, modelStub);
    });

    it('should implement /info command', () => {
        const modelStub = sinon.stub();

        bot.create({token: '12345', model: modelStub});

        assert.calledOnce(commands.gameInfo);
        assert.calledWith(commands.gameInfo, modelStub);
    });

    it('should implement /event_add command', () => {
        const modelStub = sinon.stub();

        bot.create({token: '12345', model: modelStub});

        assert.calledOnce(commands.eventAdd);
        assert.calledWith(commands.eventAdd, modelStub);
    });

    it('should implement /event_remove command', () => {
        const modelStub = sinon.stub();

        bot.create({token: '12345', model: modelStub});

        assert.calledOnce(commands.eventRemove);
        assert.calledWith(commands.eventRemove, modelStub);
    });
});
