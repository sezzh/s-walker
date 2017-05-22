# s-walker
A small support library for Node.js file system which returns the path of each file recursively and asynchronous.

## Installation

You can install it through npm:

```bash
$ npm install s-walker
```
Or via a clone as well :)

```bash
$ git clone https://github.com/sezzh/s-walker.git
```

## Use

retrieve files' paths:
```javascript
const swalker = require('s-walker')

const filesPath = path.resolve(__dirname, 'src')

swalker.walk(filesPath).then((files) => {
  // you'll get the files inside an array.
})

```
### Filter only
You can also use a filter to add only a few type of files within "only" option:

```javascript
const swalker = require('s-walker')

const filesPath = path.resolve(__dirname, 'src')

swalker.walk(filesPath, {only: ['.js', '.md']}).then((files) => {
  // only the file paths which end .js or .md will be in the files array.
})

```

### Filter except
You can also use except filter to get only the paths which ends with the array you pass as argument:

```javascript
const swalker = require('s-walker')

const filesPath = path.resolve(__dirname, 'src')

swalker.walk(filesPath, {except: ['.js', '.md']}).then((files) => {
  // files array will contain all kind of file paths except .js or .md.
})

```

### Getting relative paths
If you want instead of absolute paths a relative ones you can use the option
`pathType: 'relative'` inside the object opts:

```javascript
const swalker = require('s-walker')

const filesPath = path.resolve(__dirname, 'src')

swalker.walk(filesPath, {except: ['.js', '.md'], pathType: 'relative'}).then((files) => {
  // files array will contain all kind of file paths except .js or .md and relative paths to the src folder.
})

```
