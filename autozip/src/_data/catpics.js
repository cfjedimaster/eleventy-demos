const glob = require('glob-promise');

module.exports = async () => {

	return (await glob('./src/images/cats/*.jpg')).map(p => p.replace('./src',''));

};