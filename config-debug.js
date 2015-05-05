var path = require('path')

module.exports = {
  db: {
    filename: path.join(__dirname, 'integrations-test.db'),
    debug: true
  },
  integrationKey: 'testkey'
}
