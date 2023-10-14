const stateMachine = require('./state_machine.js')

cmdHandler = (cmd) => {
    const args = cmd.split(' ')
    if (args[0] === 'path') {
        if (args.length < 2 || /^\s*$/.test(args[1])) {
            window.utools.showNotification(process.env.PATH)
            return
        }
        process.env.PATH = args[1] + ':' + process.env.PATH
    }
    else if (args[0] === 'state') {
        window.utools.showNotification(stateMachine.getState())

    }
}
module.exports = {cmdHandler}