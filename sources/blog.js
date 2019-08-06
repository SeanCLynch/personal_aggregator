let axios = require('axios');
let assert = require('assert');

let ghost = require('./ghost_api.js');

module.exports.fetch = async () => {
	try {
		// Initialize the Ghost SDK
		ghost.init({
			clientId: 'ghost-frontend',
			clientSecret: process.env.GHOST
		});

		// Fetch data.
		let url = 'http://blog.seans.pub/ghost/api/v0.1/' + ghost.url.api('posts', {
      limit: 5, 
      include: 'tags'});
		let resp = await axios.get(url);
		assert.equal(resp.status, 200, "Error fetching blog data.");	

		// Format data.
		let formatted_items = [];
		resp.data.posts.forEach((post) => {
				
			// Format tags.
			if (post.status != "published") return;
			let tag_list = post.tags.map((tag) => {
				return tag.name;
			});

			formatted_items.push({
				url: 'http://blog.seans.pub' + post.url,
				title: post.title,
				comment: post.custom_excerpt,
				tags: tag_list,
				datetime: post.published_at,
				source: 'blog'
			});
		});

		assert.ok(formatted_items instanceof Array, "Error formatting blog items");
		return formatted_items;

	} catch (err) {

		console.error(err);
		return [];

	}
}
