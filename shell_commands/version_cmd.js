const { spawn } = require('child_process');
class VersionCmd {
    constructor(args, obj) {
        this.args = args
        this.ownerCls = obj
    }

    doit() {
        let output = ''
        let cmdProc = spawn (this.args[0], this.args.slice(1))
        cmdProc.stdout.on('data', (data) => {
            output = output + data
        })
        cmdProc.stderr.on('data', (data) => {
            output = output + data
        })
        cmdProc.on('close', (code) => {
            const regex = /.*?([\.\d]+)/
            const results = regex.exec(output)
            const verText = results[1] ?? "0.0"
            const verNums = verText.split('.')
            this.ownerCls.version = verNums
        })
    }
}
module.exports = VersionCmd