class PkgMgr {
    searchHandler(text) {
        throw new Error('a package manager should handle search command')
    }

    listHandler(text) {
        throw new Error('a package manager should handle list command')
    }

    upgradeHandler(text) {
        throw new Error('a package manager should handle upgrade command')
    }

    subcmdArgs(cmd) {
        return this.SUBCMDS[cmd] ?? []
    }

    osSupported () {
        throw new Error('a package manager should tell which OS it supports')
    }

    mgrCmd() {
        return [this.mgrName]
    }

    getVersion() {}

    init() {
        this.getVersion()
    }
}

module.exports = PkgMgr