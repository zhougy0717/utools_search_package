class Context {
    constructor(
        cbSetItems, cbGetItems, action, 
        searchWord, callbackSetList, outputCb) {
        this.setItems = cbSetItems
        this.getItems = cbGetItems
        this.action = action
        this.searchWord = searchWord
        this.callbackSetList = callbackSetList
        this.outputCb = outputCb
        this.searchHandler = searchHandler
    }
}

module.exports = Context
