const CmdFiltering = require('./cmd_filtering.js')
const Init = require('./init.js')
const Filtering = require('./filtering.js')
const Executing = require('./executing.js')

const createStateCb = {
  'init': () => { return new Init() },
  'cmdFiltering': (...args) => { return new CmdFiltering(...args) },
  'filtering': () => { return new Filtering() },
  'executing': (...args) => { return new Executing(...args) }
}

createState = (stateName, ...args) => {
    return createStateCb[stateName](...args)
}

module.exports = { createState }