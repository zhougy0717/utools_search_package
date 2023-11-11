const CmdFiltering = require('./cmd_filtering.js')
const SshFiltering = require('./ssh_filtering.js')
const Init = require('./init.js')
const Filtering = require('./filtering.js')
const Executing = require('./executing.js')

const createStateCb = {
  'init': () => { return new Init() },
  'cmdFiltering': (...args) => { return new CmdFiltering(...args) },
  'sshFiltering': (...args) => { return new SshFiltering(...args) },
  'filtering': () => { return new Filtering() },
  'executing': (...args) => { return new Executing(...args) }
}

createState = (stateName, ...args) => {
    return createStateCb[stateName](...args)
}

module.exports = { createState }