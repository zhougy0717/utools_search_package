const State = require('./state.js') 

class Filtering extends State {
    constructor () {
        super()
        this.name = 'filtering'
    }

    async update (trigger, context) {
        if (trigger === 'reset') {
            utools.setSubInputValue('')
            utools.setSubInput(({text}) => {
                const mgrCmd = context.action.code
                context.searchHandler({code: mgrCmd}, text, context.callbackSetList)
            }, '搜索软件包, 输入冒号进入命令模式')
            context.setItems([])
            context.callbackSetList([])
            const state = context.createState('init')
            context.changeState(state)
        }
        if (trigger == 'type') {
            if (/^\s*$/.test(context.searchWord)) {
                const items = context.getItems()
                context.callbackSetList(items)
            }
            else {
                const filtered = context.getItems().filter(x => {
                    return x.title.includes(context.searchWord)
                })
                context.callbackSetList(filtered)
            }
        }
        return this
    }
}

module.exports = Filtering
