const GOOGLE_KEY = process.env.GOOGLE_KEY;

module.exports = function(eleventyConfig) {

	eleventyConfig.addAsyncShortcode('bookcover', async function(book) {
		/*
		Hack test for removing series info.
		*/
		book.title = book.title.replace(/ \(.*, #[0-9]+\)/, ''); 
		let search = `intitle:"${book.title}"`;
		let resp = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(search)}&maxResults=1&printType=books&key=${GOOGLE_KEY}`);
		let data = await resp.json();
		if(data.error) {
			console.log(data);
			return '';
		}
		if(data.items && data.items.length >= 1) {
			let foundBook = data.items[0];
			return `<img src="${foundBook.volumeInfo.imageLinks.thumbnail}">`;
		} else return '';

	});

	return {
		dir: {
			input: "src",
			data: "_data"
		}
	}

};