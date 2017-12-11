'use strict';

const debug = require('debug')('src:commands:start');

module.exports = (model, bot) => {
    return async (ctx) => {
        const me = await bot.telegram.getMe();
        const {id, type} = ctx.message.chat;

        debug(`chat id: ${id} type: ${type}`);

        try {
            const chat = await model.Chat.findOne({id});
            const admins = await bot.telegram.getChatAdministrators(id);

            const members = admins
                .map((admin) => admin.user)
                .map((admin) => new model.User(admin));

            chat
                ? await model.Chat.update({id}, {members})
                : await model.Chat.create({id, type, members});
        } catch (error) {
            console.error('Error occured on start bot');
            console.error(error.message);
        }

        ctx.reply(`Hello. I'm crazy footballer ${me.first_name}`);
    };
};
