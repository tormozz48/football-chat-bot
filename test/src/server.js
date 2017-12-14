'use strict';

const request = require('supertest');
const server = require('../../src/server');

describe('src/server', () => {
    let app = null;

    beforeEach(() => {
        app = server.start();
    });

    it('should responde for get: /ping request', () => {
        return request(app)
            .get('/ping')
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {
                assert.deepEqual(response.body, {status: 'ok'});
            });
    });

    afterEach(() => app.close());
});
