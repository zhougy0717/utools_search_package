const npmHandlers = require('./npm_handlers.js')
const brewHandlers = require('./brew_handlers.js')
const g_cmdArgs = {
    brew: {
        enter: brewHandlers.enterHandler,
        handleCmdOutput: brewHandlers.searchHandler,
        subcmdArgs: brewHandlers.getSubCmd,
    },
    npm: {
        enter: npmHandlers.enterHandler,
        handleCmdOutput: npmHandlers.searchHandler,
        subcmdArgs: npmHandlers.getSubCmd
    }
}

module.exports = g_cmdArgs