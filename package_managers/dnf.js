const PkgMgr = require('./pkgmgr.js') 

class Dnf extends PkgMgr {
    constructor() {
        super()
        this.SUBCMDS = {
            install: ['install'],
            search: ['search', '--color', '0'],
            list: ['list', '--installed', '--color', '0'],
            remove: ['remove'],
            upgrade: ['check-update'],
            update: ['update']
        }
        this.mgrName = 'dnf'
    }

    findFirstPackage(lines) {
        for (let i = 0; i < lines.length; i++) {
            if (/[=]+ Name Exactly Matched: .* [=]+/.test(lines[i])) {
                return i + 1
            }
        }
        return -1
    }

    isEnd(text) {
        // TODO: if run locally, there won't be such line.
        return /Connection to .* closed./.test(text)
    }

    searchHandler(text) {
        let items = []
        let lines = text.split("\n")
        lines = lines.filter(x => !/^\s*$/.test(x))
        const start = this.findFirstPackage(lines)
        if (start === -1) {
            return items
        }

        for (let i = start; i < lines.length; i++) {
            if (this.isEnd(lines[i])) {
                break
            }
            if (/[=]+ .* Matched: .* [=]+/.test(lines[i])) {
                continue
            }
            const words = lines[i].split(':')
            const name = words[0].trim()
            const desc = words[1].trim()
            items.push({
                title: name,
                description: `${desc}`
            })
        }
        return items
    }

    findFirstPackageInList(lines) {
        for (let i = 0; i < lines.length; i++) {
            if (/Installed Packages/.test(lines[i])) {
                return i + 1
            }
        }
        return -1
    }

    listHandler(text) {
        let items = []
        let lines = text.split("\n")
        lines = lines.filter(x => !/^\s*$/.test(x))
        const start = this.findFirstPackageInList(lines)
        if (start === -1) {
            return items
        }
        
        for (let i = start; i < lines.length; i++) {
            if (this.isEnd(lines[i])) {
                break
            }
            let words = lines[i].split(' ')
            words = words.filter(x => !/^\s*$/.test(x))
            const name = words[0].trim()
            const version = words[1].trim()
            const repo = words[2].trim()
            items.push({
                title: name,
                description: `版本：${version}, installed from ${repo}`
            })
        }
        return items
    }

    osSupported() {
        // utools only supports Debian like Linux. No Fedora family.
        return false
    }

    upgradeHandler(text) {
        let items = []
        let lines = text.split("\n")
        lines = lines.filter(x => !/^\s*$/.test(x))

        lines.forEach(line => {
            const words = line.trim().split(/\s+/)
            if (words.length != 3) {
                return
            }
            const title = words[0]
            const newVer = words[1]
            items.push({
                title: title,
                description: `版本更新至：${newVer}`,
                cmd: `dnf update ${title}`,
                action: 'copyText'
            })
        })
        return items
    }
}
module.exports = Dnf