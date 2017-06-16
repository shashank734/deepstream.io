const child_process = require('child_process')
const fs = require('fs')

const systemdTemplate = require('./systemd')
const initdTemplate = require('./initd')

const ctlOptions = {
  mode: 493 // rwxr-xr-x
}

function hasSystemD () {
  return fs.existsSync('/usr/bin/systemctl') || fs.existsSync('/bin/systemctl')
}

function hasSystemV () {
  return fs.existsSync('/etc/init.d')
}

function setupSystemD (options, callback) {
  console.log(systemdTemplate(options))
  // fs.writeFileSync(
  //   `/usr/lib/systemd/system/${name}.service`, 
  //   systemdTemplate(options), 
  //   ctlOptions
  // )
  // child_process.execSync('systemctl', ['enable', name])
  callback(null, 'SystemD service registered succesfully')
}

function setupSystemV (options, callback) {
  console.log(initdTemplate(options))
  //fs.writeFileSync(
  //  `/etc/init.d/${name}`, 
  //  initdTemplate(options), 
  //  ctlOptions
  //)
  //child_process.execSync('chkconfig', ['--add', name])
  // child_process.execSync('update-rc.d', [name, 'defaults'])
  callback(null, 'init.d service registered succesfully')
}

module.exports.add = function (name, options, callback) {
  options.name = name
  options.pidFile = options.pidFile || `/var/run/${name}.pid`

  // if (options && options.programArgs) {
  // 	for (var i = 0; i < options.programArgs.length; i++) {
  //  	  options.programArgs[i] = `"${options.programArgs[i]}"`
  // 	}
  // }

  if (options && !options.runLevels) {
  	options.runLevels = [2, 3, 4, 5]
  }

  options.deepstreamExec = 'bob'
  options.deepstreamArgs = options.programArgs.join(' ')
  setupSystemD(options, callback)
  // if (hasSystemD()) {
  //   setupSystemD(options, callback)
  // } else if (hasSystemV()) {
  // 	setupSystemV(options, callback)
  // } else {
  //   callback(new Error('Only systemd and init.d services are currently supported.')
  // }
}
