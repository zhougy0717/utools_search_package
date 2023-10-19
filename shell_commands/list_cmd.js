const ShellCmd= require("./shell_command.js")
const pkgmgrFactory = require("../package_managers/pkgmgr_factory.js")

class ListCmd extends ShellCmd {
    constructor(mgrCmd, args, outputCb) {
        super(mgrCmd, args, outputCb)
        const subcmdArgs = this.pkgmgr.subcmdArgs('list')
        this.args = [...subcmdArgs, ...args]
    }
    updateResult (code, items) {
        if (code == 0) {
          items.forEach(x => {
            x.icon = 'icons/install.png'
            x.action = 'list'
          })
        }
        else {
          items.forEach(x => {
            x.description = "点击复制本行日志"
            x.icon = 'icons/log.png'
            x.action = 'copy'
          })
          items.unshift({
            title:`命令错误退出, 错误码 ${code}`,
            icon: 'icons/error.png'
          })
        }
        return items
    }

    handleCmdOutput(output) {
        const pm = pkgmgrFactory.create(this.mgrCmd)
        const items = pm.listHandler(output)
        window.utools.showNotification(`共安装${items.length - 1}个软件包`)
        return items

    }
}

module.exports = ListCmd