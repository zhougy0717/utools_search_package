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

    listHandler(text) {
        return this.searchHandler(text)
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
}
module.exports = Apt
