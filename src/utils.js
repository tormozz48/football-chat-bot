'use strict';

const _ = require('lodash');

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
