const ListCmd = require('./list_cmd.js')

class UpgradeCmd extends ListCmd {
    constructor(mgrCmd, args, outputCb) {
        super(mgrCmd, args, outputCb)
        const subcmdArgs = this.pkgmgr.subcmdArgs('upgrade')
        this.args = [...this.pkgmgr.mgrCmd(), ...subcmdArgs, ...args]
    }
}

module.exports = UpgradeCmd
