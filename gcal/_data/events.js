const {google} = require('googleapis');
let creds = require('./credentials.json');

module.exports = async function() {

	const auth = new google.auth.GoogleAuth({
		credentials:creds,
		scopes: ['https://www.googleapis.com/auth/calendar']
	});

	const calendar = google.calendar({
		version:'v3',
		auth:auth
	});

	return new Promise((resolve, reject) => {

		calendar.events.list({
			calendarId: '4p6qtp2jeu40piuul6bklfra94@group.calendar.google.com',
			timeMin: (new Date()).toISOString(),
			maxResults: 10,
			singleEvents: true,
			orderBy: 'startTime',
		}, (err, res) => {
			if (err) return console.log('The API returned an error: ' + err);
			let events = res.data.items;
			events = events.map(event => {
				const start = event.start.dateTime || event.start.date;
				event.startValue = start;
				return event;
			});

			resolve(events);
		});

	});

}