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

var server     = require('./server.js')
var qsqlite3   = require('q-sqlite3')
var configFile = process.argv[2] || 'config.js'
var config     = require('./' + configFile)

qsqlite3.createDatabase(config.db.filename)
  .then(function(db) {
    console.log('Successfully started sqlite')

    // Running nested 'then' to keep db variable.
    db.run(
      'CREATE TABLE IF NOT EXISTS integrations (' +
        '  id INTEGER PRIMARY KEY,'               +
        '  email TEXT,'                           +
        '  auth TEXT,'                            +
        '  key TEXT'                              +
        ')'
    ).then(function(res) {
      server.start(db, config)
      console.log('Successfully started web server. Waiting for incoming connections...')
    })
  })
