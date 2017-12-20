'use strict';

const config = require('config');
const TelegrafWit = require('telegraf-wit');

const RECOGNIZE_COEFFICIENT = 0.95;

module.exports = (handlers) => {
    const token = process.env.BOT_WIT_TOKEN || config.get('bot.witToken');
    const wit = new TelegrafWit(token);

    return async (ctx) => {
        try {
            const result = await wit.meaning(ctx.message.text);
            const {intent = [{}]} = result.entities;
            const {confidence = 0, value = null} = intent[0];

            if (confidence > RECOGNIZE_COEFFICIENT && handlers[value]) {
                await handlers[value](ctx);
            }
        } catch (error) {
            console.error('WitAI error');
            console.error(error.message);
        }
    };
};
