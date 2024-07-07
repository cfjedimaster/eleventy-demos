let basic = require('./applesoftbasic.js').basic;

module.exports = function(eleventyConfig) {

	eleventyConfig.addGlobalData('site', { name:'test site', foo:'goo'});

	eleventyConfig.addTemplateFormats('bas');

	eleventyConfig.addExtension('bas', {

		compile: async (inputContent) => {

			return async (data) => {

				let result = '';
				let program = basic.compile(inputContent);
		
				program.init({
					tty: {
						getCursorPosition: function() { return { x: 0, y: 0 }; },
						setCursorPosition: function() { },
						getScreenSize: function() { return { width: 80, height: 24 }; },
						writeChar: function(ch) { 
							result += ch;
						},
						writeString: function(string) { 
							result += string+'\n';
						},
						readChar: function(callback) {
							callback('');
						},
						readLine: function(callback, prompt) {
							callback('');
						}
					}
				});
		
				let driver = function() {
					var state;
					do {
						try {
							state = program.step(driver);
						} catch(e) {
							console.log('ERROR!',e);
							return {
								error:e
							}
						}
						// may throw basic.RuntimeError
					} while (state === basic.STATE_RUNNING);
				}
				driver(); // step until done or blocked
		
				return result;

			};
		},
	});

};

