const fs = require('fs');

module.exports = function(eleventyConfig) {

	eleventyConfig.addTemplateFormats('txt');

	eleventyConfig.addExtension('txt', {
		compile: async (input) => {
			return async (data) => {
				//console.log('data',data);
				return input;
			}
		}, 
		getData: async function(inputPath) {
			let recipe = parseRecipe(fs.readFileSync(inputPath, 'utf8'));
			// lowercase keys and remove spaces
			for(let key of Object.keys(recipe)) recipe[key.toLowerCase().replace(/ /g,'')] = recipe[key];
			return recipe;
		}

	});

	eleventyConfig.addFilter("recipeText", (content) => {
		return content.replace(/\n/g, '<p/>');
	});

};

function parseRecipe(txt) {
	let result = {};
	let lastKey = '';

	lines = txt.split('\n');

	for(let i=0;i<lines.length;i++) {
		//if the line starts with a tab, its a continutation
		if(lines[i].indexOf('\t') === 0) {		
			result[lastKey] += lines[i].replace('\t', '') + '\n';
		} else {
			let key = lines[i].split(':')[0];
			let rest = lines[i].replace(`${key}: `,'');
			result[key] = rest;
			lastKey = key;
		}
	}
	return result;
}