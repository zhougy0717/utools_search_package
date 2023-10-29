const { spawn } = require('child_process');
const Nanobar = require('nanobar')
const g_stateMachine = require('../state_machine.js')
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
        const sshArgs = window.utools.dbStorage.getItem('sshArgs') ?? []
        if (sshArgs.length === 0) {
            return false
        }
        this.args = ['ssh', ...sshArgs, ...this.args]
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

    async doit () {
        let nanobar = this.initBar()
        let output = ""
        if (!this.pkgmgr.osSupported()) {
            const ret = this.addSshArgs()
            if (!ret) {
                window.utools.showNotification(`本地不支持命令${this.mgrCmd},且ssh未配置`)
                return
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
            let items;
            if (code == 0) {
                items = this.handleCmdOutput(output)
            }
            else {
                items = asItem(output)
            }
            if (items.length > 0) {
                items = this.updateResult(code, items)
                this.outputCb(items)
                g_stateMachine.updateState('done', async() => {
                    utools.setSubInputValue('')
                })
            }
            else {
                g_stateMachine.updateState('reset', async() => {
                    utools.setSubInputValue('')
                })
            }
            nanobar.go(100)    
        })
    }
}

module.exports = ShellCmd