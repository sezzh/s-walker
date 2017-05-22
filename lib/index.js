/**
 * @fileoverview Class module of s-walker.
 * @author sezzh sezzhltd@gmail.com
 */
const path = require('path')
const fs = require('fs')

/**
 * @constructor
 */
function Swalker () {
  this._fileList = []
  this.result = []
  this._filterOpts = undefined
  this._startPath = ''
}

/**
 * Method which performs the mapping of the files given a path and save the
 *    results inside Swalker.fileList property.
 * @param {dir} string The path which will be walk to get the files
 *    must be an absolute path.
 */
Swalker.prototype._walkDirs = function (dir) {
  // Here we're reading the files from the file system.
  // this is the return which chains the last theneable within the resulting
  // fileList.
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) reject(err)
      resolve(files)
    })
  }).then((files) => {
    var promises = []

    files.forEach((file) => {
      promises.push(new Promise((resolve, reject) => {
        fs.stat(path.join(dir, file), (err, stats) => {
          if (err) reject(err)
          resolve({file: file, stats: stats})
        })
      }))
    })

    return Promise.all(promises)
  }).then((stats) => {
    var walkpromises = []
    stats.forEach((stat) => {
      if (stat.stats.isDirectory()) {
        walkpromises.push(
          // beginning the recursion of walk method.
          Promise.resolve(this._walkDirs(path.join(dir, stat.file)))
        )
      } else {
        // if there is a filter opts we apply it.
        if (this._filterOpts.hasOwnProperty('only') ||
            this._filterOpts.hasOwnProperty('except')) {
          this._applyFilter(dir, stat)
        } else {
          // pushing the files we already found.
          this._pushItems(dir, stat)
        }
      }
    })
    // this return resolves the recursion.
    return Promise.all(walkpromises)
  }).catch((err) => {
    // This returns any error which could be found.
    return Promise.reject('error')
  })
}

/**
 * This method applies the filter inside this._filterOpts.
 * @param {dir} string The absolute path of the current dir.
 * @param {stat} obj The file's stat object.
 */
Swalker.prototype._applyFilter = function (dir, stat) {
  var i = 0
  if (this._filterOpts.hasOwnProperty('only')) {
    for (i = 0; i < this._filterOpts['only'].length; i++) {
      if (stat.file.endsWith(this._filterOpts['only'][i])) {
        this._pushItems(dir, stat)
      }
    }
  } else if (this._filterOpts.hasOwnProperty('except')) {
    var extensionMatch = false
    for (i = 0; i < this._filterOpts['except'].length; i++) {
      if (stat.file.endsWith(this._filterOpts['except'][i])) {
        extensionMatch = true
      }
    }
    if (!extensionMatch) this._pushItems(dir, stat)
  }
}

/**
 * This method push the file paths inside this._fileList it also creates the
 *    relative paths if the argument was found.
 * @param {dir} string The absolute path of the current directory.
 * @param {stat} obj The file stat with the file name.
 */
Swalker.prototype._pushItems = function (dir, stat) {
  if (this._filterOpts.hasOwnProperty('pathType') &&
      this._filterOpts['pathType'] === 'relative') {
    var dirPath = ''
    var mainPath = ''
    var relativePath = []
    var pushPath = ''
    mainPath = this._startPath.split(path.sep)
    dirPath = dir.split(path.sep)
    mainPath.forEach(position => {
      dirPath = this._cleanPath(position, dirPath)
    })
    dirPath.forEach(value => {
      if (value !== '') relativePath.push(value)
    })
    relativePath.forEach(value => {
      pushPath = this._joinRelativePath(pushPath, value)
    })
    this._fileList.push(path.join(pushPath, stat.file))
  } else {
    this._fileList.push(path.join(dir, stat.file))
  }
}

/**
 * This method clean an array of paths according to the position you send to
 *    it.
 * @param {position} string A string with a path which will be delete from the
 *    pathArray.
 * @param {pathArray} array The array which cotains all dirctories from an
 *    absolute path.
 * @returns {pathArray} array The resulting array from the map function.
 */
Swalker.prototype._cleanPath = function (position, pathArray) {
  return pathArray.map((value) => {
    if (position !== value) {
      return value
    } else {
      return ''
    }
  })
}

/**
 * This method joins the lastPosition with the nextPosition with path.join()
 *    method.
 * @param {lastPosition} string The current path.
 * @param {nextPosition} string the directory name which you need to join.
 * @returns {result} string The resulting string of joining the lastPosition
 *    and the nextPosition.
 */
Swalker.prototype._joinRelativePath = function (lastPosition, nextPosition) {
  return path.join(lastPosition, nextPosition)
}

/**
 * This method makes the list of files and then returns it as a Promise.
 * @param {path} string The absolute path of the directory yo want to get the
 *    files.
 * @returns {result} Promise The list of files.
 */
Swalker.prototype.walk = function (path, filterOpts) {
  this._startPath = path
  this._filterOpts = filterOpts || {}
  return this._walkDirs(path).then(() => {
    this.result = this._fileList
    this._fileList = []
    this._filterOpts = undefined
    return Promise.resolve(this.result)
  }).catch((err) => {
    return Promise.reject(err)
  })
}

// creating the instance to export through modules.
const swalker = new Swalker()

module.exports = swalker
