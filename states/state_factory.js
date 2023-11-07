const CmdFiltering = require('./cmd_filtering.js')
const Init = require('./init.js')
const Filtering = require('./filtering.js')
const Executing = require('./executing.js')

const createStateCb = {
  'init': () => { return new Init()},
  'cmdFiltering': (lastState) => { return new CmdFiltering(lastState)},
  'cmdFiltering2': () => { return new CmdFiltering2()},
  'filtering': () => { return new Filtering()},
  'executing': () => { return new Executing()}
}

createState = (stateName, ...args) => {
    return createStateCb[stateName](...args)
}

module.exports = { createState }