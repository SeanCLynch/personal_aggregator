## Sean's Pub Aggregator

Aggregator I made to collect lots of different aspects of my digital persona in one space.

```
node index.js
cp -a ./dest/. /var/www/aggregator/public_html/
```

# Getting Started

Add sources with `.fetch()` methods and `.env` api keys.
Collect all items in `{ title, url, comment, tags, datetime, source }` format. 
Run `node index.js` to fetch and build site using handlebars template.
Use copy command to deploy files to the correct location for apache.
Tada! Site deployed.

# TODOs
* 
