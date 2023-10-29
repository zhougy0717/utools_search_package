const mousetrap = require('mousetrap')
const { cmdHandler, copyInstallCmd, copyRemoveCmd } = require('./command.js')
const pkgmgrFactory = require("./package_managers/pkgmgr_factory.js")

let g_items = []
const g_stateMachine = require('./state_machine.js')

enterHandler = (action, callbackSetList) => {
    const mgrCmd = action.code
    if (!pkgmgrFactory.isSupport(mgrCmd)) {
        return
    }
    const userAddedPaths = window.utools.dbStorage.getItem('userPaths') ?? []
    if(utools.isMacOs() || utools.isLinux()) {
        process.env.PATH = '/usr/local/bin:~/bin:~/tools/bin:' + process.env.PATH
        if (userAddedPaths.length > 0) {
            const userPath = userAddedPaths.join(':')
            process.env.PATH = userPath + ":" + process.env.PATH
        }
    }
    else if (utools.isWindows()) {
        process.env.PATH = '~/tools/bin;' + process.env.PATH
        if (userAddedPaths.length > 0) {
            const userPath = userAddedPaths.join(';')
            process.env.PATH = userPath + ";" + process.env.PATH
        }
    }

    g_stateMachine.updateState('reset', async () => {})
    return callbackSetList([])
}

searchHandler = (action, searchWord, callbackSetList) => {
    const mgrCmd = action.code
    if (!pkgmgrFactory.isSupport(mgrCmd)) {
        return
    }
    if (searchWord === ":" || searchWord === "：") {
      g_stateMachine.updateState('inputCmd', async (oldState, newState) => {
        // TODO: set g_items to commands items
        callbackSetList([])
      })
      return
    }
    if (/^\s*$/.test(searchWord)) {
        g_stateMachine.updateState('clearText', async (oldState, newState) => {
          if (oldState === "command" && newState === "init") {
            callbackSetList([])
          }
          else {
            callbackSetList(g_items)
          }
        })
        return
    }
    else {
      g_stateMachine.updateState('type', async (oldState, newState) => {
        const filtered = g_items.filter(x => {
          return x.title.includes(searchWord)
        })
        callbackSetList(filtered)
      })
    }

    updateItemCb = (code, outItems) => {
      if(outItems.length > 0) {
        g_items = outItems
        callbackSetList(g_items)
        utools.setSubInput(({text}) => {
          searchHandler({code: mgrCmd}, text, callbackSetList)
        }, '输入字符过滤列表，输入ctrl+e可以重新搜索')
      }
      else {
        utools.setSubInput(({text}) => {
          searchHandler({code: mgrCmd}, text, callbackSetList)
        }, '搜索软件包, 输入冒号进入命令模式')
      }
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
        utools.setSubInput(({text}) => {
          searchHandler({code: mgrCmd}, text, callbackSetList)
        }, '搜索软件包, 输入冒号进入命令模式')
        g_items = []
        callbackSetList([])
      })
    })

    
}

selectHandler = (action, itemData) => {
    if (itemData.action === 'copy') {
      utools.copyText(itemData.title);
      window.utools.showNotification("错误日志已复制\n")
    }
    else if (itemData.action == 'install') {
      copyInstallCmd(action.code, itemData.title, (text) => {
        utools.copyText(text);
        window.utools.showNotification("安装命令已复制\n" + text)
      })
    }
    else if (itemData.action == 'list') {
      copyRemoveCmd(action.code, itemData.title, (text) => {
        utools.copyText(text);
        window.utools.showNotification("删除命令已复制\n" + text)
      })
    }
    window.utools.hideMainWindow()
}

placeHolder = () => {
  return '搜索软件包, 输入冒号进入命令模式'
}

module.exports = {enterHandler, searchHandler, selectHandler, placeHolder}