const _ = require('lodash');
const common = require('./common');

module.exports = _.merge({}, common, {
    success: [
        () => {
            return [
                `/add - принять участие в предстоящей игре`,
                `/add @username - добавить игрока`,
                `/remove - отменить свое участие в предстоящей игре`,
                `/info - посмотреть кто пойдет на игру`,
                `/weather_forecast - прогноз погоды на неделю`,
                `/help - посмотреть список команд`
            ].join('\n');
        }
    ]
});
