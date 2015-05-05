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

var crypto = require('crypto')

function Integration(db, config) {
  return {
    create: function(req, res) {
      // Check authorization
      if (req.header('Authorization') !== 'IntegrationKey key="' + config.integrationKey + '"') {
        return res.sendStatus(403)
      }

      var baseUrl = req.header('host') // Use requests host - if it got here, it works.
      var email   = req.body.email
      var auth    = req.header('X-Webshop-Auth')
      var key     = crypto.randomBytes(16).toString('hex')

      db.run('INSERT INTO integrations (email, auth, key) VALUES(?,?,?)', email, auth, key)
        .then(function(sqlResult) {
          res.status(201).header('location', 'http://' + baseUrl + '/settings/' + sqlResult.lastID)
            .header('X-Integration-Auth', key)
            .send()
        })
    },

    get: function(req, res) {
      var id = req.params.integration

      // Lookup id in db.
      db.get('SELECT * FROM integrations WHERE id = ?', id)
        .then(function(integrationData) {
          // Check authorization
          if (req.header('Authorization') !== 'IntegrationKey key="' + integrationData.key + '"') {
            return res.sendStatus(403)
          }

          res.json(integrationData)
        })
    },

    set: function(req, res) {
      var id = req.params.integration

      // Lookup id in db.
      db.get('SELECT * FROM integrations WHERE id = ?', id)
        .then(function(integrationData) {
          // Check authorization
          if (req.header('Authorization') !== 'IntegrationKey key="' + integrationData.key + '"') {
            return res.sendStatus(403)
          }

          db.run('UPDATE integrations SET email = ? WHERE id = ?', req.body.email, id)
            .then(function() {
              res.sendStatus(204)
            })
        })
    }
  }
}

module.exports = Integration
