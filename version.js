class Version {
    constructor(verNums) {
        this.nums = verNums
    }

    olderThan(ver) {
        for (let i = 0; i < this.nums.length; i++) {
            if (i >= ver.nums.length) {
                return false
            }
            if (this.nums[i] > ver.nums[i]) {
                return false
            }
            else if (this.nums[i] < ver.nums[i]) {
                return true
            }
        }
        return false
    }
}

module.exports = Version
