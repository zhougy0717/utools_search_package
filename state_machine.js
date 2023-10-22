const stateTable = {
    init: {
        execute: "executing",
        inputCmd: "command"
    },
    command: {
        execute: "executing",
        type: "command",
        clearText: "init"
    },
    executing: {
        done: "filtering",
        reset: "init"
    },
    filtering: {
        reset: "init",
        type: "filtering",
        clearText: "filtering",
        inputCmd: "command"
    }
}
let g_mode = "init"
async function updateState (trigger, action) {
    if (trigger in stateTable[g_mode]) {
        const oldState = g_mode
        g_mode = stateTable[g_mode][trigger]
        await action(oldState, g_mode)
    }
}

getState = () => {
    return g_mode
}

module.exports = {updateState, getState}