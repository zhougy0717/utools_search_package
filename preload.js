
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
      title: line,
      description: "选中后执行安装",
    })
  })
  return items
}
outputItems = () => {

}

setupCmdCbs = () => {}
execCmd = async (cmd, cb) => {
  let output = ""
  let items = []
  let args = cmd.split(" ")
  let cmdHandle = spawn (args[0], args.slice(1))
  
  cmdHandle.stdout.on('data', (data) => {
    items = updateOutput(output, data)
    cb(items)
  })
  cmdHandle.stderr.on('data', (data) => {
    items = updateOutput(output, data)
    cb(items)
  })
  cmdHandle.on('close', (code) => {
    if (code == 0) {
      items.unshift({
        title:'命令成功退出, 复制全部行'
      })
    }
    else {
      items.forEach(x => {
        x.description = "点击复制文本"
      })
      items.unshift({
        title:`命令错误退出, 错误码 ${code}`
      })
    }
    cb(items)
  })
  cmdHandle.on('error', (err) =>{
    items.push({
      title:`命令结束, 错误码 ${err.code} (${err.errno})`
    })
    cb(items)
  })
}

window.exports = {
  'shortcuts': {
    mode: 'list',
    args: {
      enter: (action, callbackSetList) => {
        if(utools.isMacOs() || utools.isLinux()) {
          process.env.PATH = '/usr/local/bin:~/bin:~/tools/bin:' + process.env.PATH
        }
        else if (utools.isWindows()) {
          process.env.PATH = '~/tools/bin;' + process.env.PATH
        }
        return callbackSetList([])
      },
      search: (action, searchWord, callbackSetList) => {
        mousetrap.bind('enter', async () => {
          await execCmd(searchWord, callbackSetList)
          return 0
        })
        
      },
      // select: (action, itemData) => {
      //   Mousetrap.bind('enter', async () => {
      //     var icons = await search(searchWord);
      //     callbackSetList(icons)
      //     return false
      // });
      //   const cmd = itemData.title
      //   );
      // },
      placeholder: "搜索快捷键，回车直接执行（部分需要手动执行）"
    }
  }
}
