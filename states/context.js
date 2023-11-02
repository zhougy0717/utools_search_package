class Context {
    constructor(cbSetItems, cbGetItems, action, searchWord, callbackSetList) {
        this.setItems = cbSetItems
        this.getItems = cbGetItems
        this.action = action
        this.searchWord = searchWord
        this.callbackSetList = callbackSetList
    }
}

module.exports = Context
