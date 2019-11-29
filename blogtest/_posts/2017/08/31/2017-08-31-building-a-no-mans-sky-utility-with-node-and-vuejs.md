---
layout: post
title: "Building a No Man's Sky Utility with Node and Vue.js"
date: "2017-08-31T08:28:00-07:00"
categories: [development]
tags: [javascript,vuejs]
banner_image: /images/banners/nomansskyv.jpg
permalink: /2017/08/31/building-a-no-mans-sky-utility-with-node-and-vuejs
---

Nearly a year ago I [blogged](https://www.raymondcamden.com/2016/09/04/review-no-mans-sky/) my review of "No Man's Sky", a game that garnered near universal hate or love, with not many people in the middle. Since that time, the game has been updated a few times and it has become incredibly rich. I'm now on my second play and I see myself dedicating all of my game playing time on it for the next few months. (This is also the first game I bought for both console and PC.) For a good look at what's changed, I recommend Kotaku's article: <a href="http://kotaku.com/no-mans-sky-is-good-now-1798630668">"No Man's Sky Is Good Now"</a>.

One of the biggest aspects of the game is crafting, and while that can sometimes be a chore, it can also be satisfying to build out your ship and base. I noticed that I had a hard time keeping track of what I needed to gather. What I mean is - consider that I want to build item X. It needs 50 iron and 50 platinum. That's easy enough to track, but consider item Y. It needs 50 iron and platinum too, but also a DooHicky. A DooHick needs 25 iron and 100 beers. (Ok, I'm kinda making this up as a go.) So the *total* needs for item Y are 75 iron, 50 platinum, and 100 beers. It gets more confusing when you add multiple items you need.

I decided to attempt to build a tool that would let me say, given I want X and Y, just tell me the list of raw resources I need to build. I thought this would give me a chance to play with [Vue.js](https://vuejs.org/) again and actually create something I'd use. If you aren't interested in the tech and just want to check the tool out, you can find it here: 

https://cfjedimaster.github.io/nomanssky/client/index.html

Alright, now let's dig into the tech!

Getting the Data
===

In order to build my web app, I needed access to the data. Unfortunately, that data doesn't exist anywhere in raw form. If I wanted this information I was going to have to find a way to create it. The <a href="https://nomanssky.gamepedia.com/No_Man%27s_Sky_Wiki">No Man's Sky</a> wiki contains all of this information online in HTML format. It's maintained by the NMS community (passionate folks there) so it's always up to date. Turns out, the wiki software behind the site has an <a href="https://www.mediawiki.org/wiki/API:Main_page">API</a>. The API wasn't always terribly clear to me, but I was able to figure out a few things.

First, I could ask the wiki for a list of pages for a category. I found four different categories on the site that included the data I needed. Here's an example of that API call:

https://nomanssky.gamepedia.com/api.php?action=query&list=categorymembers&cmtitle=Category:Blueprints&cmlimit=500&format=json&formatversion=2

Next, I found out that you could get the "raw" data for a page by adding `?action=raw` to a URL. So here is a page in regular form: 

https://nomanssky.gamepedia.com/Crafting

And here is the raw form:

https://nomanssky.gamepedia.com/Crafting?action=raw

Notice the HTML is removed and it's a "data-ish" format suitable for parsing. When looking at a page for a blueprint, I saw this form was used to display crafting information:

```
==Crafting==
{% raw %}{{Craft|{% endraw %}Carite Sheet,1;Platinum,15;Zinc,10{% raw %}|blueprint=yes}}{% endraw %}
{% raw %}{{Repair|{% endraw %}Carite Sheet,1;Platinum,8;Zinc,5}}
{% raw %}{{Dismantle|{% endraw %}Carite Sheet,0;Platinum,7;Zinc,5}}
```

The first line there is for crafting, then you see repair costs and what you get if you dismantle.

My approach then was simple - get all the items that you can craft, and then suck down the "raw" form of the page and use a regex to get the data. I wrote my first script, getBuildable.js, to handle that.

<pre><code class="language-javascript">&#x2F;*
I get a list of things you can build, which is a combination of the Blueprints category
and Products category. Technically products have blueprints, but the wiki doesn&#x27;t list things
in products under Blueprints. Not sure why.
*&#x2F;
const rp = require(&#x27;request-promise&#x27;);

&#x2F;&#x2F; The URL for getting blueprints
const bpURL = &#x27;https:&#x2F;&#x2F;nomanssky.gamepedia.com&#x2F;api.php?action=query&amp;list=categorymembers&amp;cmtitle=Category:Blueprints&amp;cmlimit=500&amp;format=json&amp;formatversion=2&#x27;;
&#x2F;&#x2F; The URL for products:
const pURL = &#x27;https:&#x2F;&#x2F;nomanssky.gamepedia.com&#x2F;api.php?action=query&amp;list=categorymembers&amp;cmtitle=Category:Products&amp;cmlimit=500&amp;format=json&amp;formatversion=2&#x27;;
&#x2F;&#x2F; The URL for consumables
const cURL = &#x27;https:&#x2F;&#x2F;nomanssky.gamepedia.com&#x2F;api.php?action=query&amp;list=categorymembers&amp;cmtitle=Category:Consumables&amp;cmlimit=500&amp;format=json&amp;formatversion=2&#x27;;
&#x2F;&#x2F; The URL for Technology components
const tURL = &#x27;https:&#x2F;&#x2F;nomanssky.gamepedia.com&#x2F;api.php?action=query&amp;list=categorymembers&amp;cmtitle=Category:Technology_components&amp;cmlimit=500&amp;format=json&amp;formatversion=2&#x27;;


&#x2F;&#x2F;base url for fetching page content
const rawURLBase = &#x27; https:&#x2F;&#x2F;nomanssky.gamepedia.com&#x2F;&#x27;;

&#x2F;*
I saw some content that is &#x27;special&#x27; and should be ignored. Hard coded list for now.

Night Crystals needs to be checked later
*&#x2F;
const IGNORE_TITLES = [
	&#x27;Blueprint&#x27;,
	&#x27;Blueprint Trader&#x27;,
	&#x27;Jetpack&#x27;,
	&#x27;Category:Blueprint panels&#x27;,
	&#x27;Product&#x27;,
	&#x27;Alloy&#x27;,
	&#x27;Consumable&#x27;,
	&#x27;Crafting&#x27;,
	&#x27;Night Crystals&#x27;,
	&#x27;Category:Consumables&#x27;,
	&#x27;Nanite Tech Acquisitions&#x27;
];


Promise.all([
	rp({% raw %}{json:true,url:bpURL}{% endraw %}),
	rp({% raw %}{json:true,url:pURL}{% endraw %}),
	rp({% raw %}{json:true,url:cURL}{% endraw %}),
	rp({% raw %}{json:true,url:tURL}{% endraw %})
]).then((results) =&gt; {
	let [blueprints,products,consumables,technology] = results;
	let buildable = blueprints.query.categorymembers;
	&#x2F;&#x2F;we have dupes, so check first
	products.query.categorymembers.forEach((prod) =&gt; {
		let existing = buildable.findIndex(b =&gt; {
			return b.title == prod.title;
		});
		if(existing === -1) buildable.push(prod);
	});
	consumables.query.categorymembers.forEach((con) =&gt; {
		let existing = buildable.findIndex(b =&gt; {
			return b.title == con.title;
		});
		if(existing === -1) buildable.push(con);
	});
	technology.query.categorymembers.forEach((tech) =&gt; {
		let existing = buildable.findIndex(b =&gt; {
			return b.title == tech.title;
		});
		if(existing === -1) buildable.push(tech);
	});

	&#x2F;&#x2F;filter out specials
	buildable = buildable.filter(item =&gt; {
		return IGNORE_TITLES.indexOf(item.title) === -1;
	});

	&#x2F;&#x2F;trim for testing
	&#x2F;&#x2F;TEMP
	&#x2F;*
	buildable = buildable.filter(item =&gt; {
		return item.title == &#x27;Plasma Core Casing V1&#x27;;
	});
	*&#x2F;
	&#x2F;&#x2F;buildable = buildable.slice(0,90);

	console.log(&#x27;Total &#x27;+buildable.length + &#x27; things to parse.&#x27;);

	let promises = [];
	buildable.forEach(thing =&gt; {
		let rawURL =  `${% raw %}{rawURLBase}{% endraw %}${% raw %}{thing.title}{% endraw %}?action=raw`;			
		promises.push(rp(rawURL));
	});

	Promise.all(promises).then(results =&gt; {
		results.forEach((result,idx) =&gt; {
			let parts = getParts(result, buildable[idx].title);
			buildable[idx].parts = parts;
			&#x2F;&#x2F;while we&#x27;re here, lets kill ns
			delete buildable[idx].ns;
		});

		&#x2F;*
		I want to signify when a part is craftable. My logic is, 
		if part&#x27;s title is NOT in the main list, it must be a base item.
		ToDo: Decide if that makes freaking sense.
		*&#x2F;
		buildable.forEach((item, idx) =&gt; {
			&#x2F;&#x2F;Rename title to name
			item.name = item.title.trim();
			delete item.title;


		});

		&#x2F;&#x2F;now sort by title
		buildable = buildable.sort((a, b) =&gt; {
			if(a.name &lt; b.name) return -1;
			if(a.name &gt; b.name) return 1;
			return 0;
		});

		console.log(JSON.stringify(buildable,null, &#x27;\t&#x27;));
	});


});


&#x2F;*
Given raw wiki text, look for: 
==Crafting==
{% raw %}{{Craft|{% endraw %}Name,Qty;Name2,Qty; (there is also blueprint=yes&#x2F;no I may care aboyt later
*&#x2F;
function getParts(s,name) {
	let re = &#x2F;{% raw %}{{Craft\|{% endraw %}(.*?)[\{% raw %}||}{% endraw %}}]+&#x2F;;
	let found = s.match(re);
	if(!found || found.length !== 2) {
		console.log(s);
		throw new Error(&quot;Unable to find Craft line for &quot;+name);
	}
	let productsRaw = found[1];
	&#x2F;&#x2F;productsRaw looks like: x,qty;y,qty2
	let partsRaw = productsRaw.split(&#x27;;&#x27;);
	&#x2F;&#x2F;drop the end if it is blank
	if(partsRaw[partsRaw.length-1] === &#x27;&#x27;) partsRaw.pop();
	let parts = [];
	partsRaw.forEach((pair) =&gt; {
		let [partName, partQty] = pair.split(&#x27;,&#x27;);
		parts.push({% raw %}{name:partName.trim(),qty:Number(partQty)}{% endraw %});
	});
	return parts;
}
</code></pre>

For the most part, it's just "suck down a bunch of crap and parse", not anything really special, and it mostly worked on my first few tries. To run it, I did: `node getBuildable.js > results.json` and then simply removed the initial plain text value on top to have a valid JSON file. (Yeah, that's clunky, but I only ran it a few times.) 

This gave me a JSON file of everything could be crafted and the parts necessary to do it. I *thought* I was done and moved on to the front end, but then I realized an issue. My goal was to generate a list of raw materials, therefore if a part of item X also has parts, I needed to recursively dig to get my list. I was going to do that on the front end, but then I thought - why do that every time? I decided to write another script that simply took the initial JSON and determined the "raw resources" necessary for every item. 

Sadly, this took me like two hours. I hit a mental block with the recursion that I just struggled like hell to get past. My solution isn't even that nice, but at least I've got the "ugly" outside the web app and I can look at improving it later. Here is that script - don't laugh too loudly.

<pre><code class="language-javascript">&#x2F;*

So getBuildable gives us a &#x27;pure&#x27; data list that looks like this:

	{
		&quot;pageid&quot;: 4274,
		&quot;title&quot;: &quot;Aeration Membrane Tau&quot;,
		&quot;parts&quot;: [
			{
				&quot;name&quot;: &quot;Zinc&quot;,
				&quot;qty&quot;: 50
			},
			{
				&quot;name&quot;: &quot;Carbon&quot;,
				&quot;qty&quot;: 100
			},
			{
				&quot;name&quot;: &quot;Microdensity Fabric&quot;,
				&quot;qty&quot;: 1,
				&quot;subcomponent&quot;: true
			}
		]
	}

	Notice that one item, Microdensity Fabric, is a subcomponent, and needs it&#x27;s own stuff.
	So the point of this funciton is to translate parts into a pure list of raw materials. 
	It will also be an array with name&#x2F;qty.

*&#x2F;

const fs = require(&#x27;fs&#x27;);
&#x2F;&#x2F;expect the name of the JSON file
let jsonFile = process.argv[2];
let data = JSON.parse(fs.readFileSync(jsonFile, &#x27;utf-8&#x27;));

data.forEach((item,idx) =&gt; {
	&#x2F;&#x2F;console.log(&#x27;Generate raw resources for &#x27;+idx+&#x27;) &#x27;+item.name +&#x27; :&#x27;+JSON.stringify(item.parts));
	item.rawresources = {};

	item.parts.forEach(part =&gt; {
		let resources = getResources(part);
		&#x2F;&#x2F;console.log(&#x27;resources for &#x27;+part.name+&#x27; was &#x27;+JSON.stringify(resources));
		
		resources.forEach(resource =&gt; {
			if(!item.rawresources[resource.name]) item.rawresources[resource.name] = 0;
			item.rawresources[resource.name] += resource.qty;
		});
		
	});

	&#x2F;&#x2F;console.log(&#x27;raw is &#x27;+JSON.stringify(item.rawresources,null,&#x27;\t&#x27;));

});

console.log(JSON.stringify(data,null,&#x27;\t&#x27;));
function getResources(r,arr) {
	if(!arr) arr = [];
	&#x2F;&#x2F;console.log(&#x27;getResource(&#x27;+r.name+&#x27;,&#x27;+arr.toString()+&#x27;)&#x27;);
	&#x2F;&#x2F;Am I subcomponent?
	if(!isSubcomponent(r)) {
		arr.push(r);
		return arr;
	} else {
		let subc = getSubcomponent(r);
		subc.parts.forEach(part =&gt; {
			let subparts = getResources(part);
			subparts.forEach(subpart =&gt; {
				arr.push(subpart);
			});
		});
		return arr;

	}

}

function isSubcomponent(part) {
	let subc = data.findIndex(item =&gt; {
		return item.name == part.name;
	});
	return (subc &gt;= 0);
}

function getSubcomponent(part) {
	let subc = data.findIndex(item =&gt; {
		return item.name == part.name;
	});
	return data[subc];
}
</code></pre>

So on to the front end. This is the second app I've built with Vue, and I still freaking love it, although I ran into some frustrations I'll explain as I go through the code. The front end is pretty simple, just three columns for layout. 

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;en&quot;&gt;
&lt;head&gt;
	&lt;meta charset=&quot;UTF-8&quot;&gt;
	&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;
	&lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;ie=edge&quot;&gt;
	&lt;title&gt;No Man&#x27;s Sky Resource Tracker&lt;&#x2F;title&gt;
	&lt;link rel=&quot;stylesheet&quot; href=&quot;app.css&quot;&gt;
	&lt;style&gt;
	[v-cloak] {
		display: none;
	}
	&lt;&#x2F;style&gt;
&lt;&#x2F;head&gt;
&lt;body&gt;

	&lt;h1&gt;No Man&#x27;s Sky Resource Tracker&lt;&#x2F;h1&gt;

	&lt;p&gt;
		The Resource Tracker lets you determine the raw materials necessary to craft items. Click on a blueprint to add it to your desired items list. Created by &lt;a href=&quot;https:&#x2F;&#x2F;www.raymondcamden.com&quot;&gt;Raymond Camden&lt;&#x2F;a&gt; with data from the &lt;a href=&quot;https:&#x2F;&#x2F;nomanssky.gamepedia.com&#x2F;No_Man%27s_Sky_Wiki&quot;&gt;No Man&#x27;s Sky Wiki&lt;&#x2F;a&gt;.
	&lt;&#x2F;p&gt;

	&lt;div id=&quot;bpList&quot; v-cloak class=&quot;wrapper&quot;&gt;

			&lt;div class=&quot;one&quot;&gt;
			&lt;h2&gt;Blueprint List&lt;&#x2F;h2&gt;
			&lt;input type=&quot;search&quot; placeholder=&quot;Filter&quot; v-model=&quot;filter&quot;&gt;

			&lt;ul class=&quot;blueprint&quot;&gt;
				&lt;li v-for=&quot;blueprint in filteredBlueprints&quot; @click=&quot;addToCart(blueprint.name)&quot;&gt;{% raw %}{{ blueprint.name }}{% endraw %}&lt;&#x2F;li&gt;
			&lt;&#x2F;ul&gt;
			&lt;&#x2F;div&gt;
			
			&lt;div class=&quot;two&quot;&gt;
			&lt;h2&gt;Desired Items&lt;&#x2F;h2&gt;
			&lt;table v-if=&quot;items.length&quot; id=&quot;itemTable&quot;&gt;
				&lt;thead&gt;
				&lt;tr&gt;
					&lt;th&gt;Item&lt;&#x2F;th&gt;
					&lt;th&gt;Qty&lt;&#x2F;th&gt;
					&lt;th&gt;&amp;nbsp;&lt;&#x2F;th&gt;
				&lt;&#x2F;tr&gt;
				&lt;&#x2F;thead&gt;
				&lt;tbody&gt;
				&lt;tr v-for=&quot;item in items&quot;&gt;
					&lt;td&gt;{% raw %}{{item.name}}{% endraw %}&lt;&#x2F;td&gt;
					&lt;td&gt;{% raw %}{{item.qty}}{% endraw %}&lt;&#x2F;td&gt;
					&lt;td @click=&quot;removeFromCart(item.name)&quot; class=&quot;remove&quot;&gt;Remove&lt;&#x2F;td&gt;
				&lt;&#x2F;tr&gt;
				&lt;&#x2F;tbody&gt;
			&lt;&#x2F;table&gt;
			&lt;&#x2F;div&gt;
			
			&lt;div class=&quot;three&quot;&gt;
			&lt;h2&gt;Resources Required&lt;&#x2F;h2&gt;
			&lt;table v-if=&quot;neededResources.length&quot;&gt;
				&lt;thead&gt;
				&lt;tr&gt;
					&lt;th&gt;Item&lt;&#x2F;th&gt;
					&lt;th&gt;Qty&lt;&#x2F;th&gt;
				&lt;&#x2F;tr&gt;
				&lt;&#x2F;thead&gt;
				&lt;tbody&gt;
				&lt;tr v-for=&quot;res in neededResources&quot;&gt;
					&lt;td&gt;{% raw %}{{res.name}}{% endraw %}&lt;&#x2F;td&gt;
					&lt;td&gt;{% raw %}{{res.qty}}{% endraw %}&lt;&#x2F;td&gt;
				&lt;&#x2F;tr&gt;
				&lt;&#x2F;tbody&gt;
			&lt;&#x2F;table&gt;
			&lt;&#x2F;div&gt;
						
	&lt;&#x2F;div&gt;

	&lt;script src=&quot;https:&#x2F;&#x2F;unpkg.com&#x2F;vue&quot;&gt;&lt;&#x2F;script&gt;
	&lt;script src=&quot;app.js&quot;&gt;&lt;&#x2F;script&gt;	

&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

The Vue aspects here are pretty minimal, basically listing data. The idea is you click on a blueprint on the left side, this fills a "shopping cart" in the middle, and the right side is where your raw resource list is displayed. Now let's look at the code. (And again, this is my *second* Vue app, don't treat it as best practice.)

<pre><code class="language-javascript">let bpApp = new Vue({
	el:&#x27;#bpList&#x27;,
	data:{
		filter:&#x27;&#x27;,
		blueprints:[],
		items:[]
	},
	created:function() {
		fetch(&#x27;.&#x2F;data.json&#x27;)
		.then(res =&gt; res.json())
		.then(res =&gt; {
			this.blueprints = res;
		});
	},
	computed:{
		filteredBlueprints: function() {
			let thatFilter = this.filter.toLowerCase();
			return this.blueprints.filter(function(bp) {
				if(thatFilter === &#x27;&#x27;) return true;
				if(bp.name.toLowerCase().indexOf(thatFilter) &gt;= 0) return true;
				return false;
			});
		},
		neededResources:function() {
			let needed = {};
			let result = [];
			&#x2F;*
			ok, so our shopping cart (items) has an array of items and requirements.
			*&#x2F;
			for(let x=0;x&lt;this.items.length;x++) {
				let item = this.items[x];
				&#x2F;&#x2F;first, find it
				for(let i=0;i&lt;this.blueprints.length;i++) {
					if(this.blueprints[i].name === item.name) {
						for(let key in this.blueprints[i].rawresources) {
							if(!needed[key]) needed[key] = 0;
							needed[key] += Number(this.blueprints[i].rawresources[key]) * item.qty;
						}
					}
				}
			}
			&#x2F;&#x2F;now convert it to an array
			for(let key in needed) {
				result.push({% raw %}{name:key, qty: needed[key]}{% endraw %});
			}
			result.sort(function(a,b) {
				if(a.name &gt; b.name) return 1;
				if(a.name &lt; b.name) return -1;
				return 0;
			});
			return result;
		}
	},
	methods:{
		addToCart:function(item) {
			&#x2F;* why doesn&#x27;t this work?
			let existing = this.items.findExisting((item) =&gt; {
				return item.title === item;
			});
			*&#x2F;
			let existing = -1;
			for(let i=0;i&lt;this.items.length;i++) {
				if(this.items[i].name === item) existing = i;
			}
			if(existing === -1) {
				this.items.push({% raw %}{name:item, qty:1}{% endraw %});
			} else {
				this.items[existing].qty++;
			}

			this.items = this.items.sort((a,b) =&gt; {
				if(a.name &gt; b.name) return 1;
				if(a.name &lt; b.name) return -1;
				return 0;
			});
		},
		removeFromCart:function(item) {
			console.log(&#x27;remove &#x27;+item);
			let existing = -1;
			for(let i=0;i&lt;this.items.length;i++) {
				if(this.items[i].name === item) existing = i;
			}
			if(existing !== -1) {
				&#x2F;&#x2F;in theory it should ALWAYs match, but...
				this.items.splice(existing, 1);
			}
		}
	}
});
</code></pre>

Ok, so let's dig into this. First, my list of blueprints is a simple array and I use the `created` event to handle loading it. That works awesome. But what I really freaking like is how filtering works. In my HTML, I told it to loop over `filteredBlueprints`, which I've defined here as a computed property. This lets me keep the original list "pure" and handle returning a list that may or may not be filtered by user input. 

Note this line: 

	let thatFilter = this.filter.toLowerCase();

Yeah, so this is what bugged me. The Vue docs had mentioned not using arrow functions because it messes with the This scope, but then I had issues using my `filter` value in the callback. I got some feedback from @elpete on a [gist](https://gist.github.com/cfjedimaster/9096aabdfdb8a09c1f02d5fe5dec8c30) I created to share my issues, and I think I get the reasons why, but it was still a bit awkward. 

Another odd issue I ran into was in `addToCart`, where findExisting didn't work on the array instance. I'm still not sure why it failed and it was an easy workaround, but I'm still confused. 

The final bit was the `neededResources` computed property which was simply a matter of looping over my "cart" and creating an object to store product requirements and totals. I then convert that object back into a simple array for rendering. 

Outside of my frustrations, I am really falling hard for Vue. I love how I don't have to generate layout in my JS code. The computed properties part of this app was really freaking awesome. 

As always though I'd happily take feedback on how I used Vue. If you have any suggestions, just let me know in a comment below! You can find the complete source code for both the Node parsing scripts and the front end here: https://github.com/cfjedimaster/nomanssky/.