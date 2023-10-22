const ShellCmd= require("./shell_command.js")
const { spawn } = require('child_process');

class TestSshCmd extends ShellCmd {
    constructor(args) {
        super(null, args, null)
        this.args = args
    }

    doit() {
        const nanobar = this.initBar()
        const sshArgs = ['-tt', ...this.args, 'ls']
        let progress = 10
        let cmdProc = spawn ('ssh', sshArgs)
        nanobar.go(progress)
        cmdProc.stdout.on('data', (data) => {
            progress += 10
            nanobar.go(progress)
        })
        cmdProc.stderr.on('data', (data) => {
            progress += 10
            nanobar.go(progress)
        })
        cmdProc.on('close', (code) => {
            if (code == 0) {
                window.utools.dbStorage.setItem('sshArgs', ['-tt', ...this.args])  
                window.utools.showNotification(`测试连接成功: ${this.args[0]}`)
            }
            else {
                window.utools.showNotification(`连接服务器失败: ${this.args[0]}`)
            }
            nanobar.go(100)
        })
        
    }
}

module.exports = TestSshCmd
