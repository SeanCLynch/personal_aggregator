let axios = require('axios');
let assert = require('assert');

module.exports.fetch = async () => {
	try {
		// Fetch data.
		let url = "https://api.pinboard.in/v1/posts/recent?auth_token=" + process.env.PINBOARD + "&format=json&count=20";
		let resp = await axios.get(url);
		assert.equal(resp.status, 200, "Pinboard request failed.");
		
		// Format data. 
		let formatted_items = [];
		resp.data.posts.forEach((post) => {

			// Format tags
			let tags = post.tags.split(' ');
			if (post.shared === 'no') return;
			if (!tags.includes('linklist')) return;
			tags = tags.filter((tag) => tag !== 'linklist');
			
			formatted_items.push({
				url: post.href,
				title: "Bookmarked: " + post.description,
				comment: post.extended,
				tags: tags,
				datetime: post.time,
				source: 'pinboard'
			});
		});

		assert.ok(formatted_items instanceof Array, "Error formatting Pinboard items");
		return formatted_items;

	} catch (err) {

		console.error(err);
		return [];

	}
}
