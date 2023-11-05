const State = require('./state.js') 

class Executing extends State {
    constructor () {
        super()
    }

    async update (trigger, context) {
        if (trigger == 'done') {
            utools.setSubInputValue('')
            return 'filtering'
        }
    }
}

module.exports = Executing