const ShellCmd= require("./shell_command.js")
const pkgmgrFactory = require("../package_managers/pkgmgr_factory.js")

class SearchCmd extends ShellCmd {
    constructor(mgrCmd, args, outputCb) {
        super(mgrCmd, args, outputCb)
        const subcmdArgs = this.pkgmgr.subcmdArgs('search')
        this.args = [...subcmdArgs, ...args]
    }
    updateResult (code, items) {
        if (code == 0) {
          items.forEach(x => {
            if (! 'description' in x) {
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
        super.doit()
    }

    handleCmdOutput(output) {
        const pm = pkgmgrFactory.create(this.mgrCmd)
        return pm.searchHandler(output)
    }
}

module.exports = SearchCmd
