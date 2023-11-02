const State = require('./state.js') 

class CmdFiltering extends State {
    constructor() {
        super()
    }

    update (trigger, context) {
        if (trigger === 'reset') {
            return "init"
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
