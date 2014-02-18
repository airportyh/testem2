var child_process = require('child_process')

function ShellLauncher(name, command){
  this.name = name
  this.command = command
  this.process = null
}

ShellLauncher.prototype = {
  isBrowser: false,
  start: function(){
    this.process = child_process.exec(this.command)
    this.process.stdout.pipe(process.stdout)
    this.process.stderr.pipe(process.stderr)
  },
  stop: function(){
    this.process.kill()
  }
}

module.exports = ShellLauncher

