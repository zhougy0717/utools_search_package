const Brew = require("./brew.js")
const PkgMgr = require("./pkgmgr.js")

const table = {
    brew: Brew
}

create = (type) => {
    if (! type in table) {
        return new PkgMgr()
    }

    return new table[type]()
}

module.exports = {create}