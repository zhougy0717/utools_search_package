const mousetrap = require('mousetrap')
const { copyInstallCmd, copyRemoveCmd } = require('./command.js')
const pkgmgrFactory = require("./package_managers/pkgmgr_factory.js")
const Context = require('./states/context.js')
const { createState } = require('./states/state_factory.js')

let g_items = []
const g_stateMachine = require('./states/state_machine.js')

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

    const initState = createState('init')
    g_stateMachine.initState(initState)
    return callbackSetList([])
}

searchHandler = (action, searchWord, callbackSetList) => {
    const mgrCmd = action.code
    if (!pkgmgrFactory.isSupport(mgrCmd)) {
        return
    }
    const setItems = (items) => {
      g_items = items
    }
    const getItems = () => {
      return g_items
    }

    const context = new Context(
      setItems, getItems, action, 
      searchWord, callbackSetList,null,
      searchHandler)

    updateItemCb = (code, outItems) => {
      if(outItems.length > 0) {
        g_items = outItems
        callbackSetList(g_items)
        utools.setSubInput(({text}) => {
          searchHandler({code: mgrCmd}, text, callbackSetList)
        }, '输入字符过滤列表，输入ctrl+e可以重新搜索')
        g_stateMachine.updateState('done', context)
      }
      else {
        utools.setSubInput(({text}) => {
          searchHandler({code: mgrCmd}, text, callbackSetList)
        }, '搜索软件包, 输入冒号进入命令模式')
        g_stateMachine.updateState('reset', context)
      }
    }

    context.outputCb = updateItemCb
    context.createState = createState
    g_stateMachine.updateState('type', context)

    mousetrap.bind('enter', async () => {
      g_stateMachine.updateState('command', context)
    })

    mousetrap.bind('ctrl+e', async () => {
      g_stateMachine.updateState('reset', context)
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
    else if (itemData.action === 'cmdComplete') {
      utools.setSubInputValue(`:${itemData.title}`)
    }

    if (itemData.action !== 'cmdComplete') {
      window.utools.hideMainWindow()
    }
}

placeHolder = () => {
  return '搜索软件包, 输入冒号进入命令模式'
}

module.exports = {enterHandler, searchHandler, selectHandler, placeHolder}