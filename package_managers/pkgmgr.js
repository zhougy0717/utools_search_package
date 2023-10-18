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
}

module.exports = PkgMgr