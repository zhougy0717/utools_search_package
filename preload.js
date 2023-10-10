
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
execCmd = async (package, cb) => {
  let output = ""
  let cmdHandle = spawn ('brew', ['search', package])
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

window.exports = {
  'searchPackage': {
    mode: 'list',
    args: {
      enter: (action, callbackSetList) => {
        if(utools.isMacOs() || utools.isLinux()) {
          process.env.PATH = '/usr/local/bin:~/bin:~/tools/bin:' + process.env.PATH
        }
        else if (utools.isWindows()) {
          process.env.PATH = '~/tools/bin;' + process.env.PATH
        }
        utools.setSubInputValue('输入命令以执行')
        return callbackSetList([])
      },
      search: (action, searchWord, callbackSetList) => {
        mousetrap.bind('enter', async () => {
          await stateMachine.updateState('execute', async ()=>{
            await execCmd(searchWord, callbackSetList)
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
      },
      select: (action, itemData) => {
        if (itemData.action === 'copy') {
          utools.copyText(itemData.title);
        }
        else if (itemData.action == 'install') {
          const cmd = 'brew install ' + itemData.title
          utools.copyText('brew install ' + itemData.title);
          window.utools.showNotification("安装命令已复制\n" + cmd)
          window.utools.hideMainWindow()
        }
      },
      placeholder: "搜索软件包，输入ctrl+e可以重新搜索"
    }
  }
}
