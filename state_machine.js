let g_mode = ""
let g_lastMode = ""
let g_states = {}

async function updateState (trigger, context) {
    const oldState = g_mode
    if (typeof(g_mode) === 'string') {
        const state = g_states[g_mode]
        g_mode = await state.update(trigger, context)
        if (oldState !== g_mode) {
            g_lastMode = oldState
        }
    }
    else {
        g_mode = await g_mode.update(trigger, context)
        if (!Object.is(oldState, g_mode)) {
            g_lastMode = oldState
        }
    }
}

getState = () => {
    if (typeof(g_lastMode) === 'string') {
        return g_lastMode
    }
    else {
        return g_lastMode.name
    }
}

setState = (name, state) => {
    g_states[name] = state
}

initState = (state) => {
    if (g_mode === "") {
        g_mode = state
        g_lastMode = state
    }
}

module.exports = {updateState, getState, setState, initState}