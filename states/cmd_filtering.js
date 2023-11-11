const State = require('./state.js') 
const { cmdHandler } = require('../command.js')

class CmdFiltering extends State {
    constructor(lastState, oldItems) {
        super()
        this.lastState = lastState
        this.name = 'cmdFiltering'
        this.oldItems = oldItems
    }

    getSshItems(){
        const sshRecords = window.utools.dbStorage.getItem('sshRecords') ?? []
        let items = []
        sshRecords.forEach((sshArgs) => {
            const portIdx = sshArgs.indexOf('-p')
            let port = '22'
            if (portIdx !== -1) {
                port = sshArgs[portIdx + 1]
            }
            let host = ''
            for (var i = 0; i < sshArgs.length; i++) {
                if (sshArgs[i].includes('@')) {
                    host = sshArgs[i]
                    break
                }
            }
            const cmd = `ssh ${host}:${port}`
            items.push({
                title: cmd,
                action: 'sshComplete'
            })
        })
        items.unshift({
            title: '显示当前生效的ssh配置',
            action: 'none'
        })
        return items
    }

    async update (trigger, context) {
        if (trigger === 'reset') {
            context.setItems(this.oldItems)
            context.callbackSetList(this.oldItems)
            const state = context.createState(this.lastState)
            context.changeState(state)
        }
        else if (trigger == 'execute') {
            const state =  context.createState('executing', context.cmdProc)
            context.changeState(state)
        }
        else if (trigger == 'command') {
            const mgrCmd = context.action.code
            const updateItemCb = context.outputCb
            await cmdHandler(context.searchWord.slice(1), mgrCmd, updateItemCb, context)
        }
        if (trigger === 'type') {
            if (/^\s*$/.test(context.searchWord)) {
                context.setItems(this.oldItems)
                context.callbackSetList(this.oldItems)
                const state = context.createState(this.lastState)
                context.changeState(state)
            }
            else if (/^\s*ssh $/.test(context.searchWord.slice(1))) {
                // TODO: Move to ssh filtering state, currently not implemented yet
                const items = this.getSshItems()
                context.setItems(items)
                context.callbackSetList(items)
                const state = context.createState('sshFiltering', this.lastState, this.oldItems)
                context.changeState(state)
            }
            else {
                const filtered = context.getItems().filter(x => {
                    return x.title.includes(context.searchWord.slice(1))
                })
                context.callbackSetList(filtered)
            }
        }
    }
}

module.exports = CmdFiltering
