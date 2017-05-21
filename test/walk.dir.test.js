const swalker = require('../index.js')
const path = require('path')

test('Should have 10 files in the list', () => {
  const arrayMock = [
    path.join(__dirname, '/src/tifis.md'),
    path.join(__dirname, '/src/css/styles.css'),
    path.join(__dirname, '/src/java/class.java'),
    path.join(__dirname, '/src/js/gordito.js'),
    path.join(__dirname, '/src/js/hasper.js'),
    path.join(__dirname, '/src/js/trufo.js'),
    path.join(__dirname, '/src/css/sass/styles.scss'),
    path.join(__dirname, '/src/css/stylus/styles.styl'),
    path.join(__dirname, '/src/js/components/index.js'),
    path.join(__dirname, '/src/css/sass/component/file.less')
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
    path.join(__dirname, '/docs/html/index.html'),
    path.join(__dirname, '/docs/markdown/component.md')
  ]

  return expect(swalker.walk(path.resolve(__dirname, 'docs')))
    .resolves.toEqual(arrayMock)
})

test('Should return only js and css files', () => {
  const arrayMock = [
    path.join(__dirname, '/src/css/styles.css'),
    path.join(__dirname, '/src/js/gordito.js'),
    path.join(__dirname, '/src/js/hasper.js'),
    path.join(__dirname, '/src/js/trufo.js'),
    path.join(__dirname, '/src/js/components/index.js')
  ]

  return expect(
    swalker.walk(path.resolve(__dirname, 'src'), {only: ['.js', '.css']})
  ).resolves.toEqual(arrayMock)
})

test('Should return all files except .js', () => {
  const swalker = require('../index.js')
  const arrayMock = [
    path.join(__dirname, '/src/tifis.md'),
    path.join(__dirname, '/src/css/styles.css'),
    path.join(__dirname, '/src/css/sass/styles.scss'),
    path.join(__dirname, '/src/css/stylus/styles.styl'),
    path.join(__dirname, '/src/css/sass/component/file.less')
  ]

  return expect(
    swalker.walk(path.resolve(__dirname, 'src'), {except: ['.js', '.java']})
  ).resolves.toEqual(arrayMock)
})
