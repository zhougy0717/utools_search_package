const State = require('./state.js') 

class CmdFiltering extends State {
    constructor(lastState, oldItems) {
        super()
        this.lastState = lastState
        this.name = 'cmdFiltering'
        this.oldItems = oldItems
    }

    async update (trigger, context) {
        if (trigger === 'reset') {
            context.setItems(this.oldItems)
            context.callbackSetList(this.oldItems)
            const state = context.createState(this.lastState)
            context.changeState(state)
        }
        else if (trigger == 'execute') {
            const state =  context.createState('executing')
            context.changeState(state)
        }
        if (trigger === 'type') {
            if (/^\s*$/.test(context.searchWord)) {
                context.setItems(this.oldItems)
                context.callbackSetList(this.oldItems)
                const state = context.createState(this.lastState)
                context.changeState(state)
            }
            else if (/^\s*ssh$/.test(context.searchWord.slice(1))) {
                // TODO: Move to ssh filtering state, currently not implemented yet
            }
            else {
                // TODO: Move to itself
                const filtered = context.getItems().filter(x => {
                    return x.title.includes(context.searchWord.slice(1))
                })
                context.callbackSetList(filtered)
            }
        }
    }
}

module.exports = CmdFiltering
