let g_mode = ""
let g_lastMode = ""

changeState = (state) => {
    g_mode = state
}
async function updateState (trigger, context) {
    const oldState = g_mode
    context.changeState = changeState
    await g_mode.update(trigger, context)
    if (!Object.is(oldState, g_mode)) {
        g_lastMode = oldState
    }
}

getState = () => {
    return g_lastMode.name
}

initState = (state) => {
    if (g_mode === "") {
        g_mode = state
        g_lastMode = state
    }
}

module.exports = {updateState, getState, initState}