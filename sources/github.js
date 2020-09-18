let axios = require('axios');
let assert = require('assert');

module.exports.fetch = async () => {	
	try {
		// Fetch data.
		let url = "https://api.github.com/users/seanclynch/events/public";
		let headers = { 'Authorization': 'token ' + process.env.GITHUB };
    let resp = await axios.request({
      'url': url,
      'method': 'get',
      'headers': headers
    });
		assert.equal(resp.status, 200, "Github request failed");

		// Format data.
		let formatted_items = [];
    let seen_repos = [];
		resp.data.forEach((event) => {

      if (event.type === "StarEvent") {
        formatted_items.push({
          url: "https://github.com/" + event.repo.name,
          title: "Starred: " + event.repo.name,
          comment: '',
          tags: [],
          datetime: event.created_at,
          source: 'github'
        });

      } else if (event.type === "WatchEvent") {
				formatted_items.push({
          url: "https://github.com/" + event.repo.name,
					title: "Now watching: " + event.repo.name,
					comment: '',
					tags: [],
					datetime: event.created_at,
					source: 'github'
				});

			} else if (event.type === "PushEvent") {
				// check that this repo hasn't been added already.
        let repo_name = event.repo.name;
        if (seen_repos.includes(repo_name)) return;
        seen_repos.push(repo_name);

        // check for commit comment.
        let has_commit = typeof event.commits != 'undefined';
				let comment = (has_commit) ? event.commits[0].message : "";

				formatted_items.push({
          url: "https://github.com/" + event.repo.name,
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
