const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {

	eleventyConfig.addWatchTarget('./quizzes');

	eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
		name: "serverlessnp", 
		functionsDir: "./netlify/functions/",
	});

	eleventyConfig.addFilter('checkQuiz', () => {
		console.log('running checkQuiz');
		return 1;
	});

	return {
		dir: {
			input: "src"
		}
	}

};