const ShellCmd= require("./shell_command.js")
const { spawn } = require('child_process');

class TestSshCmd extends ShellCmd {
    constructor(args, callback) {
        super(null, args, callback)
        const host = args[1]
        if (host.includes(":")) {
            const words = host.split(":")
            this.server = words[0]
            this.port = words[1]
        }
        else {
            this.server = host
            this.port = "22"
        }
        this.args = args
    }

    pushRecord(sshArgs){
        let sshRecords = window.utools.dbStorage.getItem('sshRecords')  ?? []
        const filtered = sshRecords.filter(x => {
            const text = x.join(' ')
            return text != sshArgs.join(' ')
        })
        if (filtered.length > 10) {
            filtered.pop()
        }
        filtered.unshift(sshArgs)
        window.utools.dbStorage.setItem('sshRecords', filtered)  
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
                this.pushRecord(sshArgs)
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
