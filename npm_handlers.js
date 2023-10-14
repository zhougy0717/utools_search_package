
enterHandler = () => {
}
searchHandler = (output) => {
    const lines = output.split('\n')
    let wordMatrix = []
    lines.forEach(x => {
        const words = x.split('|').map(y => {
            return y.trim()
        })
        wordMatrix.push(words)
    });
    const head = wordMatrix[0]
    const items = []
    const nameIdx = head.indexOf('NAME')
    const verIdx = head.indexOf('VERSION')
    const descIdx = head.indexOf('DESCRIPTION')
    wordMatrix.splice(1).forEach(x => {
        const pkg = {
            title: `${x[nameIdx]} v${x[verIdx]}`,
            description: x[descIdx]
        }
        items.push(pkg)
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