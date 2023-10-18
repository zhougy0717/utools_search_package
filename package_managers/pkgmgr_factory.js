const Brew = require("./brew.js")
const Npm = require("./npm.js")

const PkgMgr = require("./pkgmgr.js")

const table = {
    brew: Brew,
    npm: Npm
}

create = (type) => {
    if (! type in table) {
        return new PkgMgr()
    }

    return new table[type]()
}

isSupport = (type) => {
    return type in table
}

module.exports = {create, isSupport}