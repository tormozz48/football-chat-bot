'use strict';

const mongoose = require('mongoose');
const model = require('../../../src/model');

describe('src/model/user', () => {
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        sandbox.stub(mongoose, 'connect');
    });

    afterEach(() => sandbox.restore());

    it('should have default empty first name', () => {
        return model.initialize().then(({User}) => {
            const user = new User({id: 12345});
            assert.equal(user.first_name, '');
        });
    });

    it('should have default empty last name', () => {
        return model.initialize().then(({User}) => {
            const user = new User({id: 12345});
            assert.equal(user.last_name, '');
        });
    });

    it('should not be bot by default', () => {
        return model.initialize().then(({User}) => {
            const user = new User({id: 12345});
            assert.equal(user.is_bot, false);
        });
    });

    it('should return user full name', () => {
        return model.initialize().then(({User}) => {
            const user = new User({
                id: 12345,
                first_name: 'some-first-name',
                last_name: 'some-last-name'
            });

            assert.equal(user.fullName(), 'some-first-name some-last-name');
        });
    });
});
