const { exec, spawn } = require('child_process');
const mousetrap = require('mousetrap')
const util = require('util')

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

updateResult = (code, output) => {
  const items = asItems(output)
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

let g_items = []
const stateMachine = require('./state_machine.js')
const g_cmdArgs = {
  brew: {
    install: ['install'],
    search: ['search']
  }
}
execCmd = async (args, package, cb) => {
  let output = ""
  let cmdHandle = spawn (args[0], args.slice(1))
  cmdHandle.stdout.on('data', (data) => {
    output = output + data
  })
  cmdHandle.stderr.on('data', (data) => {
    output = output + data
  })
  cmdHandle.on('close', (code) => {
    g_items = updateResult(code, output)
    cb(g_items)
    stateMachine.updateState('done', async() => {
      utools.setSubInputValue('')
    })      
  })
}

enterHandler = (action, callbackSetList) => {
    if(utools.isMacOs() || utools.isLinux()) {
      process.env.PATH = '/usr/local/bin:~/bin:~/tools/bin:' + process.env.PATH
    }
    else if (utools.isWindows()) {
      process.env.PATH = '~/tools/bin;' + process.env.PATH
    }
    utools.setSubInputValue('输入命令以执行')
    return callbackSetList([])
  }

  searchHandler = (action, searchWord, callbackSetList) => {
    const mgrCmd = action.code
    if (! action.code in g_cmdArgs) {
      return
    }
    if (/^\s*$/.test(searchWord)) {
      return
    }
    const searchCmdArgs = [
      mgrCmd,
      g_cmdArgs[mgrCmd]['search'],
      searchWord
    ]
    mousetrap.bind('enter', async () => {
      await stateMachine.updateState('execute', async ()=>{
        await execCmd(searchCmdArgs, searchWord, callbackSetList)
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
      if (! mgrCmd in g_cmdArgs) {
        return
      }
      const args = g_cmdArgs[mgrCmd]['install']
      const installCmd = action.code + ' ' + args.join(' ') + ' ' + itemData.title
      utools.copyText(installCmd);
      window.utools.showNotification("安装命令已复制\n" + installCmd)
      window.utools.hideMainWindow()
    }
  }

  module.exports = {enterHandler, searchHandler, selectHandler}