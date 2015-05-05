function setup(app, handlers) {
  // Create new Integration
  app.post('/settings/', handlers.integration.create)

  // Get Integration settings
  app.get('/settings/:integration', handlers.integration.get)
  app.put('/settings/:integration', handlers.integration.set)

  // schema.json and form.json are static files.
}

exports.setup = setup
