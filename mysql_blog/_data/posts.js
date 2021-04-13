require('dotenv').config();
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const mysql = require('mysql2/promise');

module.exports = async function() {

	console.log('get posts');
	let posts = [];

	const connection = await mysql.createConnection({
		host     : DB_HOST,
		user     : DB_USER,
		password : DB_PASSWORD,
		database : DB_NAME
	});

	const [rows] = await connection.execute('select id, title, body, published from posts order by published desc');

	for(let i=0; i<rows.length; i++) {
		console.log(i, rows[i].title);
		// for each posts, get categories
		console.log('get cats for post '+rows[i].id);
		const [cats] = await connection.execute('select id, name from categories where id in (select categoryidfk from posts_categories where postidfk = ?)', [rows[i].id]);
		let categories = [];
		for(let k=0; k<cats.length; k++) {
			categories.push({
				id:cats[k].id,
				name:cats[k].name
			});
		}
		posts.push({
			id:rows[i].id,
			title:rows[i].title,
			body:rows[i].body,
			published:rows[i].published,
			categories
		});
	}


	connection.end();
	
	console.log(posts[0]);
	return posts;
}