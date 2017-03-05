const fs = require('fs')
const path = require('path')
const moment = require('moment')


function readdir(target) {
  return new Promise((resolve, reject) => {
    fs.readdir(target, function(err, files) {
      if (err) {
        return reject(err);
      }
      return resolve(files);
    })
  })
}
function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', function(err, content) {
      if (err) {
        return reject(err);
      }
      return resolve(content);
    })
  })
}
const LOG_REGEX = /^([0-9a-f]+) (\w+) \[(.*)\] (\d+\.\d+\.\d+\.\d+) ([^ ]+) ([A-Z0-9]+) ([A-Z\._]+) ([^ ]+) "([^"]+)" (\d+) ([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+) "([^"]+)" "([^"]+)" (.*)/
module.exports = function(target) {
  return readdir(target)
    .then(files=> Promise.all( files.map( file=> readFile( path.join(target, file) ) ) ) )
    .then(all_contents =>
      all_contents.join("")
      .split("\n")
      .reduce( (acc, line) => {
        var matches = line.match(LOG_REGEX);
        if (line) {
          if (matches) {
            acc.push({
              userId: matches[1],
              bucket: matches[2],
              time: moment(matches[3],'DD/MMM/YYYY:HH:mm:ss Z').toDate(),
              remoteIP: matches[4],
              requester: matches[5],
              requesterID: matches[6],
              operation: matches[7],
              key: matches[8],
              requestURI: matches[9],
              status: matches[10],
              errorCode: matches[11],
              bytesSent: matches[12],
              objectSize: matches[13],
              totalTime: matches[14],
              turnAroundTime: matches[15],
              referer: matches[16],
              userAgent: matches[17],
              versionID: matches[18]
            })
          } else {
            console.error("ERROR: ")
            console.error(line)
          }
        }
        return acc;
      }, [])
    )
}
