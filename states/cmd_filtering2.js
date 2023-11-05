const CmdFiltering = require('./cmd_filtering.js');

class CmdFiltering2 extends CmdFiltering {
    constructor(lastState) {
        super()
        this.lastState = lastState
        this.myself = 'cmdFiltering2'
    }
}

module.exports = CmdFiltering2