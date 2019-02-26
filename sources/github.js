let axios = require('axios');
let assert = require('assert');

module.exports.fetch = async () => {	
	try {
		// Fetch data.
		let url = "https://api.github.com/users/seanclynch/events/public?access_token=" + process.env.GITHUB;
		let resp = await axios.get(url);
		assert.equal(resp.status, 200, "Github request failed");

		// Format data.
		let formatted_items = [];
		resp.data.forEach((event) => {

			if (event.type === "WatchEvent") {
				formatted_items.push({
					url: event.repo.url,
					title: "Now watching: " + event.repo.name,
					comment: '',
					tags: [],
					datetime: event.created_at,
					source: 'github'
				});

			} else if (event.type === "PushEvent") {
				let has_commit = typeof event.commits != 'undefined';
				let comment = (has_commit) ? event.commits[0].message : "";
				formatted_items.push({
					url: event.repo.url,
					title: "Pushed to: " + event.repo.name,
					comment: comment,
					datetime: event.created_at,
					source: 'github'
				});

			} else {
				// Event type not supported.
				return;
			}
		});

		assert.ok(formatted_items instanceof Array, "Error formatting data.");
		return formatted_items;

	} catch (err) {
		
		console.error(err);
		return [];
	
	}
}
