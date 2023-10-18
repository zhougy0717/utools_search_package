const g_stateMachine = require('./state_machine.js')
const SearchCmd = require('./shell_commands/search_cmd.js');
const ListCmd = require('./shell_commands/list_cmd.js');

cmdHandler = async (cmd, mgrCmd, outputCb) => {
    const args = cmd.split(' ')
    if (args[0] === 'path') {
        if (args.length < 2 || /^\s*$/.test(args[1])) {
            window.utools.showNotification('环境变量PATH = ' + process.env.PATH)
            return
        }
        process.env.PATH = args[1] + ':' + process.env.PATH
    }
    else if (args[0] === 'state') {
        window.utools.showNotification(g_stateMachine.getState())
    }
    else if (args[0] === 'list') {
        await g_stateMachine.updateState('execute', async () => {
            const cmd = new ListCmd(mgrCmd, [], outputCb)
            await cmd.doit()
        })
    }
    else if (args[0] === 'search') {
        await g_stateMachine.updateState('execute', async () => {
            const cmd = new SearchCmd(mgrCmd, args.slice(1), outputCb)
            await cmd.doit()
        })
    }
}

module.exports = { cmdHandler }