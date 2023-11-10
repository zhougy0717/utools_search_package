const ShellCmd= require("./shell_command.js")
const pkgmgrFactory = require("../package_managers/pkgmgr_factory.js")

class SearchCmd extends ShellCmd {
    constructor(mgrCmd, args, outputCb) {
        super(mgrCmd, args, outputCb)
        const subcmdArgs = this.pkgmgr.subcmdArgs('search')
        this.args = [...this.pkgmgr.mgrCmd(), ...subcmdArgs, ...args]
    }
    updateResult (code, items) {
        if (code == 0) {
          items.forEach(x => {
            if (! 'description' in x || /^\s*$/.test(x.description)) {
                x.description = "点击复制安装命令"
            }
            x.icon = 'icons/install.png'
            x.action = 'install'
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

    doit() {
        return super.doit()
    }

    handleCmdOutput(output) {
        const pm = pkgmgrFactory.create(this.mgrCmd)
        const items = pm.searchHandler(output)
        window.utools.showNotification(`找到${items.length}个软件包`)
        return items
    }
}

module.exports = SearchCmd
