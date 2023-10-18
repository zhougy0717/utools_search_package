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

class ShellCmd {
    constructor(mgrCmd, args, outputCb) {
        this.mgrCmd = mgrCmd
        this.args = args
        this.outputCb = outputCb
        this.pkgmgr = pkgmgrFactory.create(mgrCmd)
    }

    updateResult (code, items) {
        if (code == 0) {
          items.forEach(x => {
            x.description = "点击复制安装命令"
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

    async doit () {
        let nanobar = initBar()
        let output = ""
        let cmdProc = spawn (this.mgrCmd, this.args)
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
            items = this.updateResult(code, items)
            this.outputCb(items)
            g_stateMachine.updateState('done', async() => {
                utools.setSubInputValue('')
            })
            nanobar.go(100)    
        })
    }
}

module.exports = ShellCmd