//let catData = require('./cats.geojson'); <- Pro Tip - you can't do this. So don't. 
const fs = require('fs');
const fetch = require('node-fetch');
const global = require('./global');

module.exports = async function() {
	let catData = JSON.parse(fs.readFileSync('./_data/cats.geojson', 'utf8'));

	let cats = catData.features.map(c => {
		return {
			name: c.properties.name,
			gender: c.properties.gender,
			location: { lng: c.geometry.coordinates[0], lat: c.geometry.coordinates[1] }
		}
	});

	//https://stackoverflow.com/a/37576787/52160
	for(const cat of cats) {
		console.log('do address for ' + cat.name);
		let url = `https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?app_id=${global.here_app_id}&app_code=${global.here_app_code}&prox=${cat.location.lat}%2C${cat.location.lng}%2C250&mode=retrieveAddresses&maxresults=1`;

		let locationRequest = await fetch(url);
		let location = await locationRequest.json();
		cat.address = location.Response.View[0].Result[0].Location.Address.Label;

	}
	
	return cats;
}