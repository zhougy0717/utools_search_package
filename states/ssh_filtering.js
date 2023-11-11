const State = require('./state.js')
const { cmdItems } = require('../command.js')

class SshFiltering extends State {
    constructor(lastState, oldItems) {
        super()
        this.lastState = lastState
        this.name = 'sshFiltering'
        this.oldItems = oldItems
    }

    async update (trigger, context) {
        if (trigger === 'type') {
            if (/^\s*ssh$/.test(context.searchWord.slice(1))) {
                const items = cmdItems()
                context.setItems(items)
                context.callbackSetList(items)
                const state = context.createState('cmdFiltering',this.lastState, this.oldItems)
                context.changeState(state)
            }
            else {
                const filtered = context.getItems().filter(x => {
                    return x.title.includes(context.searchWord.slice(1))
                })
                context.callbackSetList(filtered)
            }
        }
        if (trigger === 'command') {
            const mgrCmd = context.action.code
            const updateItemCb = context.outputCb
            await cmdHandler(context.searchWord.slice(1), mgrCmd, updateItemCb, context)
        }
        if (trigger === 'execute') {
            const state = context.createState('executing')
            context.changeState(state)
        }
        if (trigger === 'reset') {
            const state = context.createState('init')
            context.setItems([])
            context.callbackSetList([])
            context.changeState(state)
        }
    }
}

module.exports = SshFiltering