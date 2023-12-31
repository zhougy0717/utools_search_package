const PkgMgr = require('./pkgmgr.js') 

class Apt extends PkgMgr {
    constructor() {
        super()
        this.SUBCMDS = {
            install: ['install'],
            search: ['search'],
            list: ['list', '--installed'],
            remove: ['remove'],
            upgrade: ['list', '--upgradable'],
            update: ['upgrade']
        }
    }

    isPkgLine(line) {
        const words = line.split(' ')
        if (words.length == 3) {
            return true
        }
        return false
    }

    searchHandler(text) {
        let items = []
        let lines = text.split("\n")
        lines = lines.filter(x => !/^\s*$/.test(x))

        for (let i = 0; i < lines.length; i++) {
            if (!this.isPkgLine(lines[i])) {
                continue
            }
            const words = lines[i].split(' ')
            const name = words[0]
            const version = words[1]
            const desc = lines[++i].trim()
            items.push({
                title: name,
                description: `版本${version}：${desc}`
            })
        }
        return items
    }

    isListedPkgLine(line) {
        return /^.+\[[installed|upgradable].*\]\s*$/.test(line)
    }
    listHandler(text) {
        let items = []
        let lines = text.split("\n")
        lines = lines.filter(x => !/^\s*$/.test(x))

        for (let i = 0; i < lines.length; i++) {
            if (!this.isListedPkgLine(lines[i])) {
                continue
            }
            const words = lines[i].split(' ')
            const nameWords = words[0].split(',')
            const name = nameWords[0]
            const version = words[1]
            items.push({
                title: name,
                description: `版本${version}`
            })
        }
        return items
    }

    osSupported() {
        const isLinux = utools.isLinux()
        if (!isLinux) {
            return false
        }

        const { execSync } = require('child_process');
        try {
            const result = execSync('hostnamectl', { encoding: 'utf-8' });
            return result.toLowerCase().includes('ubuntu')
        } catch (error) {
            return false
        }
    }

    mgrCmd() {
        return ['NO_COLOR=1', 'apt']
    }

    upgradeHandler(text) {
        let items = []
        let lines = text.split("\n").slice(1)
        lines = lines.filter(x => !/^\s*$/.test(x))

        lines.forEach(line => {
            const regex = /(.*) (.*) (.*) \[.*: (.*)\]/
            const results = regex.exec(line)
            if (results == null) {
                return
            }
            const title = results[1]
            const oldVer = results[4] ?? "NA"
            const newVer = results[2] ?? "NA"
            items.push({
                title: title,
                description: `版本更新：${oldVer} ==> ${newVer}`,
                cmd: `apt upgrade ${title}`,
                action: 'copyText'
            })
        })
        return items
    }
}
module.exports = Apt
