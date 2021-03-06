var yaml = require('js-yaml'),
  fs = require('fs'),
  path = require('path'),
  p = path.join(__dirname, '..', 'locale', 'en', 'get-involved', 'events.md'),
  buf = fs.readFileSync(p),
  lines = buf.toString().split('\n'),
  str = lines.slice(lines.indexOf('---') + 1, lines.indexOf('---', lines.indexOf('---') + 1)).join('\n'),
  store = yaml.safeLoad(str)

exports.getRegion = (region) => {
  let reg;
  for (reg in store.regions) {
    if (store.regions[reg].region === region) return store.regions[reg]
  }
  reg = { region: region }
  store.regions.push(reg)
  return reg
}

exports.removeEmpty = (dict) => {
  for (const i in dict) {
    if (!dict[i]) delete dict[i]
  }
}

exports.replace = (list, key, keyValue, value) => {
  exports.removeEmpty(value)
  for (let i = 0;i < list.length;i++) {
    if (list[i][key] === keyValue) {
      list[i] = value
      return
    }
  }
  list.push(value)
}

exports.save = () => {
  const str = ['---', yaml.dump(store), '---'].join('\n')
  fs.writeFileSync(p, str)
}

function rebalance () {
  store.regions = store.regions.slice(0, 6)
  exports.save()
}

function clearMeetups () {
  store.regions.forEach((reg) => {
    delete reg.meetups
  })
  exports.save()
}
// clearMeetups()
