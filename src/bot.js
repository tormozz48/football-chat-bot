'use strict';

const _ = require('lodash');
const Telegraf = require('telegraf');
const TelegrafLogger = require('telegraf-logger');
const SocksAgent = require('socks5-https-client/lib/Agent');
const commandParts = require('telegraf-command-parts');
const commands = require('./commands');
const recognizer = require('./wit-recognizer');
const config = require('config');

/**
 * Bot initializer
 * @param {Object} options
 * @param {String} options.token - bot token string
 * @param {Object} options.model
 */
exports.create = ({token, model}) => {
    const proxy = config.get('proxy');
    const socksAgent = new SocksAgent({
        socksHost: process.env.TELEGRAM_PROXY_HOST || proxy.host,
        socksPort: process.env.TELEGRAM_PROXY_PORT || proxy.port,
        socksUsername: process.env.TELEGRAM_PROXY_LOGIN || proxy.login,
        socksPassword: process.env.TELEGRAM_PROXY_PASSWORD || proxy.password
    });

    const bot = new Telegraf(token, {
        telegram: {
            webhookReply: false,
            agent: socksAgent
        }
    });

    bot.telegram.deleteWebhook();

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
