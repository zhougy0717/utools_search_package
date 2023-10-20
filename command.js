const g_stateMachine = require('./state_machine.js')
const SearchCmd = require('./shell_commands/search_cmd.js');
const ListCmd = require('./shell_commands/list_cmd.js');
const pkgmgrFactory = require("./package_managers/pkgmgr_factory.js")
const { exec, spawn } = require('child_process');

cmdHandler = async (cmd, mgrCmd, outputCb) => {
    const args = cmd.split(' ')
    if (args[0] === 'path') {
        if (args.length < 2 || /^\s*$/.test(args[1])) {
            window.utools.showNotification('环境变量PATH = ' + process.env.PATH)
            return
        }
        const userAddedPaths = window.utools.dbStorage.getItem('userPaths') ?? []
        userAddedPaths.push(args[1])
        window.utools.dbStorage.setItem('userPaths', userAddedPaths)
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
    else if (args[0] === 'ssh') {
        if (args.length < 2 || /^\s*$/.test(args[1])) {
            const sshArgs = window.utools.dbStorage.getItem('sshArgs') ?? []
            if (sshArgs.length === 0) {
                window.utools.showNotification(`ssh命令未配置`)
            }
            else {
                window.utools.showNotification(`ssh命令配置：\nssh ${sshArgs.join(' ')}`)
            }
            return
        }
        const sshArgs = ['-tt', ...args.slice(1), 'ls']
        let cmdProc = spawn ('ssh', sshArgs)
        cmdProc.on('close', (code) => {
            if (code == 0) {
                window.utools.dbStorage.setItem('sshArgs', ['-tt', ...args.slice(1)])  
                window.utools.showNotification(`测试连接成功: ${args[1]}`)
            }
        })
    }
}

copyInstallCmd = (mgrCmd, pkg, cb) => {
    if (!pkgmgrFactory.isSupport(mgrCmd)) {
        return
    }
    const pkgmgr = pkgmgrFactory.create(mgrCmd)
    const args = pkgmgr.subcmdArgs('install')
    const installCmd = mgrCmd + ' ' + args.join(' ') + ' ' + pkg
    cb(installCmd)
}

copyRemoveCmd = (mgrCmd, pkg, cb) => {
    if (!pkgmgrFactory.isSupport(mgrCmd)) {
        return
    }
    const pkgmgr = pkgmgrFactory.create(mgrCmd)
    const args = pkgmgr.subcmdArgs('remove')
    const removeCmd = mgrCmd + ' ' + args.join(' ') + ' ' + pkg
    cb(removeCmd)
}

module.exports = { cmdHandler, copyInstallCmd, copyRemoveCmd }