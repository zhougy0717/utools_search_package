const ListCmd = require('./list_cmd.js')
const pkgmgrFactory = require("../package_managers/pkgmgr_factory.js")

class UpgradeCmd extends ListCmd {
    constructor(mgrCmd, args, outputCb) {
        super(mgrCmd, args, outputCb)
        const subcmdArgs = this.pkgmgr.subcmdArgs('upgrade')
        this.args = [...this.pkgmgr.mgrCmd(), ...subcmdArgs, ...args]
    }

    updateResult (code, items) {
        items.forEach(x => {
          x.icon = 'icons/install.png'
          x.action = 'upgrade'
        })
        return items
    }

    handleCmdOutput(output) {
        const pm = pkgmgrFactory.create(this.mgrCmd)
        const items = pm.upgradeHandler(output)
        window.utools.showNotification(`共安装${items.length}个软件包`)
        return items
    }
}

module.exports = UpgradeCmd
