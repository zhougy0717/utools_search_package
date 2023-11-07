const State = require('./state.js') 
const ListCmd = require('../shell_commands/list_cmd.js')

class CmdFiltering extends State {
    constructor(lastState) {
        super()
        this.lastState = 'init'
        this.myself = 'cmdFiltering'
        this.name = 'cmdFiltering'
    }

    async update (trigger, context) {
        if (trigger === 'reset') {
            return context.createState(this.lastState)
        }
        else if (trigger == 'execute') {
            if (/\s*ssh .*/.test(searchWord.slice(1))) {
                const cmd = new TestSshCmd(args.slice(1))
                await cmd.doit()
            }
            else if (/\s*list .*/.test(searchWord.slice(1))) {
                const mgrCmd = context.action.code
                const cmd = new ListCmd(mgrCmd, [], context.outputCb)
                await cmd.doit()
            }
            return context.createState('executing')
        }
        if (/^\s*$/.test(context.searchWord)) {
            // TODO: Move to init state
            context.setItems([])
            context.callbackSetList([])
            return context.createState('init')
        }
        else if (/^\s*ssh$/.test(context.searchWord.slice(1))) {
            // TODO: Move to ssh filtering state, currently not implemented yet
            return this
        }
        else {
            // TODO: Move to itself
            const filtered = context.getItems().filter(x => {
                return x.title.includes(context.searchWord.slice(1))
            })
            context.callbackSetList(filtered)
            return this
        }
    }
}

module.exports = CmdFiltering
