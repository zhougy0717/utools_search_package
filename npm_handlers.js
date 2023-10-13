
enterHandler = () => {}
searchHandler = () => {}

const g_subCmds = {
    install: ['install'],
    search: ['search']
}

getSubCmd = (type) => {
    return g_subCmds[type]
}

module.exports = {enterHandler, searchHandler, getSubCmd}