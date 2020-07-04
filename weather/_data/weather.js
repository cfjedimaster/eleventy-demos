const fetch = require('node-fetch');

// used to auth with HERE API
const HERE_KEY = 'c1LJuR0Bl2y02PefaQ2d8PvPnBKEN8KdhAOFYR_Bgmw';
// used for location of the market
const LOC = 'Lafayette, LA';

module.exports = async function() {
	let url = `https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey=${HERE_KEY}&product=observation&name=${encodeURIComponent(LOC)}&metric=false`;
	
	let resp = await fetch(url);
	let data = await resp.json();
	let report = data.observations.location[0].observation[0];
	console.log(report);

	// Add a simplification
	report.rainWarning = (report.precipitation12H !== '*' && report.precipitation12H > 0.02);
report.rainWarning = true;
	return report;

}

// https://developer.here.com/documentation/destination-weather/dev_guide/topics/resource-type-weather-items.html