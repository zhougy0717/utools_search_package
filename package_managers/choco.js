const PkgMgr = require('./pkgmgr.js') 
const Version = require('../version.js')
const VersionCmd = require('../shell_commands/version_cmd.js')

class Choco extends PkgMgr {
    constructor() {
        super()
        this.SUBCMDS = {
            install: ['install', '-y'],
            search: ['search', '--detail', '--no-color'],
            list: ['list', '--detail', '--no-color'],
            remove: ['uninstall'],
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

    upgradeHandler(text) {
        let items = []
        let lines = text.split("\n")
        lines = lines.filter(x => !/^\s*$/.test(x))

        lines.forEach(line => {
            const regex = /([^ ]*)\|([^ ]*)\|([^ ]*)\|.*/
            const results = regex.exec(line)
            if (results == null) {
                return
            }
            const title = results[1]
            const oldVer = results[2] ?? "NA"
            const newVer = results[3] ?? "NA"
            items.push({
                title: title,
                description: `版本更新：${oldVer} ==> ${newVer}`,
                cmd: `choco upgrade -y ${title}`,
                action: 'copyText'
            })
        })
        return items
    }

    getVersion() {
        const cmd = new VersionCmd(['choco', '--version'], Choco)
        cmd.doit()
    }

    subcmdArgs(cmd) {
        if (cmd == 'list') {
            const ver = new Version(Choco.version??['0', '0'])
            const v2 = new Version(['2', '0'])
            if (ver.olderThan(v2)) {
                let args = this.SUBCMDS['list']
                return [...args, '--localonly']
            }
        }
        return this.SUBCMDS[cmd] ?? []
    }
}
module.exports = Choco