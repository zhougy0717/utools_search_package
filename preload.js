const {enterHandler, searchHandler, selectHandler, placeHolder} = require('./handlers.js')
window.exports = {
  'brew': {
    mode: 'list',
    args: {
      enter: enterHandler,
      search: searchHandler,
      select: selectHandler,
      placeholder: placeHolder()
    }
  },
  'npm': {
    mode: 'list',
    args: {
      enter: enterHandler,
      search: searchHandler,
      select: selectHandler,
      placeholder: placeHolder()
    }
  },
  'apt': {
    mode: 'list',
    args: {
      enter: enterHandler,
      search: searchHandler,
      select: selectHandler,
      placeholder: placeHolder()
    }
  },
  'dnf': {
    mode: 'list',
    args: {
      enter: enterHandler,
      search: searchHandler,
      select: selectHandler,
      placeholder: placeHolder()
    }
  },
  'yum': {
    mode: 'list',
    args: {
      enter: enterHandler,
      search: searchHandler,
      select: selectHandler,
      placeholder: placeHolder()
    }
  },
  'choco': {
    mode: 'list',
    args: {
      enter: enterHandler,
      search: searchHandler,
      select: selectHandler,
      placeholder: placeHolder()
    }
  }
}
