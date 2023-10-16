const { exec, spawn } = require('child_process');
const mousetrap = require('mousetrap')
const util = require('util')
const Nanobar = require('nanobar')
const { cmdHandler } = require('./command.js')
const ShellCmd = require('./shell_command.js')

let g_items = []
const g_stateMachine = require('./state_machine.js')
const g_pkgmgrs = require('./package_managers.js')

enterHandler = (action, callbackSetList) => {
    const mgrCmd = action.code
    if (! mgrCmd in g_pkgmgrs) {
      return
    }
    if(utools.isMacOs() || utools.isLinux()) {
        process.env.PATH = '/usr/local/bin:~/bin:~/tools/bin:' + process.env.PATH
    }
    else if (utools.isWindows()) {
        process.env.PATH = '~/tools/bin;' + process.env.PATH
    }
    const pkgmgr = g_pkgmgrs[mgrCmd]
    pkgmgr.enter()
    g_stateMachine.updateState('reset', async () => {})
    return callbackSetList([])
}

searchHandler = (action, searchWord, callbackSetList) => {
    const mgrCmd = action.code
    if (! mgrCmd in g_pkgmgrs) {
      return
    }
    if (/^\s*$/.test(searchWord)) {
        callbackSetList(g_items)
        return
    }
    
    updateItemCb = (outItems) => {
        g_items = outItems
        callbackSetList(g_items)
    }

    mousetrap.bind('enter', async () => {
        if (searchWord.startsWith(':') || searchWord.startsWith('：')) {
            await cmdHandler(searchWord.slice(1), mgrCmd, updateItemCb)
            utools.setSubInputValue('')
        }
        else {
            await cmdHandler('search ' + searchWord, mgrCmd, updateItemCb)
        }
    })

    mousetrap.bind('ctrl+e', async () => {
      g_stateMachine.updateState('reset', async () => {
        utools.setSubInputValue('')
        g_items = []
        callbackSetList([])
      })
    })

    g_stateMachine.updateState('type', async () => {
        const filtered = g_items.filter(x => {
          return x.title.includes(searchWord)
        })
        callbackSetList(filtered)
    })
}

selectHandler = (action, itemData) => {
    if (itemData.action === 'copy') {
      utools.copyText(itemData.title);
      window.utools.showNotification("错误日志已复制\n")
    }
    else if (itemData.action == 'install') {
      const mgrCmd = action.code
      if (! mgrCmd in g_pkgmgrs) {
        return
      }
      const args = g_pkgmgrs[mgrCmd].subcmdArgs('install')
      const installCmd = action.code + ' ' + args.join(' ') + ' ' + itemData.title
      utools.copyText(installCmd);
      window.utools.showNotification("安装命令已复制\n" + installCmd)
    }
    window.utools.hideMainWindow()
}

module.exports = {enterHandler, searchHandler, selectHandler}