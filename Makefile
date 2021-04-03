.PHONY: all watch

all: node_modules gems
	./node_modules/.bin/grunt
watch:
	./node_modules/.bin/grunt watch

node_modules:
	npm install

gems:
	bundle install --path gems

server:
	ruby -run -e httpd build -p 8000
