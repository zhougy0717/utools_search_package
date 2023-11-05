const stateTable = {
    init: {
        execute: "executing",
        inputCmd: "cmdFiltering"
    },
    cmdFiltering: {
        execute: "executing",
        type: "cmdFiltering",
        clearText: "init",
        reset: "init",
        inputCmd: "cmdFiltering"
    },
    executing: {
        done: "filtering",
        reset: "init"
    },
    filtering: {
        reset: "init",
        type: "filtering",
        clearText: "filtering",
        inputCmd: "cmdFiltering"
    }
}
let g_mode = "init"
let g_lastMode = "init"
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

module.exports = {updateState, getState, setState}