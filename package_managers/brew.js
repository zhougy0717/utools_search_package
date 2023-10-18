const PkgMgr = require('./pkgmgr.js') 

class Brew extends PkgMgr {
    constructor() {
        super()
        this.SUBCMDS = {
            install: ['install'],
            search: ['search'],
            list: ['list']
        }
    }
    searchHandler(text) {
        let items = []
        let lines = text.split("\n")
        const strippedLines = lines.filter(x => !/^\s*$/.test(x))
        strippedLines.forEach(line => {
            items.push({
            title: line
            })
        })
        return items
    }

    listHandler(text) {
        return this.searchHandler(text)
    }

    subcmdArgs(cmd) {
        return this.SUBCMDS[cmd]
    }
}
module.exports = Brew