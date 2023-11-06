const State = require('./state.js') 

class Executing extends State {
    constructor () {
        super()
        this.name = 'executing'
    }

    async update (trigger, context) {
        if (trigger == 'done') {
            utools.setSubInputValue('')
            return context.createState('filtering')
        }
    }
}

module.exports = Executing