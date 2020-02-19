
const mjml = require('mjml');

module.exports = function(data) {
	let s= '';
	s = mjml(data.content);
	return s.html;
};