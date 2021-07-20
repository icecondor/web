.PHONY: all watch

css: node_modules 
	./node_modules/.bin/grunt

watch:
	./node_modules/.bin/grunt watch

node_modules:
	npm install

gems:
	bundle install --path gems

server:
	ruby -run -e httpd build -p 8000

format:
	find js -type f -name \*js -exec ./node_modules/.bin/tsfmt -r {} \;
