/**
 * @fileoverview Class module of s-walker.
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
        if (this._filterOpts) {
          this._applyFilter(dir, stat)
        } else {
          // pushing the files we already found.
          this._fileList.push(path.join(dir, stat.file))
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
        this._fileList.push(path.join(dir, stat.file))
      }
    }
  } else if (this._filterOpts.hasOwnProperty('except')) {
    var extensionMatch = false
    for (i = 0; i < this._filterOpts['except'].length; i++) {
      if (stat.file.endsWith(this._filterOpts['except'][i])) {
        extensionMatch = true
      }
    }
    if (!extensionMatch) this._fileList.push(path.join(dir, stat.file))
  }
}

/**
 * This method makes the list of files and then returns it as a Promise.
 * @param {path} string The absolute path of the directory yo want to get the
 *    files.
 * @returns {result} Promise The list of files.
 */
Swalker.prototype.walk = function (path, filterOpts) {
  this._filterOpts = filterOpts
  return this._walkDirs(path).then(() => {
    this.result = this._fileList
    this._fileList = []
    this._filterOpts = undefined
    return Promise.resolve(this.result)
  })
}

// creating the instance to export through modules.
const swalker = new Swalker()

module.exports = swalker
