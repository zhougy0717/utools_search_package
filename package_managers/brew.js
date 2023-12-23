const PkgMgr = require('./pkgmgr.js') 
const { spawn } = require('child_process');
const VersionCmd = require('../shell_commands/version_cmd.js')
class Brew extends PkgMgr {
    constructor() {
        super()
        this.SUBCMDS = {
            install: ['install'],
            search: ['search'],
            list: ['list'],
            remove: ['uninstall'],
            upgrade: ['outdated', '-v'],
            update: ['upgrade']
        }
        this.mgrName = 'brew'
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

    osSupported() {
        return utools.isLinux() || utools.isMacOS()
    }

    upgradeHandler(text) {
        let items = []
        let lines = text.split("\n")
        const strippedLines = lines.filter(x => !/^\s*$/.test(x))
        strippedLines.forEach(line => {
            const regex = /(.*) \((.*)\) (<|!=) (.*)/
            const results = regex.exec(line)
            if (results == null) {
                return
            }
            const title = results[1]
            const oldVer = results[2] ?? "NA"
            const newVer = results[4] ?? "NA"
            items.push({
                title: title,
                description: `版本更新：${oldVer} ==> ${newVer}`,
                cmd: `brew upgrade ${title}`,
                action: 'copyText'
            })
        })
        return items
    }

    getVersion() {
        const cmd = new VersionCmd(['brew', '--version'], Brew)
        cmd.doit()
    }
}
module.exports = Brew