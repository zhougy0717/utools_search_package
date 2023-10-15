const stateMachine = require('./state_machine.js')
const g_pkgmgrs = require('./package_managers.js')

cmdHandler = async (cmd, mgrCmd, listCb, execCb) => {
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
    else if (args[0] === 'list') {
        const pkgmgr = g_pkgmgrs[mgrCmd]
        const subcmdArgs = pkgmgr.subcmdArgs('list')
        let listCmdArgs = [mgrCmd]
        listCmdArgs = listCmdArgs.concat(subcmdArgs)
        g_stateMachine.updateState('execute', async ()=>{
            await execCmd(searchCmdArgs, callbackSetList, pkgmgr)
        })
    }
}
module.exports = {cmdHandler}