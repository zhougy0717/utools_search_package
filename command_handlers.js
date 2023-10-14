cmdHandler = (cmd) => {
    const args = cmd.split(' ')
    if (args[0] === 'path') {
        if (args.length < 2 || /^\s*$/.test(args[1])) {
            return
        }
        process.env.PATH = args[1] + ':' + process.env.PATH
    }
}
module.exports = {cmdHandler}