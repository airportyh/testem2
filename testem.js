var yaml = require('js-yaml')
var fs = require('fs')
var server = require('./server')
var framework = require('./test_frameworks')
var config = yaml.load(fs.readFileSync('testem.yml') + '')

server(config)


