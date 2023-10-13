
enterHandler = () => {}
searchHandler = (text) => {
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

const g_subCmds = {
    install: ['install'],
    search: ['search']
}

getSubCmd = (type) => {
    return g_subCmds[type]
}

module.exports = {enterHandler, searchHandler, getSubCmd}