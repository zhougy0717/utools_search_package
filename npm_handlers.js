
enterHandler = () => {
}
searchHandler = (output) => {
    const lines = output.split('\n')
    let wordMatrix = []
    lines.forEach(x => {
        const words = x.split('\t').map(y => {
            return y.trim()
        })
        wordMatrix.push(words)
    });
    const head = wordMatrix[0]
    const items = []
    // The output line looks like this
    // git     A node.js library for git       =christkv       2013-06-24      0.1.5
    // with `--parseable' option, the head line disappears, so hardcode as below.
    const nameIdx = 0
    const verIdx = 4
    const descIdx = 1
    wordMatrix.forEach(x => {
        const pkg = {
            title: x[nameIdx],
            description: `版本：v${x[verIdx]}，${x[descIdx]}`
        }
        items.push(pkg)
    })
    return items
}

const g_subCmds = {
    install: ['install'],
    search: ['search', '--parseable'],
    list: ['list', '-g']
}

getSubCmd = (type) => {
    return g_subCmds[type]
}

module.exports = {enterHandler, searchHandler, getSubCmd}