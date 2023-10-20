const Brew = require("./brew.js")
const Npm = require("./npm.js")
const Apt = require("./apt.js")
const Dnf = require("./dnf.js")

const PkgMgr = require("./pkgmgr.js")

const table = {
    brew: Brew,
    npm: Npm,
    apt: Apt,
    dnf: Dnf
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