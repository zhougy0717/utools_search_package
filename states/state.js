class State {
    constructor() {

    }
    async update (trigger, context) {
        throw new Error('a state should handle actions and move to next state')
    }
}

module.exports = State