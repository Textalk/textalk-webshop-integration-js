test:
	@./node_modules/.bin/mocha
	unzip -p build/coverage.zip lcov.info | ./node_modules/coveralls/bin/coveralls.js

.PHONY: test
