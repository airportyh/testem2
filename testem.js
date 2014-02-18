var yaml = require('js-yaml')
var fs = require('fs')
var server = require('./server')
var config = yaml.load(fs.readFileSync('testem.yml') + '')
var ShellLauncher = require('./launchers/shell_launcher')
//var launchers = loadLaunchers(config.launchers)

server(config)

function loadLaunchers(launcherConfigs){
  var launchers = []
  for (var name in launcherConfigs){
    var config = launcherConfigs[name]
    launchers.push(new ShellLauncher(name, config.command))
  }
  return launchers
}