class PkgMgr {
    searchHandler(text) {
        throw new Error('a package manager should handle search command')
    }

    listHandler() {
        throw new Error('a package manager should handle list command')
    }

    subcmdArgs(cmd) {
        return this.SUBCMDS[cmd]
    }

    osSupported () {
        throw new Error('a package manager should tell which OS it supports')
    }
}

module.exports = PkgMgr