const Parser = require('rss-parser');
let parser = new Parser({
	customFields: {
		item: ['book_image_url','book_small_image_url','book_medium_image_url','book_large_image_url',
		'book_description','book','author_name','isbn','book_published','user_read_at','user_review','user_rating','user_shelves']
	}
});

module.exports = async function() {

	let feed = await parser.parseURL('https://www.goodreads.com/review/list_rss/7962326?key=Ec1w1KAYYmxfKil4LNjNHm0vEWA2ksM3KjJI2Q5KdXT-MRBJ&shelf=%23ALL%23');

	return feed.items.filter(f => f.user_shelves !== 'to-read').map(i => {
		return {
			title: i.title,
			images: {
				url:i.book_image_url,
				small:i.book_small_image_url,
				medium:i.book_medium_image_url,
				large:i.book_large_image_url
			},
			description:i.description, 
			numPages: i.book.num_pages[0],
			author:i.author_name,
			link:i.guid,
			review:i.user_review,
			rating:i.user_rating,
			read_at:i.user_read_at!==''?new Date(i.user_read_at):''
		}
	}).sort((a,b) => {
		return a.read_at - b.read_at;
	});

};





