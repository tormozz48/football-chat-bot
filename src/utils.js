'use strict';

const _ = require('lodash');
const moment = require('moment');

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
