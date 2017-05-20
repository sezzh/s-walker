/**
 * @fileoverview Class module of s-walker.
 */
const path =  require('path')
const fs = require('fs')


/**
 * @constructor
 */
function Swalker () {
  this.fileList = []
}


/**
 * Method which performs the mapping of the files given a path.
 * @param {dir} string The path which will be walk to get the files
 *    must be an absolute path.
 */
Swalker.prototype.walk = function (dir) {
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
          Promise.resolve(this.walk(path.join(dir, stat.file)))
        )
      } else {
        // pushing the files we already found.
        this.fileList.push(path.join(dir, stat.file))
      }
    })
    // this return resolves the recursion.
    return Promise.all(walkpromises)
  }).then(() => {
    // Returning the final list of founded files.
    return Promise.resolve(this.fileList)
  }).catch((err) => {
    // This returns any error which could be found.
    return Promise.reject('error')
  })
}

// creating the instance to export through modules.
const swalker = new Swalker()

module.exports = swalker
