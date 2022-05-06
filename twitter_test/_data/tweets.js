const fs = require('fs');

module.exports = function() {

	/*
	remove window.YTD.tweet.part0 = 
	*/
	let raw = fs.readFileSync('twitter_data/tweet.js','utf8');
	raw = raw.replace(/.*?\[/,'[');
	let data = JSON.parse(raw);
	/*
	data is an array where every item has an object, tweet, we can simply to just that
	*/
	data = data.map(d => {
		d.tweet.created_at = new Date(d.tweet.created_at);
		return d.tweet;
	}).sort((a, b) => a.created_at - b.created_at);

	//temp
	data = data.slice(0,50000);

	console.log('size of tweets', data.length);

	return data;

}