const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {

	eleventyConfig.addWatchTarget('./quizzes');

	eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
		name: "serverless", 
		functionsDir: "./netlify/functions/",
		copy:['./quizzes']
	});

	eleventyConfig.addFilter('checkQuiz', (submission, quizzes) => {
		/*
		submission is the query string from the submitted quiz, it needs to have name at minimum
		*/
		// first, match up the slugged name to our quizes
		let quiz = quizzes.find(q => {
			if(eleventyConfig.getFilter('slugify')(q.name) === submission.quiz) return true;
			return false;
		});
		let correct = 0;
		quiz.questions.forEach((question,idx) => {
			/*
			validate based on type

			note that the html uses a 1 based index, json data for quiz is 0 based
			1 based index is used for answers, so q1 is for question 0
			*/
			let myanswer = '';
			if(submission['q' + (idx + 1)]) {
				myanswer = submission['q' + (idx + 1)];
			}

			if(question.type === "single") {
				if(question.correctAnswer === myanswer-1) correct++;
			} else if(question.type === "multiple") {
				/*
				myanswer will either be an empty string or a list: X,Y. can't assume order
				will be right, so basically: length of items of MY answer must match length of correct, 
				and every item in the correct list must exist in my list

				correction: when Eleventy parses the query string, q2=X&q2=Y, we get: X, Y (see the space)?
				*/
				if(myanswer !== '') {
					let myanswers = myanswer.split(',').map(a => parseInt(a.trim(),10)-1);

					if(myanswers.length === question.correctAnswer.length) {
						let good = true;
						question.correctAnswer.forEach(ca => {
							if(myanswers.indexOf(ca) === -1) good = false;
						});

						if(good) correct++;
					}
				} 
			} else if(question.type === "truefalse") {
				// change my string bool to a real one
				myanswer = (myanswer === 'true');
				if(question.correctAnswer == myanswer) correct++;
			}
		});

		/*
		So for now, we just return an object of total questions and your result. I will also do the percentage
		for you.
		*/
		let result = {
			quizName: quiz.name,
			correct, 
			totalQuestions: quiz.questions.length,
			percentage: parseInt(correct/quiz.questions.length * 100,10)
		};

		return result;
	});

	return {
		dir: {
			input: "src"
		}
	}

};