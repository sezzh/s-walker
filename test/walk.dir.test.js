const swalker = require('../index.js')
const path = require('path')

swalker.walk(path.resolve(__dirname, 'src')).then((fileList) => {
  console.log('current three:')
  console.log(fileList)
})
