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
 * @param {dir} string The path which will be walk to get the files.
 */
Swalker.prototype.walk = function (dir) {
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
          Promise.resolve(this.walk(path.join(dir, stat.file)))
        )
      } else {
        this.fileList.push(path.join(dir, stat.file))
        console.log('actual: file list')
        console.log(this.fileList)
      }
    })
    return Promise.all(walkpromises)
  }).then(() => {
    return Promise.resolve(this.fileList)
  }).catch((err) => {
    return Promise.reject('error')
  })
}

const swalker = new Swalker()

module.exports = swalker
