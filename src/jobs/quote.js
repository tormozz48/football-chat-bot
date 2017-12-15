'use strict';

const config = require('config');
const cron = require('node-cron');
const utils = require('../utils');
const quotes = require('../../config/quotes/quotes');

const debug = require('debug')('src:jobs:quote');

const cronExpression = config.get('cron.quote');

module.exports = (model, bot) => {
    const replier = utils.createReplier(quotes);

    console.log(cronExpression);

    return cron.schedule(cronExpression, async function() {
        let chats = [];
        chats = await model.Chat.find({});
        chats = chats.map((chat) => chat.id);

        for (let i = 0; i < chats.length; i++) {
            try {
                debug(`send quote message to chat: ${chats[i]}`);
                await bot.telegram.sendMessage(chats[i], replier.replySuccess()());
            } catch (error) {
                console.error(error.message);
            }
        }
    }, false);
};
