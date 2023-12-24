const { spawn } = require('child_process');
const Nanobar = require('nanobar')
const pkgmgrFactory = require('../package_managers/pkgmgr_factory.js')
  
asItem = (output) => {
    let lines = output.split('\n')
    let items = []
    lines = lines.filter(x => {
        return ! /^\s*$/.test(x)
    })
    lines.forEach(x => {
        items.push({
            title: x
        })
    })
    return items
}

class ShellCmd {
    constructor(mgrCmd, args, outputCb) {
        this.args = args
        if (outputCb) {
            this.outputCb = outputCb
        }
        if(mgrCmd) {
            this.mgrCmd = mgrCmd
            this.pkgmgr = pkgmgrFactory.create(mgrCmd)
        }
    }

    addSshArgs() {
        const sshRecords = window.utools.dbStorage.getItem('sshRecords') ?? []
        if (sshRecords.length === 0 || sshRecords[0].length === 0) {
            return false
        }
        this.args = [...sshRecords[0], ...this.args]
        return true
    }

    initBar = () => {
        var nanobar = new Nanobar();
        document.getElementById('nanobarcss').innerHTML = `
        .nanobar {
            width:100%;
            height:1px;
            z-index:99999;
            top:0
        }
        .bar {
            width:0;
            height:100%;
            transition:height .3s;
            background-image: linear-gradient(to top, #37ecba 0%, #72afd3 100%)
        }`
        return nanobar
    }

    doit () {
        let nanobar = this.initBar()
        let output = ""
        if (!this.pkgmgr.osSupported()) {
            const ret = this.addSshArgs()
            if (!ret) {
                window.utools.showNotification(`本地不支持命令${this.mgrCmd},且ssh未配置`)
                return null
            }
        }
        let cmdProc = spawn (this.args[0], this.args.slice(1))
        let progress = 10
        nanobar.go(progress)
        cmdProc.stdout.on('data', (data) => {
            output = output + data
            progress += 10
            nanobar.go(progress)
        })
        cmdProc.stderr.on('data', (data) => {
            output = output + data
            progress += 10
            nanobar.go(progress)
        })
        cmdProc.on('close', (code) => {
            let items = this.handleCmdOutput(output)
            if (items.length == 0 && code != 0) {
                items = asItem(output)
            }
            if (items.length > 0) {
                items = this.updateResult(code, items)
                this.outputCb(code, items)
            }
            else {
                this.outputCb(code, [])
            }
            nanobar.go(100)    
        })
        return cmdProc
    }
}

module.exports = ShellCmd