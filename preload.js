const {enterHandler, searchHandler, selectHandler} = require('./handlers.js')
window.exports = {
  'brew': {
    mode: 'list',
    args: {
      enter: enterHandler,
      search: searchHandler,
      select: selectHandler,
      placeholder: "搜索软件包，输入ctrl+e可以重新搜索"
    }
  },
  'npm': {
    mode: 'list',
    args: {
      enter: enterHandler,
      search: searchHandler,
      select: selectHandler,
      placeholder: "搜索软件包，输入ctrl+e可以重新搜索"
    }
  }
}
