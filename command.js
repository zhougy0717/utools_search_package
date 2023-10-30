const g_stateMachine = require('./state_machine.js')
const SearchCmd = require('./shell_commands/search_cmd.js');
const ListCmd = require('./shell_commands/list_cmd.js');
const pkgmgrFactory = require("./package_managers/pkgmgr_factory.js")
const TestSshCmd = require('./shell_commands/test_ssh_cmd.js');

pathCmd = async (args, mgrCmd, outputCb) => {
    if (args.length < 2 || /^\s*$/.test(args[1])) {
        window.utools.showNotification('环境变量PATH = ' + process.env.PATH)
        await g_stateMachine.updateState('reset', async () => {})
        return
    }
    const userAddedPaths = window.utools.dbStorage.getItem('userPaths') ?? []
    userAddedPaths.push(args[1])
    window.utools.dbStorage.setItem('userPaths', userAddedPaths)
    process.env.PATH = args[1] + ':' + process.env.PATH
    await g_stateMachine.updateState('reset', async () => {})
}

stateCmd = async (args, mgrCmd, outputCb) => {
    window.utools.showNotification(g_stateMachine.getState())
    await g_stateMachine.updateState('reset', async () => {})
}

listCmd = async (args, mgrCmd, outputCb) => {
    await g_stateMachine.updateState('execute', async () => {
        const cmd = new ListCmd(mgrCmd, [], outputCb)
        await cmd.doit()
    })
}

sshCmd = async (args, mgrCmd, outputCb) => {
    if (args.length < 2 || /^\s*$/.test(args[1])) {
        const sshArgs = window.utools.dbStorage.getItem('sshArgs') ?? []
        if (sshArgs.length === 0) {
            window.utools.showNotification(`ssh命令未配置`)
        }
        else {
            window.utools.showNotification(`ssh命令配置：\nssh ${sshArgs.join(' ')}`)
        }
        await g_stateMachine.updateState('reset', async () => {})
        return
    }
    await g_stateMachine.updateState('execute', async () => {
        const cmd = new TestSshCmd(args.slice(1))
        cmd.doit()
    })
}

searchCmd = async (args, mgrCmd, outputCb) => {
    await g_stateMachine.updateState('execute', async () => {
        const cmd = new SearchCmd(mgrCmd, args.slice(1), outputCb)
        await cmd.doit()
    })
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
    ssh: {
        title: 'ssh',
        description: '设置/显示ssh参数',
        handler: sshCmd
    },
    search: {
        handler: searchCmd
    }
}

cmdHandler = async (cmd, mgrCmd, outputCb) => {
    const args = cmd.split(' ')
    if (args[0] in g_cmds) {
        const cmdName = args[0]
        await g_cmds[cmdName].handler(args, mgrCmd, outputCb)
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