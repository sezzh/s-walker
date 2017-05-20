const swalker = require('../index.js')
const path = require('path')

test('Should have 7 files in the list', () => {
  const arrayMock = [
    '/Users/sezzh/github/s-walker/test/src/tifis.md', '/Users/sezzh/github/s-walker/test/src/css/styles.css', '/Users/sezzh/github/s-walker/test/src/java/class.java', '/Users/sezzh/github/s-walker/test/src/js/gordito.js', '/Users/sezzh/github/s-walker/test/src/js/hasper.js', '/Users/sezzh/github/s-walker/test/src/js/trufo.js', '/Users/sezzh/github/s-walker/test/src/js/components/index.js'
  ]

  return expect(swalker.walk(path.resolve(__dirname, 'src'))).resolves.toEqual(arrayMock)
})

test('Should return an error message', () => {
  const wrongPath = 'holi'

  return expect(swalker.walk(wrongPath)).rejects.toMatch('error')
})
