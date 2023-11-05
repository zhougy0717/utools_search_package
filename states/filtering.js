const State = require('./state.js') 

class Filtering extends State {
    constructor () {
        super()
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
            return "init"
        }
        if (trigger == 'type') {
            if (/^\s*$/.test(context.searchWord)) {
                // TODO: We may fall back to cmdFiltering mode
                const items = context.getItems()
                context.callbackSetList(items)
                return "filtering"
            }
            else if (/^[:：]/.test(context.searchWord)) {
                // TODO: Move to cmdFiltering state
                const items = cmdItems()
                context.setItems(items)
                context.callbackSetList(items)
                return "cmdFiltering2"
            }
        }
        return "filtering"
    }
}

module.exports = Filtering
