const mousetrap = require('mousetrap')
const { cmdHandler, copyInstallCmd, copyRemoveCmd, cmdItems } = require('./command.js')
const pkgmgrFactory = require("./package_managers/pkgmgr_factory.js")
const Context = require('./states/context.js')
const CmdFiltering = require('./states/cmd_filtering.js')
const CmdFiltering2 = require('./states/cmd_filtering2.js')
const Init = require('./states/init.js')
const Filtering = require('./states/filtering.js')
const Executing = require('./states/executing.js')

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

    g_stateMachine.initState('init')
    g_stateMachine.setState('cmdFiltering', new CmdFiltering())
    g_stateMachine.setState('cmdFiltering2', new CmdFiltering2())
    g_stateMachine.setState('init', new Init())
    g_stateMachine.setState('filtering', new Filtering())
    g_stateMachine.setState('executing', new Executing())
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

    g_stateMachine.updateState('type', context)

    mousetrap.bind('enter', async () => {
        if (searchWord.startsWith(':') || searchWord.startsWith('：')) {
            await cmdHandler(searchWord.slice(1), mgrCmd, updateItemCb, context)
            utools.setSubInputValue('')
        }
        else {
            await cmdHandler('search ' + searchWord, mgrCmd, updateItemCb, context)
        }
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