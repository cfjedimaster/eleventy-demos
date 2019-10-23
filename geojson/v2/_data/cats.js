//let catData = require('./cats.geojson'); <- Pro Tip - you can't do this. So don't. 
const fs = require('fs');

module.exports = function() {
	let catData = JSON.parse(fs.readFileSync('./_data/cats.geojson', 'utf8'));
	let cats = catData.features.map(c => {
		return {
			name: c.properties.name,
			gender: c.properties.gender,
			location: {lng: c.geometry.coordinates[0], lat: c.geometry.coordinates[1] }
		}
	});

	return cats;
}