
const { exec, spawn } = require('child_process');
const mousetrap = require('mousetrap')
const util = require('util')
const execPromise = util.promisify(exec);
execCmd = async cmd => {
  let result = []
  try {
    // const { stdout, stderr } = await execPromise(cmd);
    exec (cmd, (error, stdout, stderr) => {
      if (error) {
        console.log(`${error}`)
        return
      }
      const pkgs = stdout.split('\n').filter(word => !/^\s*$/.test(word))
      pkgs.forEach(pkg => {
        result.push({
          title: pkg
        })
      })
    })
    
  } catch (error) {
    console.error('执行出错：', error);
    result = [{
      title: error.stderr,
    }]
  }
  return result
}

window.exports = {
  'shortcuts': {
    mode: 'list',
    args: {
      enter: (action, callbackSetList) => {
        return callbackSetList([])
      },
      search: (action, searchWord, callbackSetList) => {
        mousetrap.bind('enter', async () => {
          const itemList = await execCmd(searchWord)
          return callbackSetList(itemList)
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
