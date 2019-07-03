export const faceUtils = {
  faceItems: Array(141),
  faces: function () {
    const self = this
    const arr = {}
    for (let i = 0; i < self.faceItems.length; i++) {
      arr[self[i]] = './face' + i + '.png'
    }
    return arr
  }
}
