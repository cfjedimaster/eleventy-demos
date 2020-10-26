module.exports = function(eleventyConfig) {

	const english = new Intl.DateTimeFormat('en');

	eleventyConfig.addFilter("dtFormat", function(date) {
		return english.format(date);
	});

	eleventyConfig.addFilter("getRandom", function(items) {
		let selected = items[Math.floor(Math.random() * items.length)];
		return selected;
	});

	eleventyConfig.addFilter("getRandom2", function(items,avoid) {
		/*
		this filter assumes items are pages
		we need to loop until we don't pick avoid, 
		*/
		if(!items.length || items.length < 2) return;
		
		let selected = items[Math.floor(Math.random() * items.length)];
		while(selected.url === avoid.url) {
			selected = items[Math.floor(Math.random() * items.length)];
		}
		return selected;
	});

	eleventyConfig.addFilter("getRandom3", function(items,avoid,category) {
		/*
		this filter tries to match to categories
		*/
		console.log('Processing '+avoid.url);
		if(!items.length || items.length < 2) return;

		let myItems = items.filter(i => {
			return (i.data.categories.indexOf(category) >= 0) && i.url !== avoid.url;
		});
console.log('after cat filter, i have '+myItems.length);
		if(myItems.length === 0) {
			myItems = items.filter(i => {
				return i.url !== avoid.url;
			});
			console.log('i filtered to not my url and now have '+myItems.length);
		}

		if(myItems.length === 0) return;
		return myItems[Math.floor(Math.random() * myItems.length)];
	});

};