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

exports.formateDate = (date) => {
    return moment(date).format('DD-MM-YYYY');
};
