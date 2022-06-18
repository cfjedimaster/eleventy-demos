const fs = require('fs');

let inputDir = './quizzes';

if(process.env.NETLIFY) {
	inputDir = process.cwd() + '/quizzes'; 
}

module.exports = function() {

	let quizzes = [];
	console.log('try to read ', inputDir, ' and process.cwd is ', process.cwd(), ' also net? ', process.env.NETLIFY);
	let files = fs.readdirSync(inputDir);

	files.forEach(f => {
		if(f.split('.').pop() === 'json') {

			let contents = JSON.parse(fs.readFileSync(inputDir + '/' + f, 'utf8'));
			// todo: Validate contents - perhaps via JSON schema?
			/*
			One thing we can do now, we let people leave off type for "single" questions as
			they will be the most common, but easier outside of here to specify. So let's fix it.
			*/
			contents.questions.forEach(q => {
				if(!q.type) q.type = "single";
			});
			quizzes.push(contents);
		}
	});

	return quizzes;
}