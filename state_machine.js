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

async function updateState (trigger, action, context, trigger2) {
    if (g_mode == 'cmdFiltering' && trigger == '') {
        const oldState = g_mode
        const state = g_states[g_mode]
        g_mode = await state.update(trigger2, context)
        if (oldState !== g_mode) {
            g_lastMode = oldState
        }
    }
    if (trigger in stateTable[g_mode]) {
        const oldState = g_mode
        g_mode = stateTable[g_mode][trigger]
        if (oldState !== g_mode) {
            g_lastMode = oldState
        }
        await action(oldState, g_mode)
    }
}

getState = () => {
    return g_lastMode
}

setState = (name, state) => {
    g_states[name] = state
}

module.exports = {updateState, getState, setState}