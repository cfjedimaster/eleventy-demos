let data = require('./archive/outbox.json');

module.exports = () => {
	return data.orderedItems.filter(m => m.type === 'Create').reverse();
}