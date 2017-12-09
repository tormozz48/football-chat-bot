const _ = require('lodash');
const common = require('./common');

module.exports = _.merge({}, common, {
    success: [
        () => {
            return [
                `/add - принять участие в предстоящей игре`,
                `/remove - отменить свое участие в предстоящей игре`,
                `/info - посмотреть кто пойдет на игру`,
                `/help - посмотреть список команд`
            ].join('\n');
        }
    ]
});
