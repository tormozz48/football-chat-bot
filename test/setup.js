'use strict';

const chai = require('chai');
const sinon = require('sinon');
const Promise = require('bluebird');

Promise.config({
    longStackTraces: true
});

global.sinon = sinon;
global.assert = chai.assert;

sinon.assert.expose(chai.assert, {prefix: ''});
