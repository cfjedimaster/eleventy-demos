const fs = require('fs');

module.exports = () => {

	let reviewData = JSON.parse(fs.readFileSync('./review.json', 'utf8'));

	let books = reviewData.filter(b => (b.read_status === 'read' || b.read_status === 'currently-reading')).map(r => {
		return {
			rating: r.rating, 
			review: r.review !== '(not provided)'?r.review:'',
			started_at: r.started_at !== '(not provided)'?new Date(r.started_at):'',
			read_at: r.read_at !== '(not provided)'?new Date(r.read_at):'',
			title: r.book
		}

	});
	console.log('books length', books.length);
	return books;
}