require('dotenv').config();
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const mysql = require('mysql2/promise');

module.exports = async function() {

	console.log('get cats');
	let cats = [];

	const connection = await mysql.createConnection({
		host     : DB_HOST,
		user     : DB_USER,
		password : DB_PASSWORD,
		database : DB_NAME
	});

	const [rows] = await connection.execute('select id, name from categories order by name');

	for(let i=0; i<rows.length; i++) {
		cats.push({
			id:rows[i].id,
			name:rows[i].name
		});
	}

	connection.end();
	
	return cats;
}