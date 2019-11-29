---
layout: post
title: "Pagination and IndexedDB"
date: "2016-09-02T15:04:00-07:00"
categories: [javascript]
tags: []
banner_image: /images/banners/pagination.jpg
permalink: /2016/09/02/pagination-and-indexeddb
---

For a while now I've been meaning to write up a quick demo of adding pagination to a site using IndexedDB, and today I finally had some time to create an example. I'm not sure this is the *best* example of course, but hopefully it can help someone, and if folks have a better solution, please let me know in the comments. In order for this to make any sense, you'll need some basic knowledge of how IDB (IndexedDB) works in general. You can pick up my [book](https://www.amazon.com/Client-Side-Data-Storage-Keeping-Local/dp/1491935111/ref=as_sl_pc_qf_sp_asin_til?tag=raymondcamd06-20&linkCode=w00&linkId=URSVDLKI2FLVLMFM&creativeASIN=1491935111) or [video](http://shop.oreilly.com/product/0636920043638.do) on client-side storage (both of which cost money) or read the *extremely* well done (and free) documentation at MozDevNet: [Using IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)

<!--more-->

I began by building an initial demo that would handle creating seed data and simply displaying all the data. I wanted that done first so I could then "upgrade" it with pagination. I began by building a simple front end. I've got a table, pagination buttons, and that's it.

<pre><code class="language-markup">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
		&lt;link rel=&quot;stylesheet&quot; href=&quot;app.css&quot;&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

		&lt;h2&gt;Cats&lt;&#x2F;h2&gt;
		&lt;table id=&quot;catTable&quot;&gt;
			&lt;thead&gt;
				&lt;tr&gt;
					&lt;th&gt;Name&lt;&#x2F;th&gt;
					&lt;th&gt;Breed&lt;&#x2F;th&gt;
					&lt;th&gt;Color&lt;&#x2F;th&gt;
					&lt;th&gt;Age&lt;&#x2F;th&gt;
				&lt;&#x2F;tr&gt;
			&lt;&#x2F;thead&gt;
			&lt;tbody&gt;&lt;&#x2F;tbody&gt;
		&lt;&#x2F;table&gt;

		&lt;!-- pagination --&gt;
		&lt;p&gt;
		&lt;button id=&quot;backButton&quot; disabled&gt;Back&lt;&#x2F;button&gt;
		&lt;button id=&quot;backButton&quot; disabled&gt;Forward&lt;&#x2F;button&gt;
		&lt;&#x2F;p&gt;
		
		&lt;script src=&quot;app.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

The only thing really interesting here is that I ensure my pagination buttons are disabled by default. We'll only enable them if necessary, and not till the next version. Now let's look at app.js.

<pre><code class="language-javascript">
&#x2F;&#x2F;global handler for the IDB
var db;

&#x2F;&#x2F;current position
var position = 0;

document.addEventListener(&#x27;DOMContentLoaded&#x27;, init, false);

function init() {
	console.log(&#x27;page init&#x27;);

	dbSetup().then(function() {
		console.log(&#x27;db is setup&#x27;);
		
		displayData();

	}).catch(function(e) {
		console.log(&#x27;I had an issue making the db: &#x27;+e);	
	});
}

function dbSetup() {
	var p = new Promise(function(resolve, reject) {

		var req = window.indexedDB.open(&#x27;page_test&#x27;, 1);

		req.onupgradeneeded = function(e) {
			var thedb = e.target.result;
			var os = thedb.createObjectStore(&quot;cats&quot;, {% raw %}{ autoIncrement:true}{% endraw %});
			os.createIndex(&quot;name&quot;, &quot;name&quot;, {% raw %}{unique:false}{% endraw %});
			os.createIndex(&quot;age&quot;,&quot;age&quot;, {% raw %}{unique:false}{% endraw %});
		};

		req.onsuccess = function(e) {
			db = e.target.result;
			resolve();
		};

		req.onerror = function(e) {
			reject(e);
		};

	});
	return p;
}

function displayData() {
	
	getData().then(function(cats) {
		var s = &#x27;&#x27;;
		cats.forEach(function(cat) {

			s += `
&lt;tr&gt;
	&lt;td&gt;${% raw %}{cat.name}{% endraw %}&lt;&#x2F;td&gt;
	&lt;td&gt;${% raw %}{cat.breed}{% endraw %}&lt;&#x2F;td&gt;
	&lt;td&gt;${% raw %}{cat.color}{% endraw %}&lt;&#x2F;td&gt;
	&lt;td&gt;${% raw %}{cat.age}{% endraw %}&lt;&#x2F;td&gt;
&lt;&#x2F;tr&gt;`;

		});

		document.querySelector(&#x27;table#catTable tbody&#x27;).innerHTML = s;
		console.log(&#x27;got cats&#x27;);
	});

}

function getData() {

	var p = new Promise(function(resolve, reject) {

		var t = db.transaction([&#x27;cats&#x27;],&#x27;readonly&#x27;);
		var catos = t.objectStore(&#x27;cats&#x27;);
		var cats = [];

		catos.openCursor().onsuccess = function(e) {
			var cursor = e.target.result;
			if(cursor) {
				cats.push(cursor.value);
				cursor.continue();
			} else {
				resolve(cats);
			}
		};

	});

	return p;
}

&#x2F;*
there is no call to this, as it is a one time&#x2F;test type thing.
*&#x2F;
function seedData() {

	var getRandomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
 
	var randomName = function() {
		var initialParts = [&quot;Fluffy&quot;,&quot;Scruffy&quot;,&quot;King&quot;,&quot;Queen&quot;,&quot;Emperor&quot;,&quot;Lord&quot;,&quot;Hairy&quot;,&quot;Smelly&quot;,&quot;Most Exalted Knight&quot;,&quot;Crazy&quot;,&quot;Silly&quot;,&quot;Dumb&quot;,&quot;Brave&quot;,&quot;Sir&quot;,&quot;Fatty&quot;,&quot;Poopy&quot;,&quot;Scared&quot;,&quot;Old&quot;,&quot;Kid&quot;];
		var lastParts = [&quot;Sam&quot;,&quot;Smoe&quot;,&quot;Elvira&quot;,&quot;Jacob&quot;,&quot;Lynn&quot;,&quot;Fufflepants the III&quot;,&quot;Squarehead&quot;,&quot;Redshirt&quot;,&quot;Titan&quot;,&quot;Kitten Zombie&quot;,&quot;Dumpster Fire&quot;,&quot;Butterfly Wings&quot;,&quot;Unicorn Rider&quot;];
		return initialParts[getRandomInt(0, initialParts.length-1)] + &#x27; &#x27; + lastParts[getRandomInt(0, lastParts.length-1)];
	};
 
	var randomColor = function() {
		var colors = [&quot;Red&quot;,&quot;Blue&quot;,&quot;Green&quot;,&quot;Yellow&quot;,&quot;Rainbow&quot;,&quot;White&quot;,&quot;Black&quot;,&quot;Invisible&quot;,&quot;Plaid&quot;,&quot;Angry&quot;];
		return colors[getRandomInt(0, colors.length-1)];
	};
 
	var randomGender = function() {
		var genders = [&quot;Male&quot;,&quot;Female&quot;];
		return genders[getRandomInt(0, genders.length-1)];
	};
 
   var randomAge = function() {
     return getRandomInt(1, 15);
   };
 
   function randomBreed() {
     var breeds = [&quot;American Shorthair&quot;,&quot;Abyssinian&quot;,&quot;American Curl&quot;,&quot;American Wirehair&quot;,&quot;Bengal&quot;,&quot;Chartreux&quot;,&quot;Devon Rex&quot;,&quot;Maine Coon&quot;,&quot;Manx&quot;,&quot;Persian&quot;,&quot;Siamese&quot;];
     return breeds[getRandomInt(0, breeds.length-1)];
   }
 
   &#x2F;&#x2F;make 25 cats
   var cats = [];
   for(var i=0;i&lt;25;i++) {
     var cat = {
       name:randomName(),
       color:randomColor(),
       gender:randomGender(),
       age:randomAge(),
       breed:randomBreed()
	   };
	   cats.push(cat);
   }

   var catStore = db.transaction([&#x27;cats&#x27;], &#x27;readwrite&#x27;).objectStore(&#x27;cats&#x27;);
   cats.forEach(function(cat) {
	   catStore.put(cat);
	   console.log(&#x27;I just stored a cat.&#x27;);
   });

}
</code></pre>

Ok, there's quite a bit going on here, but let's take it top to bottom. I begin by creating my IDB database, "page_test". My object store is called cats and I've made two indexes on it. I didn't end up using those indexes, but they made sense to me so I added them anyway.

`displayData` handles calling off to `getData` and then rendering the cats. Again, it should all pretty straightforward, but let me know if not. `getData` opens up a cursor to iterate over the object store and simply create an array of cats. A "Cat Array" if you will.

As an example, here is an array of cats, size three (credit <a href="https://flic.kr/p/otgiMo">Michelle Gabriel</a>):

![Cat Array](https://static.raymondcamden.com/images/2016/09/cats.jpg) 

`seedData` is not actually called by any function. I opened up my console and simply ran it there. Yes, it is a lot of code just to generate fake data, but I had this built already for a Node.js app I wrote for work ("<a href="https://strongloop.com/strongblog/building-javascript-charts-powered-by-loopback/">Building JavaScript Charts Powered by LoopBack</a>"). Yes, that was real work. Why are you laughing at me?

So the end result, after manually running `seedData`, will be a table of cat data:

<img src="https://static.raymondcamden.com/images/2016/09/cat1.jpg" class="imgborder" alt="Cat Table">

So that worked. This version of the code may be found in the `v1` folder in the zip attached to the article. Now let's discuss pagination.

Pagination can be achieved by using two methods. First, we need to determine the size of our data set. Luckily there's a `count` method you can use on an object store.

<pre><code class="language-javascript">
function countData() {

	return new Promise(function(resolve, reject) {
		
		db.transaction([&#x27;cats&#x27;],&#x27;readonly&#x27;).objectStore(&#x27;cats&#x27;).count().onsuccess = function(e) {
			resolve(e.target.result);
		};

	});

}
</code></pre>

The next thing we need is a way to get one "page" of data. That is possible by using the `advance` method of the cursor object. This is a bit tricky. The MozDevNet <a href="https://developer.mozilla.org/en-US/docs/Web/API/IDBCursor/advance">example</a> illustrates going through an entire object store and skipping over two rows on every iteration. What we want is something different - do an *initial* skip to the beginning of our page and then end where it makes sense. Here is the updated version of the code with this in action. (I left out `seedData`.)

<pre><code class="language-javascript">
&#x2F;&#x2F;global handler for the IDB
var db;

&#x2F;&#x2F;current position for paging
var position = 0;

&#x2F;&#x2F;total number of cats
var totalCats;

&#x2F;&#x2F;dom items for prev&#x2F;next buttons, not using jQuery but like the syntax
var $prev, $next;

&#x2F;&#x2F;how many per page?
var page = 10;

document.addEventListener(&#x27;DOMContentLoaded&#x27;, init, false);

function init() {
	console.log(&#x27;page init&#x27;);

	$prev = document.querySelector(&quot;#backButton&quot;);
	$next = document.querySelector(&quot;#nextButton&quot;);

	$prev.addEventListener(&#x27;click&#x27;, move);
	$next.addEventListener(&#x27;click&#x27;, move);

	dbSetup().then(function() {
		console.log(&#x27;db is setup&#x27;);
		
		countData().then(function(result) {
			totalCats = result;
			displayData();
		});

	}).catch(function(e) {
		console.log(&#x27;I had an issue making the db: &#x27;+e);	
	});
}

function dbSetup() {

	return new Promise(function(resolve, reject) {

		var req = window.indexedDB.open(&#x27;page_test&#x27;, 1);

		req.onupgradeneeded = function(e) {
			var thedb = e.target.result;
			var os = thedb.createObjectStore(&quot;cats&quot;, {% raw %}{ autoIncrement:true}{% endraw %});
			os.createIndex(&quot;name&quot;, &quot;name&quot;, {% raw %}{unique:false}{% endraw %});
			os.createIndex(&quot;age&quot;,&quot;age&quot;, {% raw %}{unique:false}{% endraw %});
		};

		req.onsuccess = function(e) {
			db = e.target.result;
			resolve();
		};

		req.onerror = function(e) {
			reject(e);
		};

	});

}

function countData() {

	return new Promise(function(resolve, reject) {
		
		db.transaction([&#x27;cats&#x27;],&#x27;readonly&#x27;).objectStore(&#x27;cats&#x27;).count().onsuccess = function(e) {
			resolve(e.target.result);
		};

	});

}

function displayData() {
	
	getData(position,page).then(function(cats) {
		var s = &#x27;&#x27;;
		cats.forEach(function(cat) {

			s += `
&lt;tr&gt;
	&lt;td&gt;${% raw %}{cat.name}{% endraw %}&lt;&#x2F;td&gt;
	&lt;td&gt;${% raw %}{cat.breed}{% endraw %}&lt;&#x2F;td&gt;
	&lt;td&gt;${% raw %}{cat.color}{% endraw %}&lt;&#x2F;td&gt;
	&lt;td&gt;${% raw %}{cat.age}{% endraw %}&lt;&#x2F;td&gt;
&lt;&#x2F;tr&gt;`;

		});

		document.querySelector(&#x27;table#catTable tbody&#x27;).innerHTML = s;
		console.log(&#x27;got cats&#x27;);

		&#x2F;*
		so do we show&#x2F;hide prev and next?
		*&#x2F;
		if(position &gt; 0) {
			console.log(&#x27;enable back&#x27;);
			$prev.removeAttribute(&#x27;disabled&#x27;);
		} else {
			$prev.setAttribute(&#x27;disabled&#x27;, &#x27;disabled&#x27;);
		}
		if(position + page &lt; totalCats) {
			console.log(&#x27;enable next&#x27;);
			$next.removeAttribute(&#x27;disabled&#x27;);
		} else {
			$next.setAttribute(&#x27;disabled&#x27;, &#x27;disabled&#x27;);
		}

	});

}

function move(e) {
	if(e.target.id === &#x27;nextButton&#x27;) {
		position += page;
		displayData();
	} else {
		position -= page;
		displayData();
	}

}

function getData(start,total) {

	return new Promise(function(resolve, reject) {

		var t = db.transaction([&#x27;cats&#x27;],&#x27;readonly&#x27;);
		var catos = t.objectStore(&#x27;cats&#x27;);
		var cats = [];

		console.log(&#x27;start=&#x27;+start+&#x27; total=&#x27;+total);
		var hasSkipped = false;
		catos.openCursor().onsuccess = function(e) {

			var cursor = e.target.result;
			if(!hasSkipped &amp;&amp; start &gt; 0) {
				hasSkipped = true;
				cursor.advance(start);
				return;
			}
			if(cursor) {
				console.log(&#x27;pushing &#x27;,cursor.value);
				cats.push(cursor.value);
				if(cats.length &lt; total) {
					cursor.continue();
				} else {
					resolve(cats);
				}
			} else {
				console.log(&#x27;resolving &#x27;,cats);
				resolve(cats);
			}
		};

	});

}
</code></pre>

Ok, so again, let's take it top to bottom, and I'll focus on the changes. I've got a few new variables to help me with paging, including `position` and `totalCats`. My `init` method now calls `countData` first and then runs `displayData`. This way I know, at the beginning, how big my dataset is. 

`displayData` now checks that count as well as the current position and determines if the navigation buttons should be enabled. These buttons both use a `move` event that handles changing the value of `position` and rerunning our display. 

`getData` has been updated to handle a start value and a total. In order to handle beginning at the right value, we still open a cursor as before, but on the *first* call we use `advance` to set our starting position. The other change is to recognize when we have as many cats as we need (NEVER ENOUGH CATS!) and end iterating early if so. And here is the end result.

![Fancy animated gif](https://static.raymondcamden.com/images/2016/09/out.gif)

It seems to work well. Have any ideas for improvements?

[Download Example Code](https://static.raymondcamden.com/enclosures/pagingdemo.zip)