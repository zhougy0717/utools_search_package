const State = require('./state.js') 
const ListCmd = require('../shell_commands/list_cmd.js')

class CmdFiltering extends State {
    constructor() {
        super()
    }

    async update (trigger, context) {
        if (trigger === 'reset') {
            return "init"
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
            return "init"
        }
        else if (/^\s*ssh$/.test(context.searchWord.slice(1))) {
            // TODO: Move to ssh filtering state, currently not implemented yet
            return "cmdFiltering"
        }
        else {
            // TODO: Move to itself
            const filtered = context.getItems().filter(x => {
                return x.title.includes(context.searchWord.slice(1))
            })
            context.callbackSetList(filtered)
            return "cmdFiltering"
        }
    }
}

module.exports = CmdFiltering
