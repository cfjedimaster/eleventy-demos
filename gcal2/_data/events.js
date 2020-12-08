const PD_EVENTS = 'https://enbfnzb6d0dzhfd.m.pipedream.net';
const fetch = require('node-fetch');

module.exports = async function() {

	return new Promise((resolve, reject) => {

		fetch(PD_EVENTS)
		.then(res => res.json())
		.then(res => {
			//console.log(res[1]);
			let events = res.map(e => fixEvent(e));
			resolve(events);
		});

	});

}

function fixEvent(e) {
	let event = {};

	event.title = e.summary;
	if(e.start.date) event.start = e.start.date;
	if(e.start.dateTime) event.start = e.start.dateTime;
	if(e.end.date) event.end = e.end.date;
	if(e.end.dateTime) event.end = e.end.dateTime;
	if(e.description) event.description = e.description;
	if(e.location) event.location = e.location;

	if(event.start) event.start = new Date(event.start);
	if(event.end) event.end = new Date(event.end);
	return event;
}