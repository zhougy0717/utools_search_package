const State = require('./state.js') 

class Executing extends State {
    constructor (cmdProc) {
        super()
        this.name = 'executing'
        this.cmdProc = cmdProc
    }

    async update (trigger, context) {
        if (trigger == 'done') {
            utools.setSubInputValue('')
            const state = context.createState('filtering')
            context.changeState(state)
        }
        if (trigger == 'kill') {
            this.cmdProc.kill('SIGTERM')
        }
        if (trigger == 'reset') {
            const state = context.createState('init')
            context.changeState(state)
        }
    }
}

module.exports = Executing