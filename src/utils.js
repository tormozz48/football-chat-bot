'use strict';

const _ = require('lodash');
const moment = require('moment');
const generate = require('nanoid/generate');

exports.createReplier = (answers) => {
    function getRandomReply(groupKey) {
        return _.sample(_.get(answers, groupKey));
    }

    return {
        reply: getRandomReply,
        replaySuccess: () => getRandomReply('success'),
        replyError: () => getRandomReply('error')
    };
};

/**
 * Transforms date to human readable format
 * @param {Date} date
 * @returns {String}
 */
exports.formateDate = (date, format = 'DD-MM-YYYY') => {
    return moment(date).format(format);
};

/**
 *
 * @param {Object} param
 * @param {String} param.name - name of user should be find for
 * @param {Object[]} param.availablePlayers - array if available users
 * @param {Object} param.defaultPlayer - user data for default player
 * @param {Function} param.createPlayer - function which creates new User from user data
 */
exports.findPlayer = ({name, availablePlayers, defaultPlayer, createPlayer}) => {
    if (!name) {
        return createPlayer(defaultPlayer);
    }

    const existedPlayer = _.find(availablePlayers, (member) => {
        return [`@${member.username}`, `${member.fullName()}`].includes(name);
    });

    const newPlayer = createPlayer({
        id: (-1) * generate('1234567890', 10),
        first_name: name,
        username: name
    });

    return existedPlayer || newPlayer;
};

