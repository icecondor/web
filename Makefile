.PHONY: all pug sass js assets

all: build pug sass js assets

build:
	mkdir build

node_modules:
	npm install

gems:
	bundle install --path gems

server:
	ruby -run -e httpd build -p 8000

pug:
	./node_modules/.bin/pug --pretty --out build --basedir pug pug

sass:
	./node_modules/.bin/sass sass:build/css

js:
	cp -r js build/

assets:
	cp -r assets build/assets
