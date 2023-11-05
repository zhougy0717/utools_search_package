const State = require('./state.js') 
const ListCmd = require('../shell_commands/list_cmd.js')

class CmdFiltering extends State {
    constructor() {
        super()
        this.lastState = 'init'
        this.myself = 'cmdFiltering'
    }

    async update (trigger, context) {
        if (trigger === 'reset') {
            return this.lastState
        }
        else if (trigger == 'execute') {
            const mgrCmd = context.action.code
            const cmd = new ListCmd(mgrCmd, [], context.outputCb)
            await cmd.doit()
            return "executing"
        }
        if (/^\s*$/.test(context.searchWord)) {
            // TODO: Move to init state
            context.setItems([])
            context.callbackSetList([])
            return this.lastState
        }
        else if (/^\s*ssh$/.test(context.searchWord.slice(1))) {
            // TODO: Move to ssh filtering state, currently not implemented yet
            return this.myself
        }
        else {
            // TODO: Move to itself
            const filtered = context.getItems().filter(x => {
                return x.title.includes(context.searchWord.slice(1))
            })
            context.callbackSetList(filtered)
            return this.myself
        }
    }
}

module.exports = CmdFiltering
