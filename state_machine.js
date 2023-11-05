let g_mode = null
let g_lastMode = null
let g_states = {}

async function updateState (trigger, context) {
    const oldState = g_mode
    const state = g_states[g_mode]
    g_mode = await state.update(trigger, context)
    if (oldState !== g_mode) {
        g_lastMode = oldState
    }
}

getState = () => {
    return g_lastMode
}

setState = (name, state) => {
    g_states[name] = state
}

initState = (state) => {
    if (g_mode === null) {
        g_mode = state
        g_lastMode = state
    }
}

module.exports = {updateState, getState, setState, initState}