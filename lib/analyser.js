const moment = require('moment');
const chalk = require('chalk');
const geoip = require('geoip-lite');

exports.analyse = function(o) {
  var counted = new Set();
  return o.content.reduce((acc, d) => {
    var identifier = d.remoteIP + d[o.property]
    if (o.keyFilter && !new RegExp(o.keyFilter).test(d.key)) {
      return acc;
    }
    if (o.operationFilter && !new RegExp(o.operationFilter).test(d.operation)) {
      return acc;
    }
    if (o.start && moment(o.start,"DD/MM/YYYY").isAfter(d.time)) {
      return acc;
    }
    if (o.end && moment(o.end,"DD/MM/YYYY").add(1,'day').isBefore(d.time)) {
      return acc;
    }
    if (o.unique && counted.has(identifier)) {
      return acc;
    }
    let value;
    if (['country', 'region', 'city'].indexOf(o.property) !== -1) {
      let geo = geoip.lookup(d.remoteIP)
      value = geo ? geo[o.property] : 'Unknown'
    } else {
      value = d[o.property];
    }
    if (!acc[value]) {
      acc[value] = 0
    }
    acc[value] ++
    if (o.unique) {
      counted.add(identifier);
    }
    return acc;
  },{});
}


function pad(n, width) {
  n = '' + n
  return n.length >= width ? n : new Array(width - n.length + 1).join(' ') + n;
}
exports.format = function(o) {
  let max = Object.keys(o.data).reduce((acc, d) => {
    let curr = o.data[d];
    if (curr > acc) { return curr}
    return acc
  }, 0)
  length = (""+max).length;
  let results = Object.keys(o.data).map( d => {
    return ` ${pad(o.data[d], length)}  ${d}`
  }).sort().reverse().slice(0, o.top)
  if (o.colors) {
    results = results.map( (r, i) => {
      let rank = i / results.length;
      let color = 'green'
      if (rank < 0.33) {
        color = 'red';
      } else if (rank < 0.66) {
        color = 'yellow'
      }
      return chalk[color](r.substring(0, length +2)) + r.substring(length+2)
    });
  }
  return results.join("\n")

}
