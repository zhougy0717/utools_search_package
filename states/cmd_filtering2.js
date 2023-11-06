const CmdFiltering = require('./cmd_filtering.js');

class CmdFiltering2 extends CmdFiltering {
    constructor() {
        super()
        this.lastState = 'filtering'
        this.myself = 'cmdFiltering2'
    }
}

module.exports = CmdFiltering2