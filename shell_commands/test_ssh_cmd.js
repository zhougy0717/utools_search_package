const ShellCmd= require("./shell_command.js")
const { spawn } = require('child_process');

class TestSshCmd extends ShellCmd {
    constructor(args, callback) {
        super(null, args, callback)
        if (args[0].includes(":")) {
            const words = args[0].split(":")
            this.server = words[0]
            this.port = words[1]
        }
        else {
            this.server = args[0]
            this.port = "22"
        }
        this.args = args
    }

    doit() {
        const nanobar = this.initBar()
        const sshArgs = ['ssh', '-tt', '-p', this.port, this.server]
        const sshCmd = [...sshArgs, 'echo hello world']
        let progress = 10
        let cmdProc = spawn (sshCmd[0], sshCmd.slice(1))
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
                window.utools.dbStorage.setItem('sshArgs', sshArgs)  
                window.utools.showNotification(`测试连接成功: ${this.server}:${this.port}`)
            }
            else {
                window.utools.showNotification(`连接服务器失败: ${this.server}:${this.port}`)
            }
            nanobar.go(100)
            this.outputCb()
        })
        return cmdProc
    }
}

module.exports = TestSshCmd
