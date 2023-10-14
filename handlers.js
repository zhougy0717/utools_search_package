const { exec, spawn } = require('child_process');
const mousetrap = require('mousetrap')
const util = require('util')
const { cmdHandler } = require('./command_handlers.js')

let g_items = []
const stateMachine = require('./state_machine.js')
const g_pkgmgrs = require('./package_managers.js')

asItems = (text) => {
  let items = []
  let lines = text.split("\n")
  const strippedLines = lines.filter(x => !/^\s*$/.test(x))
  strippedLines.forEach(line => {
    items.push({
      title: line
    })
  })
  return items
}

updateResult = (code, items) => {
  if (code == 0) {
    items.forEach(x => {
      x.description = "点击复制安装命令"
      x.icon = 'icons/install.png'
      x.action = 'install'
    })
  }
  else {
    items.forEach(x => {
      x.description = "点击复制本行日志"
      x.icon = 'icons/log.png'
      x.action = 'copy'
    })
    items.unshift({
      title:`命令错误退出, 错误码 ${code}`,
      icon: 'icons/error.png'
    })
  }
  return items
}

execCmd = async (args, cb, pkgmgr) => {
  let output = ""
  let cmdHandle = spawn (args[0], args.slice(1))
  cmdHandle.stdout.on('data', (data) => {
    output = output + data
  })
  cmdHandle.stderr.on('data', (data) => {
    output = output + data
  })
  cmdHandle.on('close', (code) => {
    const items = pkgmgr.handleCmdOutput(output)
    g_items = updateResult(code, items)
    cb(g_items)
    stateMachine.updateState('done', async() => {
      utools.setSubInputValue('')
    })      
  })
}

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
    stateMachine.updateState('command', async () => {})
    return callbackSetList([])
}

searchHandler = (action, searchWord, callbackSetList) => {
    const mgrCmd = action.code
    if (! mgrCmd in g_pkgmgrs) {
      return
    }
    if (/^\s*$/.test(searchWord)) {
      return
    }
    const pkgmgr = g_pkgmgrs[mgrCmd]
    const subcmdArgs = pkgmgr.subcmdArgs('search')
    let searchCmdArgs = [mgrCmd]
    searchCmdArgs = searchCmdArgs.concat(subcmdArgs).concat([searchWord])
    mousetrap.bind('enter', async () => {
      if (searchWord.startsWith(':') || searchWord.startsWith('：')) {
        cmdHandler(searchWord.slice(1))
        utools.setSubInputValue('')
        return
      }
      await stateMachine.updateState('execute', async ()=>{
        await execCmd(searchCmdArgs, callbackSetList, pkgmgr)
      })       
    })
    mousetrap.bind('ctrl+e', async () => {
      stateMachine.updateState('reset', async () => {
        utools.setSubInputValue('')
        g_items = []
        callbackSetList([])
      })
    })
    stateMachine.updateState('type', async () => {
        const filtered = g_items.filter(x => {
          return x.title.includes(searchWord)
        })
        callbackSetList(filtered)
    })
}

selectHandler = (action, itemData) => {
    if (itemData.action === 'copy') {
      utools.copyText(itemData.title);
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
      window.utools.hideMainWindow()
    }
}

module.exports = {enterHandler, searchHandler, selectHandler}