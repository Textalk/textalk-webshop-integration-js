/**
 * Textalk Webshop Integration Example
 * Copyright (C) 2015 Textalk
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without
 * fee is hereby granted, provided that the above copyright notice and this permission notice
 * appear in all copies.
 *
 * @license magnet:?xt=urn:btih:b8999bbaf509c08d127678643c515b9ab0836bae&dn=ISC.txt ISC
 */

var istanbulMiddleware = require('istanbul-middleware')
var coverage = (process.env.COVERAGE == 'true')

if (coverage) {
  console.log('Hook loader for coverage - ensure this is not production!');
  istanbulMiddleware.hookLoader(__dirname);
}

var express     = require('express')
var morgan      = require('morgan')
var routes      = require('./routes.js')
var fs          = require('fs')
var bodyParser  = require('body-parser')
var Integration = require('./models/integration.js')

var app = express()

// Configuration
if (coverage) {app.use('/coverage', istanbulMiddleware.createHandler())}

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

function start(db, config) {
  var handlers = {
    integration: Integration(db, config)
  }

  routes.setup(app, handlers)
  var port = process.env.PORT || config.port || null
  server = app.listen(port)

  console.log('Express server listening on port %d in %s mode', server.address().port,
              app.settings.env)
}

exports.start = start
