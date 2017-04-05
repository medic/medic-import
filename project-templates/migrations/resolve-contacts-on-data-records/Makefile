
all: node_modules design-doc.json

node_modules: package.json
	npm install

design-doc.json: design-doc.js
	node design-doc.js > design-doc.json

clean: 
	rm design-doc.json
