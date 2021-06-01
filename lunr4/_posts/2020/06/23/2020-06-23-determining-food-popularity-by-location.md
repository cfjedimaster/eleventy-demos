---
layout: post
title: "Determining Food Popularity By Location"
date: "2020-06-23"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/asianfood.jpg
permalink: /2020/06/23/determining-food-popularity-by-location
description: Using HERE's APIs to report on food popularity by restaurant
---

This is typically the kind of post I've write up on [HERE's blog](https://developer.here.com/blog), but as I haven't blogged here in nearly two weeks, I figured I'm past due to share some content. As it stands, this is yet another one of my lame demos and nothing really serious, but I had fun building it and thought I'd share. 

One of the API's that HERE provides is involves [searching](https://developer.here.com/products/geocoding-and-search) for POIs (points of interest) at a location. We provide two basic APIs for that. The first, [Discover](https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics/endpoint-discover-brief.html) is useful for text queries, so for example, you remember dining at a place named "Bob's" something and you want to figure out exactly what it was. The other API, [Browse](https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics/endpoint-browse-brief.html), is better suited to category based searches, for example, finding all the banks near your current location.

One of the things I really like about our search APIs is the *incredibly deep* [categorization feature](https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics-places/introduction.html). It's split into two versions, one that's generic and one that's based on types of food. The "generic" category API system goes very deep. So you can ask for "nightlife-entertainment" POIs, or more specifically a "gambling, lottery, or betting" establishment, or very precisely a casino. 

That type of specificity also exists on the food types side. You can go from Asian, to Chinese, to over *ten* types of different Chinese cuisine. I thought I was pretty familiar with Chinese food, but I was blown away by the different types of Chinese food I had never known even existed.

### The First Demo

So given all of this, I thought it would be kind of food to examine the types of food options available to you. For my first demo, I used Geolocation to determine your position, and then I asked for 100 restaurants near you. From that, I aggregated the types of restaurants as well as the food types and built a report. Here's how I built it. First, the front end:

```html
{% raw %}<div id="app" v-cloak>
  <div v-if="message">
    {{message}}
  </div>
  <div v-if="types">
    <h2>Types of Restaurants</h2>
    <ul>
       <li v-for="type of types">
         {{ type.name }} - {{ type.value }}
      </li>
  </div>
  <div v-if="foodTypes">
    <h2>Types of Food</h2>
    <ul>
       <li v-for="type of foodTypes">
         {{ type.name }} - {{ type.value }}
      </li>
  </div>
</div>{% endraw %}
```

This is fairly simple as all it does is show a loading message and then displays the food reports when done. The real magic is in the JavaScript. I'm going to share the entire CodePen below, so let me focus in on the important bits. First, my `created` event hook:

```js
  async created() {
    this.message = 'Fetching location...';
    this.location = await this.getLocation();
    this.message = null;
    this.results = await this.getFoodOptions();
    this.types = this.sortToArray(this.generateRestaurantTypes(this.results));
    this.foodTypes = this.sortToArray(this.generateFoodTypes(this.results));
    console.log('got '+this.results.length+' items');

  },
```

I get the user's location (just using the browser's geolocation API) and then start working on my data. Next, I fetch all of my restaurant options:

```js
async getFoodOptions() {
	this.message = 'Getting food data for your location.';
	let url = `https://discover.search.hereapi.com/v1/browse?apikey=${apikey}&at=${this.location.latitude},${this.location.longitude}&categories=100-1000-0000&limit=100`;
	let resp = await fetch(url);
	let data = await resp.json();
	this.message = '';

	return data.items.map(m => {
	let open = '';
	let openHours = '';
	if(m.openingHours && m.openingHours.length >= 1) {
		open = m.openingHours[0].isOpen;
		openHours = m.openingHours[0].text;
	}
	return {
		title:m.title,
		address:m.address,
		position:m.position,
		contacts:m.contacts,
		open:open,
		openHours:openHours,
		categories:m.categories,
		foodTypes:m.foodTypes
	}
	});
},
```

For the most part, this is mainly just a call to the Browse API passing in the category ID we use for restaurants. Once I have my data I do a bit of manipulation and simplification. For example, setting up a top level `open` property. This comes from code I used in another demo and technically isn't even used in this demo. 

Once I have my data, I then build my two reports. First, on restaurant types:

```js
generateRestaurantTypes(items) {
	let result = {};
	for(i of items) {
		for(c of i.categories) {
		//ignore the generic
		if(c.id !== '100-1000-0000') {
			if(!result[c.name]) result[c.name] = 0;
			result[c.name]++;
		}
		}
	}
	return result;
},
```

You'll notice I ignore the top level type so I can focus on more specific types. Then I get my food types:

```js
generateFoodTypes(items) {
	let result = {};
	for(i of items) {
		if(i.foodTypes) {
		for(c of i.foodTypes) {
			//only do the primary
			if(c.primary) {
			if(!result[c.name]) result[c.name] = 0;
			result[c.name]++;
			}
		}
		}
	}
	return result;
	
},
```	

You'll notice I look for a `primary` flag on the data. Any restaurant returned will have multiple food types, but only one will be marked as primary. I can totally see removing this restriction as it may provide better, or at least different results. 

Both of the previous functions return simple JavaScript objects with the keys representing the name of the restauarant or food type and the value as the count. Both of these are passed to a simple utility function to return a sorted array. 

The final result, for my location:

* American - 24
* Pizza - 7
* Seafood - 6
* International - 5
* Italian - 5
* Sandwich - 5
* American - Cajun - 4
* American - Barbecue/Southern - 3
* Greek - 3
* Burgers - 3
* American - Californian - 2
* Thai - 2
* Bistro - 2
* Chicken - 2
* Chinese - 2
* Mexican - 2
* Natural/Healthy - 2
* Ice Cream - 2
* Brunch - 1
* Japanese - Sushi - 1
* Breakfast - 1
* Asian - 1
* French - 1
* Pastries - 1

Some of this isn't surprising. While I live in the "heart" of the Cajun area, it's rare to find a proper "Cajun" restaurant. A lot of places will serve Cajun dishes, but not as their main attraction. I do think the Asian/Chinese numbers though are a bit low, as I can think of at least 5 off the top of my head.

Check out the complete demo below:

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="XWXpWme" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Food Report 1">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/XWXpWme">
  Food Report 1</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### Demo the Second

For the second demo, I wanted to kick it up a notch, mainly by making it easy to see what the food types look like in other areas. I start off with a full map of America (and that's my bias, I could use geolocation here and center on your location):

<p>
<img data-src="https://static.raymondcamden.com/images/2020/06/ft1.jpg" alt="Map centered on America" class="lazyload imgborder imgcenter">
</p>

If you click on a location, I then get the data and report it.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/06/ft2.jpg" alt="Food report for Bellingham, WA" class="lazyload imgborder imgcenter">
</p>

For the most part, this code isn't too difficult, except that I removed Vue.js and kept it vanilla. The front end is rather bare so I'll skip it (will share full code in a bit), so let's focus on the JavaScript. I begin with code handling displaying the map:

```js
// Obtain the default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

var map = new H.Map(
	document.getElementById('mapContainer'),
	defaultLayers.vector.normal.map,
	{
		zoom: 5,
		center: { lat: 35.22, lng: -92.02 },
		pixelRatio: window.devicePixelRatio || 1
	}
);

var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

var ui = H.ui.UI.createDefault(map, defaultLayers);
```

This centers the map, sets a zoom, and adds touch support and basic UI controls. Next, I get some handlers to the DOM:

```js
let instructions = document.querySelector('#instructions');
let result = document.querySelector('#result');
```

Now I add a touch handler for the map. It needs to figure out where you are and then get the data:

```js
map.addEventListener('tap', async evt => {

		// hide once tapped
		instructions.style.display = 'none';

		let geom = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
		let address = await reverseGeocode(geom);
		console.log('address is '+address);	
		let restaurants = await getRestaurants(geom);
		//console.log('restaurants', restaurants);
		//Note, we are NOT reporting on types in this demo, but I may bring it back.
	   	let types = sortToArray(generateRestaurantTypes(restaurants));
	    let foodTypes = sortToArray(generateFoodTypes(restaurants));
		console.log(foodTypes);
		let html = `
<h3>Location: ${address}</h3>

<b>Most Popular Food Types:</b>
<ul>
		`;
		for(let i=0;i<Math.min(foodTypes.length,10);i++) {
			html += `
			<li>${foodTypes[i].name}</li>
			`;
		};
		html += '</ul>';
		result.innerHTML = html;
	});
}
```

The tap event is passed location information which let's me use our [Reverse Geocode API](https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics/endpoint-reverse-geocode-brief.html) to translate it into a proper named location. I just use this for the display. 

I then ask for my data. As the comment says, I did do reporting on types of restaurants like my first demo, but ended up not rendering it. I should remove it I guess. Both functions called here haven't changed. I then write out the report, maxed to ten entries. 

You can demo this here: <https://cfjedimaster.github.io/heredemos/mapsjs/food.html>. The full source code may be found here: <https://github.com/cfjedimaster/heredemos/blob/master/mapsjs/food.js>. 

I've spent some time clicking around and I've got to say I find the results pretty fascinating. Let me know what you think by leaving me a comment below!

<i>Header photo by <a href="https://unsplash.com/@foodiesfeed?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jakub Kapusnak</a> on Unsplash</i>

cat food, this text is just here while I test some Algolia stuff. you may ignore. :)