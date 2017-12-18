const _ = require('lodash');
const common = require('./common');
const codes = require('../../weather/codes');

function convertForecastItem(item) {
    return `* ${item.date} мин. ${item.low} &#x2103; макс. ${item.high} &#x2103; ${codes[+item.code]}`;
}

module.exports = _.merge({}, common, {
    success: [
        (forecast) => {
            return '<strong>Прогноз погоды:</strong>\n\n' +
                forecast
                    .map(convertForecastItem)
                    .join('\n')
            ;
        }
    ]
});
