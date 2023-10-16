const { spawn } = require('child_process');
const Nanobar = require('nanobar')
const g_stateMachine = require('./state_machine.js')
const g_pkgmgrs = require('./package_managers.js')
const ShellCmd = require('./shell_command.js')

// const g_cmds = {
//     install: installCmd,
//     list: listCmd
// }

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
        const pkgmgr = g_pkgmgrs[mgrCmd]
        const subcmdArgs = pkgmgr.subcmdArgs('list')
        let listCmdArgs = [mgrCmd]
        listCmdArgs = listCmdArgs.concat(subcmdArgs)
        await g_stateMachine.updateState('execute', async ()=>{
            const cmd = new ShellCmd(mgrCmd, subcmdArgs, outputCb)
            await cmd.doit()
        })
    }
    else if (args[0] === 'search') {
        await g_stateMachine.updateState('execute', async ()=>{
            const pkgmgr = g_pkgmgrs[mgrCmd]
            const subcmdArgs = pkgmgr.subcmdArgs('search')
            const searchWord = args[1]
            const cmd = new ShellCmd(mgrCmd, [...subcmdArgs, searchWord], outputCb)
            await cmd.doit()
        })
    }
}


module.exports = {cmdHandler}