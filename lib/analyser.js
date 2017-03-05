const moment = require('moment');
const chalk = require('chalk');
exports.analyse = function(o) {
  return o.content.reduce((acc, d) => {
    if (o.filter && !new RegExp(o.filter).test(d[o.property])) {
      return acc;
    }
    if (o.start && moment(o.start,"DD/MM/YYYY").isAfter(d.time)) {
      return acc;
    }
    if (o.end && moment(o.end,"DD/MM/YYYY").add(1,'day').isBefore(d.time)) {
      return acc;
    }
    if (!acc[d[o.property]]) {
      acc[d[o.property]] = 0
    }
    acc[d[o.property]] ++
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
