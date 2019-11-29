---
layout: post
title: "IndexedDB and Limits - IE"
date: "2015-04-24T08:34:06+06:00"
categories: [development,html5,javascript]
tags: []
banner_image: 
permalink: /2015/04/24/indexeddb-and-limits-ie
guid: 6052
---

Last week I <a href="http://www.raymondcamden.com/2015/04/17/indexeddb-and-limits">blogged</a> about maxing out the database size on your browser with IndexedDB, but I didn't test with IE. This morning I did, and unfortunately, it looks like IE does the same bad thing it does with LocalStorage (see my <a href="http://www.raymondcamden.com/2015/04/14/blowing-up-localstorage-or-what-happens-when-you-exceed-quota">post</a> for details).

<!--more-->

I discovered that IE11 would silently fail on adding LocalStorage data when the storage limit was reached. Even worse, you could set, <i>and read</i> data that wasn't actually stored. I slightly modified my code from the previous post to make it a bit more verbose. Here is the new version - I'll point out what's new below.

<pre><code class="language-markup">&lt;!doctype html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;meta name=&quot;viewport&quot; content=&quot;user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height&quot; &#x2F;&gt;
&lt;&#x2F;head&gt;

&lt;body&gt;

&lt;script&gt;
var db;
var dbname = &quot;bighonkingtest2&quot;;
var storename = &quot;crap_new&quot;;

imgurl = &quot;baby.jpg&quot;;

function urlTo64(u, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open(&#x27;GET&#x27;, imgurl, true);
  xhr.responseType = &#x27;blob&#x27;;

  xhr.onload = function(e) {
    if (this.status == 200) {
      &#x2F;&#x2F; get binary data as a response
      var blob = this.response;
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function() {
        base64data = reader.result;
        cb(base64data);
      }
    }
  };
  xhr.send();

}

function indexedDBOk() {
	return &quot;indexedDB&quot; in window;
}

document.addEventListener(&quot;DOMContentLoaded&quot;, function() {

	&#x2F;&#x2F;No support? Go in the corner and pout.
	if(!indexedDBOk()) return;

	var openRequest = indexedDB.open(dbname,1);

	openRequest.onupgradeneeded = function(e) {
		var thisDB = e.target.result;

		console.log(&quot;running onupgradeneeded&quot;);

		if(!thisDB.objectStoreNames.contains(storename)) {
			thisDB.createObjectStore(storename, {% raw %}{keyPath:&quot;id&quot;,autoIncrement:true}{% endraw %});
		}

	}

	openRequest.onsuccess = function(e) {
		console.log(&quot;running onsuccess&quot;);

		db = e.target.result;

		console.log(&quot;Current Object Stores&quot;);
		console.dir(db.objectStoreNames);

		&#x2F;&#x2F;Listen for add clicks
		document.querySelector(&quot;#addButton&quot;).addEventListener(&quot;click&quot;, addData, false);
		document.querySelector(&quot;#countButton&quot;).addEventListener(&quot;click&quot;, countData, false);
	}

	openRequest.onerror = function(e) {
		&#x2F;&#x2F;Do something for the error
	}


},false);


function addData(e) {
	console.log(&quot;About to add data&quot;);

  urlTo64(imgurl, function(s) {
  	&#x2F;&#x2F;Get a transaction
  	&#x2F;&#x2F;default for OS list is all, default for type is read
  	var transaction = db.transaction([storename],&quot;readwrite&quot;);

	transaction.oncomplete = function(e) {
		console.log(&quot;transaction onsucc&quot;);
		console.dir(e);
	}

	transaction.onerror = function(e) {
		console.log(&quot;transaction onerr&quot;);
		console.dir(e);
	}

	&#x2F;&#x2F;Ask for the objectStore
  	var store = transaction.objectStore(storename);

  	&#x2F;&#x2F;Define data
  	var data = {
  		img:s
  	}

  	&#x2F;&#x2F;Perform the add
  	var request = store.add(data);

  	request.onerror = function(e) {
  		console.log(&quot;Error&quot;,e.target.error.name);
      console.dir(e);
  		&#x2F;&#x2F;some type of error handler
  	}

  	request.onsuccess = function(e) {
  		console.log(&quot;Woot! Did it&quot;);
  	}
	
  });

}

function countData() {
  	var transaction = db.transaction([storename],&quot;readonly&quot;);
  	var store = transaction.objectStore(storename);
	var req = store.count();
	req.onsuccess = function(e) {
		console.log(req.result + &quot; items.&quot;);
	}
	req.onerror = function(e) {
		console.log(&quot;error getting count&quot;, e);
	}
}
&lt;&#x2F;script&gt;

&lt;button id=&quot;addButton&quot;&gt;Add Data&lt;&#x2F;button&gt;
&lt;button id=&quot;countButton&quot;&gt;Count Data&lt;&#x2F;button&gt;

&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

The first change was to set both the db and objectstore name to variables so I could quickly change them. I then added error/complete handlers to the transaction that handles adding data. Finally, I added a simple "count" method.

To test, I loaded the page up and clicked like crazy. I noticed that at 31 items, the count stopped updating. Here is where things got bad. Before this limit, my transaction complete handler <strong>did</strong> run. After I hit it, the success handler stopped running, <strong>but the onerror method never ran!</strong> 

I modified the objectStore name and confirmed that in a new store, I could still successfully add data (according to the event handlers) but count was stuck at 0. I had to clear my data in IE settings to get it to let me add data again. 

I'll file a bug report for this as soon as I can, but I honestly don't know what to suggest. You could add a timeout call in the add functionality to check for a global variable set in your transaction success. If not set, then it didn't fire and you can assume it failed. That feels quite hackish though.

But hey - this is still better (kinda) than mobile Safari, so, yeah, there's that. ;)