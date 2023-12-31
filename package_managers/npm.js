const PkgMgr = require('./pkgmgr.js') 

class Npm extends PkgMgr {
    constructor() {
        super()
        this.SUBCMDS = {
            install: ['install', '-g'],
            search: ['search', '--parseable'],
            list: ['list', '-lg'],
            remove: ['uninstall'],
            upgrade: ['outdated', '-g'],
            update: ['update', '-g']
        }
        this.mgrName = 'npm'
    }
    searchHandler(output) {
        const lines = output.split('\n')
        let wordMatrix = []
        lines.forEach(x => {
            const words = x.split('\t').map(y => {
                return y.trim()
            })
            wordMatrix.push(words)
        });
        const items = []
        // The output line looks like this
        // git     A node.js library for git       =christkv       2013-06-24      0.1.5
        // with `--parseable' option, the head line disappears, so hardcode as below.
        const nameIdx = 0
        const verIdx = 4
        const descIdx = 1
        wordMatrix.forEach(x => {
            const pkg = {
                title: x[nameIdx],
                description: `版本：v${x[verIdx]}，${x[descIdx]}`
            }
            items.push(pkg)
        })
        return items
    }

    listHandler(text) {
        const lines = text.split('\n')
        let items = []
        items.push({
            title: "nodejs软件包安装位置",
            description: lines[0]
        })
        for (let i = 2; i < lines.length - 2; i++) {
            let line = lines[i]
            if (/^\s*$/.test(lines[i])) {
                continue
            }
            let pkg = {}
            if (line.startsWith('+') || line.startsWith('`')) {
                const payload = line.slice(4)
                const pair = payload.split('@')
                pkg['title'] = pair[0]
                pkg['description'] = `版本：${pair[1]}`
                line = lines[++i]
                if (! /^\s*$/.test(line)) {
                    pkg['description'] += '，' + line.slice(4)
                }
                items.push(pkg)
            }
        }

        return items
    }

    osSupported() {
        return true
    }

    upgradeHandler(text) {
        let items = []
        let lines = text.split("\n")

        lines.forEach(line => {
            const regex = /(.*) (.*) (.*) (.*) (.*)/
            const results = regex.exec(line)
            if (results == null) {
                return
            }
            const title = results[1]
            const oldVer = results[2] ?? "NA"
            const newVer = results[3] ?? "NA"
            const location = results[4]
            items.push({
                title: title,
                description: `版本更新：${oldVer} ==> ${newVer}, 安装位置: ${location}`,
                cmd: `npm update ${title} -g`,
                action: 'copyText'
            })
        })
        return items
    }
}
module.exports = Npm