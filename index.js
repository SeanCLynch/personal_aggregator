require('dotenv').config()
let axios = require('axios');
let moment = require('moment');
let fs = require('fs');
let handlebars = require('handlebars');

// Aggregator Sources
let github = require('./sources/github');
let pinboard = require('./sources/pinboard');
let blog = require('./sources/blog');

// Save the most recent data.
function saveData (data) {
	let json = JSON.stringify(data);
	fs.writeFile('./src/data.json', json, 'utf8', (err) => {
		if (err) console.log("saveData", err);
	});
}

// Name and archive current data file. 
function archiveData() {
	let date = moment().format("M-D-YYYY");
	let new_filename = "./archives/" + date + "-data.json";
	fs.rename('./src/data.json', new_filename, (err) => {
		if (err) console.err("archiveData", err);
	});
}


(async () => {
	let arr = [];

  /*
	let a = await github.fetch();
	let b = await pinboard.fetch();
	let c = await blog.fetch();

	arr = arr.concat(a, b, c);
	
	arr.sort((a, b) => {
		return moment.utc(b.datetime).diff(moment.utc(a.datetime));
	});

	archiveData();

	let data = { 'items': arr };
	saveData(data);
  */

  let data = JSON.parse(fs.readFileSync('./src/data.json', 'utf-8'));
  let template = fs.readFileSync('./src/index.hbs', 'utf-8');
  let compiled = handlebars.compile(template);
  let html = compiled(data);
  fs.writeFileSync('./dest/index.html', html);
})();
