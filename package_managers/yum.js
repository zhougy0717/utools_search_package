const Dnf = require('./dnf.js')

class Yum extends Dnf {
    constructor(){
        super()
        this.mgrName = 'yum'
    }
}

module.exports = Dnf
