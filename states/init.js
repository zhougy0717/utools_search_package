const State = require('./state.js') 
const SearchCmd = require('../shell_commands/search_cmd.js')
const { cmdItems, cmdHandler } = require('../command.js')

class Init extends State {
    constructor() {
        super()
        this.name = 'init'
    }

    async update (trigger, context) {
        if (trigger == 'type' && /^[:：]/.test(context.searchWord)) {
            const items = cmdItems()
            context.setItems(items)
            context.callbackSetList(items)
            const state = context.createState('cmdFiltering', 'init', [])
            context.changeState(state)
        }
        if (trigger == 'execute') {
            const mgrCmd = context.action.code
            const args = context.searchWord.split(' ')
            const cmd = new SearchCmd(mgrCmd, args, context.outputCb)
            const cmdProc = cmd.doit()
            context.cmdProc = cmdProc
            const state = context.createState('executing', cmdProc)
            context.changeState(state)
        }
        if (trigger == 'command') {
            const cmd = 'search ' + context.searchWord
            const mgrCmd = context.action.code
            const updateItemCb = context.outputCb
            await cmdHandler(cmd, mgrCmd, updateItemCb, context)
        }
    }
}

module.exports = Init
