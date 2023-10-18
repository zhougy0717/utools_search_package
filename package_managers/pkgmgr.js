class PkgMgr {
    searchHandler(text) {
        throw new Error('a package manager should handle search command')
    }

    listHandler() {
        throw new Error('a package manager should handle list command')
    }

    subcmdArgs(cmd) {
        throw new Error('a package manager should maintain sub command arg table')
    }
}

module.exports = PkgMgr