const State = require('./state.js') 
const SearchCmd = require('../shell_commands/search_cmd.js')
const { cmdItems } = require('../command.js')

class Init extends State {
    constructor() {
        super()
        this.name = 'init'
    }

    async update (trigger, context) {
        if (trigger == 'type' && /^[:：]/.test(context.searchWord)) {
            // TODO: Move to cmdFiltering state
            const items = cmdItems()
            context.setItems(items)
            context.callbackSetList(items)
            return context.createState('cmdFiltering')
        }
        if (trigger == 'execute') {
            const mgrCmd = context.action.code
            const args = context.searchWord.split(' ')
            const cmd = new SearchCmd(mgrCmd, args, context.outputCb)
            cmd.doit()
            return context.createState('executing')
        }
        return this
    }
}

module.exports = Init
