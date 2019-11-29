---
layout: post
title: "Selecting a random record from an IndexedDB Object Store"
date: "2014-11-30T10:11:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2014/11/30/Selecting-a-random-record-from-an-IndexedDB-Object-Store
guid: 5361
---

<p>
A few days ago I ran across an interesting post on Stack Overflow, <a href="http://stackoverflow.com/questions/27124058/is-there-any-way-to-retrieve-random-row-from-indexeddb">Is there any way to retrieve random row from indexeddb?</a> The posted answer used the following process:
</p>
<!--more-->
<ul>
<li>Open an index.
<li>Iterate over every row.
<li>On the first iteration, use the key value as an upper bound, and select a random number from 1 to that number.
<li>Iterate until you hit that number.
</ul>

<p>
While this worked, it seemed like a bad idea to iterate over - possibly - a huge number of rows to get to the random row you wanted. I double checked the spec and discovered what seems to be a simpler solution. When you have opened a cursor (and for those who don't know IDB very well, think of it as simply a way to iterate over a table), you can either continue to the next row, continue to a specific key, or use the <a href="https://dvcs.w3.org/hg/IndexedDB/raw-file/default/Overview.html#widl-IDBCursor-advance-void-unsigned-long-count">advance</a> method to go forward a specific number of rows.
</p>

<p>
I figured <code>advance</code> would be a good way to handle this. I built a simple demo that demonstrates this. I won't bother showing the HTML as it is just two buttons (one to add some seed data and one to select the random value), but you can view source on the linked demo below if you want. Here is the JavaScript. Note - this code can <strong>definitely</strong> be rewritten to be a bit tighter.
</p>

<pre><code class="language-javascript">&#x2F;* global $,document,indexedDB,console *&#x2F;

&#x2F;**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 *&#x2F;
function getRandomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

$(document).ready(function() {
	var db;

	var openRequest = indexedDB.open(&quot;randomidb&quot;,1);

	openRequest.onupgradeneeded = function(e) {
		var thisDB = e.target.result;

		console.log(&quot;running onupgradeneeded&quot;);

		if(!thisDB.objectStoreNames.contains(&quot;notes&quot;)) {
			thisDB.createObjectStore(&quot;notes&quot;, {% raw %}{autoIncrement:true}{% endraw %});
		}
	};


	openRequest.onsuccess = function(e) {
		console.log(&quot;running onsuccess&quot;);

		db = e.target.result;

		$(&quot;#seedButton&quot;).on(&quot;click&quot;, function() {

			var store = db.transaction([&quot;notes&quot;],&quot;readwrite&quot;).objectStore(&quot;notes&quot;);

			for(var i=0; i&lt;10; i++) {
				var note = {
					title:&quot;Just a random note: &quot;+getRandomInt(1,99999),
					created:new Date()
				};

				var request = store.add(note);

				request.onerror = function(e) {
					console.log(&quot;Error&quot;,e.target.error.name);
					&#x2F;&#x2F;some type of error handler
				};

				request.onsuccess = function(e) {
					console.log(&quot;Woot! Did it&quot;);
				};
			}

		});

		$(&quot;#randomButton&quot;).on(&quot;click&quot;, function() {

			&#x2F;&#x2F;success handler, could be passed in
			var done = function(ob) {
				console.log(&quot;Random result&quot;,ob);	
			};

			&#x2F;&#x2F;ok, first get the count
			var store = db.transaction([&quot;notes&quot;],&quot;readonly&quot;).objectStore(&quot;notes&quot;);

			store.count().onsuccess = function(event) {
				var total = event.target.result;
				var needRandom = true;
				console.log(&quot;ok, total is &quot;+total);
				store.openCursor().onsuccess = function(e) {
					var cursor = e.target.result;
					if(needRandom) {
						var advance = getRandomInt(0, total-1);
						console.log(&quot;going up &quot;+advance);
						if(advance &gt; 0) {
							needRandom = false;
							cursor.advance(advance);	
						} else {
							done(cursor);
						}
					} else {
						done(cursor);
					}

				};

			};

		});

	};

});</code></pre>

<p>
I assume we can skip the IDB setup and seed functions. I built the bare minimum so I could test the random aspect. The random selection code works by first doing a count on the object store. This returns - yes - the count. Once we have that, we open a cursor that would normally let us iterate over the entire store. On the first iteration it has the first row. We then ask for a random number. Our range starts at 0 because we want to support the first row being acceptable as well. Based on that number we advance X number of rows and return <i>that</i> result to the <code>done</code> function. If for some reason 0 was selected, we run <code>done</code> right away.
</p>

<p>
Not rocket science, but it seems to work well. At most you run two iterations, not N, so it seems like it should be much more performant than the original answer on Stack Overflow. As I said, this was my first version so the code could definitely be organized a bit better. You can view the demo here: <a href="http://www.raymondcamden.com/demos/2014/nov/30/test1.html">http://www.raymondcamden.com/demos/2014/nov/30/test1.html</a>.