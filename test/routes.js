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

var should   = require('should')
var assert   = require('assert')
var request  = require('supertest')
var config   = require('../config-debug')
var fs       = require('fs')
var url      = require('url')
var path     = require('path')
var spawn    = require('child_process').spawn

describe('Routing', function() {
  var serverProcess,
      baseUrl,
      integrationLocation,
      integrationKey,
      integrationUrl,
      integrationPath

  before(function(done) {
    // Start the server
    var subEnv = process.env
    subEnv.COVERAGE = true
    serverProcess = spawn('node', ['index.js', 'config-debug.js'], {env: subEnv})

    serverProcess.stdout.on('data', function (buffer) {
      //console.log('Server output: ' + buffer)

      var portRegex = /listening on port (\d+) in/g
      var portMatch = portRegex.exec(buffer.toString())
      if (portMatch) {
        baseUrl = 'http://localhost:' + portMatch[1]
        done()
      }
    })
    serverProcess.stderr.on('data', function (buffer) {console.log('Server error: "' + buffer)})
    serverProcess.stdout.on('end', function() {throw new Error('Server died.')})
  })
  after(function(done) {
    // Clean the test database
    fs.unlink(config.db.filename)

    // Download the coverage
    var curlProcess = spawn(
      'curl', ['-o', path.resolve('build', 'coverage.zip'), baseUrl + '/coverage/download'],
      {cwd: __dirname}
    )
    curlProcess.stdout.on('end', function() {
      console.log('Coverage report saved in build/coverage.zip.')

      // Kill the server
      serverProcess.kill('SIGKILL')
      done()
    })
  })

  describe('Accessories', function() {
    it('should have a json schema', function(done) {
      request(baseUrl)
        .get('/schema.json')
        .end(function(err, res) {
          if (err) {throw err}

          res.statusCode.should.equal(200)
          res.body.should.be.type('object')
          done()
        })
    })

    it('should have a json schema form', function(done) {
      request(baseUrl)
        .get('/form.json')
        .end(function(err, res) {
          if (err) {throw err}

          res.statusCode.should.equal(200)
          res.body.should.be.an.instanceOf(Array)
          done()
        })
    })

    // Should update data
    // Should fail on bad key
    // Should give validation error on invalid data
  })

  describe('Integration creation', function() {
    it('should register a new integration', function(done) {
      request(baseUrl)
        .post('/settings/')
        .set('Authorization',  'IntegrationKey key=' + config.integrationKey)
        .set('X-Webshop-Id',   '22222')
        .set('X-Webshop-Auth', 'testauth')
        .send({email: 'test@example.com'})
        .end(function(err, res) {
          if (err) {throw err}

          res.statusCode.should.equal(201)
          res.headers.should.have.property('location')
          res.headers.should.have.property('x-integration-auth')

          // Store this integration for instance tests.
          integrationLocation = res.headers.location
          integrationKey      = res.headers['x-integration-auth']
          integrationUrl      = url.parse(integrationLocation)
          integrationPath     = integrationUrl.path
          done()
        })
    })

    it('should fail on no integration key', function(done) {
      request(baseUrl)
        .post('/settings/')
        .set('X-Webshop-Id',   '22222')
        .set('X-Webshop-Auth', 'testauth')
        .send({
          email: 'test@example.com'
        })
        .end(function(err, res) {
          if (err) {throw err}

          res.statusCode.should.equal(403)
          done()
        })
    })

    // Should validate data against schema.
  })

  describe('Integration getting', function() {
    it('should get settings', function(done) {
      request(baseUrl)
        .get(integrationPath)
        .set('Authorization',  'IntegrationKey key=' + integrationKey)
        .end(function(err, res) {
          if (err) {throw err}

          res.body.should.have.property('email')
          res.body.email.should.equal('test@example.com')
          done()
        })
    })

    it('should fail on bad key', function(done) {
      request(baseUrl)
        .get(integrationPath)
        .end(function(err, res) {
          if (err) {throw err}

          res.statusCode.should.equal(403)
          done()
        })
    })
  })

  describe('Integration updating', function() {
    it('should update data', function(done) {
      request(baseUrl)
        .put(integrationPath)
        .set('Authorization',  'IntegrationKey key=' + integrationKey)
        .send({email: 'new@email.now'})
        .end(function(err, res) {
          if (err) {throw err}

          // No content.
          res.statusCode.should.equal(204)

          // Must GET to see if it actually changed.
          request(baseUrl)
            .get(integrationPath)
            .set('Authorization',  'IntegrationKey key=' + integrationKey)
            .end(function(err, res) {

              res.body.should.have.property('email')
              res.body.email.should.equal('new@email.now')
              done()
            })
        })
    })

    it('should fail on bad key', function(done) {
      request(baseUrl)
        .put(integrationPath)
        .end(function(err, res) {
          if (err) {throw err}

          res.statusCode.should.equal(403)
          done()
        })
    })

    // Should give validation error on invalid data
  })
})
