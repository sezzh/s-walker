const swalker = require('../index.js')
const path = require('path')

test('Should have 10 files in the list', () => {
  const arrayMock = [
    '/Users/sezzh/github/s-walker/test/src/tifis.md',
    '/Users/sezzh/github/s-walker/test/src/css/styles.css',
    '/Users/sezzh/github/s-walker/test/src/java/class.java',
    '/Users/sezzh/github/s-walker/test/src/js/gordito.js',
    '/Users/sezzh/github/s-walker/test/src/js/hasper.js',
    '/Users/sezzh/github/s-walker/test/src/js/trufo.js',
    '/Users/sezzh/github/s-walker/test/src/css/sass/styles.scss',
    '/Users/sezzh/github/s-walker/test/src/css/stylus/styles.styl',
    '/Users/sezzh/github/s-walker/test/src/js/components/index.js',
    '/Users/sezzh/github/s-walker/test/src/css/sass/component/file.less'
  ]

  return expect(swalker.walk(path.resolve(__dirname, 'src')))
    .resolves.toEqual(arrayMock)
})

test('Should return an error message', () => {
  const wrongPath = 'holi'

  return expect(swalker.walk(wrongPath)).rejects.toMatch('error')
})

test('Should have 2 files', () => {
  const arrayMock = [
    '/Users/sezzh/github/s-walker/test/docs/html/index.html',
    '/Users/sezzh/github/s-walker/test/docs/markdown/component.md'
  ]

  return expect(swalker.walk(path.resolve(__dirname, 'docs')))
    .resolves.toEqual(arrayMock)
})

test('Should return only js and css files', () => {
  const arrayMock = [
    '/Users/sezzh/github/s-walker/test/src/css/styles.css',
    '/Users/sezzh/github/s-walker/test/src/js/gordito.js',
    '/Users/sezzh/github/s-walker/test/src/js/hasper.js',
    '/Users/sezzh/github/s-walker/test/src/js/trufo.js',
    '/Users/sezzh/github/s-walker/test/src/js/components/index.js'
  ]

  return expect(
    swalker.walk(path.resolve(__dirname, 'src'), {only: ['.js', '.css']})
  ).resolves.toEqual(arrayMock)
})
