const fetch = require('node-fetch');

module.exports = async function() {
	let url = `https://swapi.dev/api/films`;
	
	let resp = await fetch(url);
	let data = await resp.json();

	return data.results;

}
