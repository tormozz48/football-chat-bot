'use strict';

const _ = require('lodash');
const moment = require('moment');

function hashCode(str) {
    let hash = 0;
    if (str.length === 0) {
        return hash;
    }

    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}

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
        id: (-1) * hashCode(name),
        first_name: name,
        username: name
    });

    return existedPlayer || newPlayer;
};
