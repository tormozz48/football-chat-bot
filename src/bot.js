'use strict';

const Telegraf = require('telegraf');
const commands = require('./commands');

const debug = require('debug')('src:bot');

exports.create = async ({token, model}) => {
    const bot = new Telegraf(token);

    bot.start((ctx) => ctx.reply('Welcome!'));

    bot.command('help', (ctx) => {
        console.log(ctx);
        ctx.reply('Try send a sticker!');
    });

    bot.command('add', commands.playerAdd(model));
    bot.command('remove', commands.playerRemove(model));

    bot.startPolling();
};