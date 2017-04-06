
all: node_modules design-doc.json

node_modules: package.json
	npm install

design-doc.json: design-doc.js
	./node_modules/.bin/5984 compile design-doc.js > design-doc.json

clean: 
	rm design-doc.json
