const stateTable = {
    command: {
        execute: "executing"
    },
    executing: {
        done: "filtering",
        reset: "command"
    },
    filtering: {
        reset: "command",
        type: "filtering"
    }
}
let g_mode = "command"
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