'use strict';

const config = require('config');
const mongoose = require('mongoose');
const model = require('../../../src/model');
const UserSchema = require('../../../src/model/user');
const EventSchema = require('../../../src/model/event');
const ChatSchema = require('../../../src/model/chat');

describe('src/model/index', () => {
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        sandbox.stub(config, 'get').withArgs('mongo').returns({
            user: 'some-user',
            password: 'some-password',
            host: 'some-host',
            port: 9999,
            database: 'some-db'
        });

        sandbox.stub(mongoose, 'connect');
        sandbox.stub(mongoose, 'model');

        sandbox.stub(console, 'error');
    });

    afterEach(() => {
        delete process.env.MONGO_USER;
        delete process.env.MONGO_PASSWORD;
        sandbox.restore();
    });

    describe('initialize', () => {
        it('should use configured user for db connection', () => {
            return model.initialize().then(() => {
                assert.calledOnce(mongoose.connect);
                assert.calledWithMatch(mongoose.connect, /some-user/);
            });
        });

        it('should use configured password for db connection', () => {
            return model.initialize().then(() => {
                assert.calledOnce(mongoose.connect);
                assert.calledWithMatch(mongoose.connect, /some-password/);
            });
        });

        it('should use configured host for db connection', () => {
            return model.initialize().then(() => {
                assert.calledOnce(mongoose.connect);
                assert.calledWithMatch(mongoose.connect, /some-host/);
            });
        });

        it('should use configured port for db connection', () => {
            return model.initialize().then(() => {
                assert.calledOnce(mongoose.connect);
                assert.calledWithMatch(mongoose.connect, /9999/);
            });
        });

        it('should use configured database for db connection', () => {
            return model.initialize().then(() => {
                assert.calledOnce(mongoose.connect);
                assert.calledWithMatch(mongoose.connect, /some-db/);
            });
        });

        describe('should also override from environment variable', () => {
            it('user', () => {
                process.env.MONGO_USER = 'some-env-user';

                return model.initialize().then(() => {
                    assert.calledOnce(mongoose.connect);
                    assert.calledWithMatch(mongoose.connect, /some-env-user/);
                });
            });

            it('password', () => {
                process.env.MONGO_PASSWORD = 'some-env-password';

                return model.initialize().then(() => {
                    assert.calledOnce(mongoose.connect);
                    assert.calledWithMatch(mongoose.connect, /some-env-password/);
                });
            });
        });

        it('should connect via valid connection string', () => {
            return model.initialize().then(() => {
                assert.calledOnce(mongoose.connect);
                assert.calledWith(
                    mongoose.connect,
                    'mongodb://some-user:some-password@some-host:9999/some-db'
                );
            });
        });

        describe('db connection failed', () => {
            beforeEach(() => {
                mongoose.connect.rejects(new Error('some connection error'));
            });

            it('should print error into console', () => {
                return model.initialize().catch(() => {
                    assert.calledTwice(console.error);
                    assert.calledWith(console.error.firstCall, 'Database connection error');
                    assert.calledWith(console.error.secondCall, 'some connection error');
                });
            });

            /*
            it('should throw error', () => {
                return model.initialize().catch((error) => {
                    console.log(error);
                    assert.calledWith(error.message, 'Database connection error');
                });
            });
            */
        });

        describe('initialize models', () => {
            it('should initialize user model', () => {
                return model.initialize().then(() => {
                    assert.calledWith(mongoose.model, 'User', UserSchema);
                });
            });

            it('should initialize event model', () => {
                return model.initialize().then(() => {
                    assert.calledWith(mongoose.model, 'Event', EventSchema);
                });
            });

            it('should initialize chat model', () => {
                return model.initialize().then(() => {
                    assert.calledWith(mongoose.model, 'Chat', ChatSchema);
                });
            });
        });

        it('should return object with initialized model classes', () => {
            const userModel = sinon.stub();
            const eventModel = sinon.stub();
            const chatModel = sinon.stub();

            mongoose.model.withArgs('User').returns(userModel);
            mongoose.model.withArgs('Event').returns(eventModel);
            mongoose.model.withArgs('Chat').returns(chatModel);

            return model.initialize().then((result) => {
                assert.instanceOf(result, Object);

                assert.equal(result.User, userModel);
                assert.equal(result.Event, eventModel);
                assert.equal(result.Chat, chatModel);
            });
        });
    });
});
