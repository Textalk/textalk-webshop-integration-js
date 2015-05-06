Textalk Webshop Integration Example
===================================

[![Build Status](https://travis-ci.org/Textalk/textalk-webshop-integration-js.png)](https://travis-ci.org/Textalk/textalk-webshop-integration-js)

This is an example of an external integration designed to be configurable from inside Textalk
Webshop admin.

This is a bare skeleton that handles settings for each integration instance.


Install
-------
This is a node.js application, expecting node and npm to be available on the system.

```bash
git clone https://github.com/Textalk/textalk-webshop-integration-js.git
cd textalk-webshop-integration-js
npm install
cp config.js.sample config.js
make test
node index.js
```

The integration server is now available on http://localhost:3000/ with the following settings:

* auth:           testkey
* settingsSchema: http://yourdomain:3000/schema.json
* settingsForm:   http://yourdomain:3000/form.json
* settingsUrl:    http://yourdomain:3000/settings/


Todo
----

* API client (jsonrpc client).
* API subscriptions (automatically managing subscriptions and listening to events).


Licence
-------

Permission to use, copy, modify, and/or distribute this software for any purpose with or without
fee is hereby granted, provided that the above copyright notice and this permission notice appear
in all copies.
