
const { exec, spawn } = require('child_process');
const mousetrap = require('mousetrap')
const util = require('util')
// const execPromise = util.promisify(exec);
// 触发命令，记录命令输出
// 当有数据到达时，合入命令输出，并按照\n切割
// 当close状态到达时，输出所有的信息
// 选择item时，复制对应的文本
// 最后添加一项，复制所有文本

updateOutput = (existingOutput, data) => {
  let items = []
  const output = existingOutput + data
  let lines = output.split("\n")
  const strippedLines = lines.filter(x => !/^\s*$/.test(x))
  strippedLines.forEach(line => {
    items.push({
      title: line
    })
  })
  return [output, items]
}

updateResult = (code, items, setList) => {
  if (code == 0) {
    items.forEach(x => {
      x.description = "选中后执行安装"
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
  setList(items)
}

let g_items = []
const stateMachine = require('./state_machine.js')
execCmd = async (package, cb) => {
  let output = ""
  let items = []
  // let args = cmd.split(" ")
  // if (args.length < 1 || /^\s*$/.test(args[0])) {
  //   return
  // }
  let cmdHandle = spawn ('brew', ['search', package])
  cmdHandle.stdout.on('data', (data) => {
    [output, items] = updateOutput(output, data)
  })
  cmdHandle.stderr.on('data', (data) => {
    [output, items] = updateOutput(output, data)
  })
  cmdHandle.on('close', (code) => {
    updateResult(code, items, cb)
    g_items = items
    stateMachine.updateState('done', async() => {
      utools.setSubInputValue('')
      utools.setSubInput(()=>{}, '搜索列表项,使用ctrl+e,回到命令输入模式', true)
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
            utools.setSubInput(()=>{}, '输入命令以执行', true)
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
        if (itemData.action === 'fail') {
          utools.copyText(itemData.title);
        }
      },
      placeholder: "输入命令以执行"
    }
  }
}
