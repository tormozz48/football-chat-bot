'use strict';

const config = require('config');
const weather = require('yahoo-weather');
const Extra = require('telegraf/extra');
const answers = require('../../config/answers/commands/weather-forecast');
const utils = require('../utils');

module.exports = () => {
    const replier = utils.createReplier(answers);
    const city = config.get('weather.city');

    return async (ctx) => {
        try {
            const info = await weather(city);
            ctx.reply(replier.replySuccess()(info.item.forecast), Extra.HTML());
        } catch (error) {
            console.error('Error occured while asking for weater forecast');
            console.error(error.message);
            ctx.reply(replier.replyError()(error));
        }
    };
};
