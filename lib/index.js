const path =  require('path')
const fs = require('fs')


function Swalker () {
  this.fileList = []
}

Swalker.prototype.walk = function (dir, fileList) {
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
          Promise.resolve(this.walk(path.join(dir, stat.file), this.fileList))
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
    console.log(err)
  })
}

const swalker = new Swalker()

module.exports = swalker
