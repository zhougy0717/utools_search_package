const g_stateMachine = require('./states/state_machine.js')
const ListCmd = require('./shell_commands/list_cmd.js');
const UpgradeCmd = require('./shell_commands/upgrade_cmd.js');
const pkgmgrFactory = require("./package_managers/pkgmgr_factory.js")
const TestSshCmd = require('./shell_commands/test_ssh_cmd.js');

pathCmd = async (args, context) => {
    if (args.length < 2 || /^\s*$/.test(args[1])) {
        window.utools.showNotification('环境变量PATH = ' + process.env.PATH)
        await g_stateMachine.updateState('reset', context)
        return
    }
    const userAddedPaths = window.utools.dbStorage.getItem('userPaths') ?? []
    userAddedPaths.push(args[1])
    window.utools.dbStorage.setItem('userPaths', userAddedPaths)
    process.env.PATH = args[1] + ':' + process.env.PATH
    await g_stateMachine.updateState('reset', context)
}

stateCmd = async (args, context) => {
    window.utools.showNotification(g_stateMachine.getState())
    await g_stateMachine.updateState('reset', context)
}

listCmd = async (args, context) => {
    const mgrCmd = context.action.code
    const cmd = new ListCmd(mgrCmd, [], context.outputCb)
    const cmdProc = await cmd.doit()
    context.cmdProc = cmdProc
    await g_stateMachine.updateState('execute', context)
}

upgradeCmd = async (args, context) => {
    const mgrCmd = context.action.code
    const cmd = new UpgradeCmd(mgrCmd, [], context.outputCb)
    const cmdProc = await cmd.doit()
    context.cmdProc = cmdProc
    await g_stateMachine.updateState('execute', context)
}

sshCmd = async (args, context) => {
    if (args.length < 2 || /^\s*$/.test(args[1])) {
        const sshRecords = window.utools.dbStorage.getItem('sshRecords') ?? []
        if (sshRecords.length === 0 || sshRecords[0].length === 0) {
            window.utools.showNotification(`ssh命令未配置`)
        }
        else {
            window.utools.showNotification(`ssh命令配置：\nssh ${sshRecords[0].join(' ')}`)
        }
        await g_stateMachine.updateState('reset', context)
        return
    }
    const cmd = new TestSshCmd(args, ()=>{
        g_stateMachine.updateState('reset', context)
    })
    const cmdProc = await cmd.doit()
    context.cmdProc = cmdProc
    await g_stateMachine.updateState('execute', context)
}

searchCmd = async (args, context) => {
    await g_stateMachine.updateState('execute', context)
}

let g_cmds = {
    path: {
        title: 'path',
        description: '无参数：显示当前PATH环境变量，有1个参数：将该参数加入PATH环境变量',
        handler: pathCmd
    },
    state: {
        title: 'state',
        description: '显示当前输入状态',
        handler: stateCmd
    },
    list: {
        title: 'list',
        description: '显示已安装包列表',
        handler: listCmd
    },
    upgrade: {
        title: 'upgrade',
        description: '显示待更新包列表',
        handler: upgradeCmd
    },
    ssh: {
        title: 'ssh',
        description: '设置/显示ssh参数',
        handler: sshCmd
    },
    search: {
        handler: searchCmd
    }
}

cmdHandler = async (cmd, mgrCmd, outputCb, context) => {
    const args = cmd.split(' ')
    if (args[0] in g_cmds) {
        const cmdName = args[0]
        await g_cmds[cmdName].handler(args, context)
        utools.setSubInputValue('')
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

copyRemoveCmd = (mgrCmd, pkg, cb) => {
    if (!pkgmgrFactory.isSupport(mgrCmd)) {
        return
    }
    const pkgmgr = pkgmgrFactory.create(mgrCmd)
    const args = pkgmgr.subcmdArgs('update')
    const updateCmd = mgrCmd + ' ' + args.join(' ') + ' ' + pkg
    cb(updateCmd)
}

cmdItems = () => {
    let items = []
    for (var key in g_cmds) {
        if (! ('title' in g_cmds[key])) {
            continue
        }
        g_cmds[key]['action'] = 'cmdComplete'
        items.push(g_cmds[key])
    }
    return items
}

module.exports = { cmdHandler, copyInstallCmd, copyRemoveCmd, cmdItems }