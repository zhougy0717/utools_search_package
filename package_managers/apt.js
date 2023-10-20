const PkgMgr = require('./pkgmgr.js') 

class Apt extends PkgMgr {
    constructor() {
        super()
        this.SUBCMDS = {
            install: ['install'],
            search: ['search'],
            list: ['list'],
            remove: ['remove']
        }
    }

    removeColorCode (str) {
        return str.replace(/\x1b\[[0-9;]*[mK]/g, '');
    }

    findFirstPackage(lines) {
        for (let i = 0; i < lines.length; i++) {
            if (/Full Text Search... Done/.test(lines[i])) {
                return i + 1
            }
        }
        return -1
    }

    isEnd(text) {
        return /Connection to 10.211.55.5 closed./.test(text)
    }

    searchHandler(text) {
        let items = []
        text = this.removeColorCode(text)
        let lines = text.split("\n")
        lines = lines.filter(x => !/^\s*$/.test(x))
        const start = this.findFirstPackage(lines)

        for (let i = start; i < lines.length; i++) {
            if (this.isEnd(lines[i])) {
                break
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

    listHandler(text) {
        return this.searchHandler(text)
    }

    osSupported() {
        return utools.isLinux()
    }
}
module.exports = Apt