'use strict';

const _ = require('lodash');
const Telegraf = require('telegraf');
const TelegrafLogger = require('telegraf-logger');
const commandParts = require('telegraf-command-parts');
const commands = require('./commands');
const recognizer = require('./wit-recognizer');

/**
 * Bot initializer
 * @param {Object} options
 * @param {String} options.token - bot token string
 * @param {Object} options.model
 */
exports.create = ({token, model}) => {
    const bot = new Telegraf(token, {
        telegram: {
            webhookReply: false
        }
    });

    const botCommandHandlers = {
        start: commands.start(model, bot),
        help: commands.help(model),
        add: commands.playerAdd(model),
        remove: commands.playerRemove(model),
        info: commands.gameInfo(model),
        event_add: commands.eventAdd(model),
        event_remove: commands.eventRemove(model),
        weather_forecast: commands.weatherForecast()
    };

    bot.telegram.getMe()
        .then((botInfo) => bot.options.username = botInfo.username)
        .catch(_.noop);

    const logger = new TelegrafLogger({
        format: '%updateType => @%username %firstName %lastName (%fromId): <%updateSubType> %content'
    });

    bot.use(logger.middleware());
    bot.use(commandParts());

    Object
        .keys(botCommandHandlers)
        .forEach((command) => bot.command(command, botCommandHandlers[command]));

    bot.on('text', recognizer(botCommandHandlers));

    bot.startPolling();

    return bot;
};
