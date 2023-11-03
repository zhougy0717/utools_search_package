const State = require('./state.js') 
const SearchCmd = require('../shell_commands/search_cmd.js')
const { cmdItems } = require('../command.js')

class Init extends State {
    constructor() {
        super()
    }

    async update (trigger, context) {
        if (/^[:：]/.test(context.searchWord)) {
            // TODO: Move to cmdFiltering state
            const items = cmdItems()
            context.setItems(items)
            return "cmdFiltering"
        }
        if (trigger == 'execute') {
            const mgrCmd = context.action.code
            const args = context.searchWord.split(' ')
            const cmd = new SearchCmd(mgrCmd, args, context.outputCb)
            await cmd.doit()
            return "executing"
        }
        return "init"
    }
}

module.exports = Init
