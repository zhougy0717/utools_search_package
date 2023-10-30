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
async function updateState (trigger, action) {
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

module.exports = {updateState, getState}