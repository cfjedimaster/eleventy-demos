const Parser = require('rss-parser');
let parser = new Parser();

const date_fns = require('date-fns');

//import { parseISO, formatISO } from 'date-fns';

const feeds = [
'https://scottstroz.com/feed.xml',
'https://www.raymondcamden.com/feed.xml',
'https://recursive.codes/blog/feed'
]

function normalizeItem(i, feed) {
		i.niceDate = date_fns.formatISO(date_fns.parseISO(i.isoDate), {representation: 'date'});
		if(!i.content && i['content:encoded']) i.content = i['content:encoded'];
		i.blog = { title:feed.title, desc: feed.description, link: feed.link };
		return i;
}

module.exports = async function() {

	let result = []
	for(let i=0; i<feeds.length; i++) {
		let feed = await parser.parseURL(feeds[i]);
		let items = feed.items.map(f => normalizeItem(f, feed));
		result.push(...items);
		console.log('Processed',feeds[i]);
	}

	// sort by date
	result.sort((a, b) => (new Date(b.isoDate)) - (new Date(a.isoDate)));

	return result;
	
};