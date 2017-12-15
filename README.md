# football-chat-bot
Telegram bot for football weekend chat

[![Build Status](https://travis-ci.org/tormozz48/football-chat-bot.svg?branch=master)](https://travis-ci.org/tormozz48/football-chat-bot)
[![Coverage Status](https://img.shields.io/coveralls/tormozz48/football-chat-bot.svg?style=flat)](https://coveralls.io/r/tormozz48/football-chat-bot?branch=master)
[![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/tormozz48/football-chat-bot/)
[![Dependency Status](https://david-dm.org/tormozz48/football-chat-bot.svg)](https://david-dm.org/tormozz48/football-chat-bot)

## Installation

* Clone repository: `git clone https://github.com/tormozz48/football-chat-bot.git`
* Move to repo folder: `cd football-chat-bot`
* Install npm dependencies: `npm install`

## Configuration

Configuration files are:

* [default](./config/default.js) - default configuration file
* [production](./config/production.js) - configuration file for production environment

To use production configuration you should launch application with `NODE_ENV` envrironment variable equal to `production`. You can read more about configuration files [here](https://www.npmjs.com/package/config).

### Paramenters

* `port` - http server port number

* `bot` - telegram bot settings
    * `token` - unique bot token. Read more here: https://tlgrm.ru/docs/bots

* `cron` -
    * `serverPing` - cron expression for setting http-server ping interval

* `mongo` - mongo database connection parameters.
    * `user` - mongo database user.
    * `password` - mongo database password.
    * `host` - database host. Default: `127.0.0.1`
    * `port` - database port. Default: `27017`
    * `database` - name of database.

* `eventDate` - function which returns date of new created event.

Some of configuration parameters may be overrided by environment variables:

* `BOT_TOKEN` overrides `token` parameter in `bot` config section.
* `MONGO_USER` overrides `user` parameter in mongo database section.
* `MONGO_PASSWORD` overrides `password` parameter in mongo database section.

## Launch

For development purposes it suitable to launch application in dev-mode
with embedded [nodemon](https://www.npmjs.com/package/nodemon) hot reload functionality.
```bash
npm run start-dev
```

For launch in production mode you should use:
```bash
npm run start-prod
```

## Development

* Launch code linting tool: `npm run lint`.
* Launch unit-tests: `npm run test-unit`.
* Launch code linting and unit-tests together: `npm test`.
* Launch unit-tests with code coverage calculation: `npm run cover`.

Also [code linter](https://eslint.org) checks your code before every commit.

## License

MIT
