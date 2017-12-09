'use strict';

const Telegraf = require('telegraf');
const commands = require('./commands');

const debug = require('debug')('src:bot');

exports.create = async ({token, model}) => {
    const bot = new Telegraf(token);

    bot.start((ctx) => ctx.reply('Welcome!'));

    bot.use(async (ctx, next) => {
        if (/^\//.test(ctx.message)) {
            const {first_name, last_name} = ctx.from;
            debug(`received command ${ctx.message} from ${first_name} ${last_name}`);
        }

        await next();
    });

    bot.command('help', commands.help(model)); // /help
    bot.command('add', commands.playerAdd(model)); // /add - add player to game
    bot.command('remove', commands.playerRemove(model)); // /remove - remove player from game
    bot.command('info', commands.gameInfo(model)); // /info - get game info

    bot.startPolling();
};