const PkgMgr = require('./pkgmgr.js') 

class Choco extends PkgMgr {
    constructor() {
        super()
        this.SUBCMDS = {
            install: ['install', '-y'],
            search: ['search', '--detail', '--by-id-only'],
            list: ['list', '--detail', '--localonly'],
            remove: ['remove'],
            upgrade: ['outdated'],
            update: ['upgrade']
        }
        this.mgrName = 'choco'
    }

    findNextTitle(lines) {
        for (let i = 0; i < lines.length; i++) {
            if (/^ Title:/.test(lines[i])) {
                return i;
            }
        }
        return -1
    }

    findSummary(lines) {
        for (let i = 0; i < lines.length; i++) {
            if (/^ Summary:/.test(lines[i])) {
                return i;
            }
        }
        for (let i = 0; i < lines.length; i++) {
            if (/^ Description:/.test(lines[i])) {
                return i;
            }
        }
        for (let i = 0; i < lines.length; i++) {
            if (/^ Title:/.test(lines[i])) {
                return i;
            }
        }
        return -1
    }
    processAPkg(lines) {
        let words = lines[0].split(' ')
        const name = words[0]
        const version = words[1]
        const lineno = this.findSummary(lines)
        let summary = ""
        if (lineno !== -1) {
            words = lines[lineno].split(':')
            summary = words[1].trim()
        }
        const item = {
            title: name,
            description: `版本：${version}, ${summary}`
        }
        return item
    }

    searchHandler(text) {
        let items = []
        let lines = text.split("\n")
        lines = lines.filter(x => !/^\s*$/.test(x))
        
        for (let i = 0; i < lines.length; ) {
            let nextTitle = this.findNextTitle(lines.slice(i))
            if (nextTitle === -1) {
                break
            }
            else {
                nextTitle += i
            }
            const nextPkg = nextTitle - 1
            const item = this.processAPkg(lines.slice(nextPkg))
            items.push(item)
            i = nextTitle + 1
        }
        return items
    }

    listHandler(text) {
        return this.searchHandler(text)
    }

    osSupported() {
        return utools.isWindows()
    }
}
module.exports = Choco