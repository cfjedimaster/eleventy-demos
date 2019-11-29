---
layout: post
title: "IndexedDB on iOS 8 - Broken Bad"
date: "2014-09-25T10:09:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2014/09/25/IndexedDB-on-iOS-8-Broken-Bad
guid: 5317
---

<div class="status status-success">
Let me begin by saying that credit for this find goes to <a href="http://stackoverflow.com/users/798621/jonnyknowsbest">@jonnyknowsbest</a> on Twitter and his SO post here: <a href="http://stackoverflow.com/questions/26019147/primary-key-issue-on-ios8-implementation-of-indexeddb">Primary Key issue on iOS8 implementation of IndexedDb</a>. I did my research into this issue early this morning and I hope that I, and jonny, are both wrong. I'd <strong>love</strong> to be wrong about this. Unfortunately, I don't think that is the case.
</div>

<p>
So, as you know, iOS 8 finally brought IndexedDB to Mobile Safari. I may be biased, but I find features like this <strong>far</strong> more useful than CSS updates. Not to say that I don't appreciate them, but to me, deep data storage on the client is something that is more practical and useful to more people. Of course, I work for a company that is all about designers and not developers, so what do I know? ;)
</p>
<!--more-->
<p>
Unfortunately, it seems as if Apple may have screwed up their implementation of IndexedDB - and screwed it up bad. Like real bad. If you read the SO post I linked to above, you will see that he was using assigned IDs and discovered that if you assigned the same ID to data in two datastores, then the data inserted in the first objectstore is removed. Let me restate that just to be obvious.
</p>

<p>
Imagine you have two object stores, people and beer. You want to add an object to both, and in both cases, you use a hard coded primary key of 1. When you do, no error is thrown, but the person object is deleted. Only beer remains. (Not the worst result...) Here is a full example showing this bug in action.
</p>

<pre><code class="language-markup">&lt;!doctype html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;meta name=&quot;viewport&quot; content=&quot;user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height&quot; &#x2F;&gt;
&lt;&#x2F;head&gt;
    
&lt;body&gt;

&lt;script&gt;
var db;

function indexedDBOk() {
	return &quot;indexedDB&quot; in window;
}

document.addEventListener(&quot;DOMContentLoaded&quot;, function() {

	&#x2F;&#x2F;No support? Go in the corner and pout.
	if(!indexedDBOk()) return;

	var openRequest = indexedDB.open(&quot;ios8b&quot;,1);

	openRequest.onupgradeneeded = function(e) {
		var thisDB = e.target.result;

		console.log(&quot;running onupgradeneeded&quot;);

		if(!thisDB.objectStoreNames.contains(&quot;people&quot;)) {
			thisDB.createObjectStore(&quot;people&quot;, {% raw %}{keyPath:&quot;id&quot;}{% endraw %});
		}

		if(!thisDB.objectStoreNames.contains(&quot;notes&quot;)) {
			thisDB.createObjectStore(&quot;notes&quot;, {% raw %}{keyPath:&quot;uid&quot;}{% endraw %});
		}

	}

	openRequest.onsuccess = function(e) {
		console.log(&quot;running onsuccess&quot;);

		db = e.target.result;

		console.log(&quot;Current Object Stores&quot;);
		console.dir(db.objectStoreNames);

		&#x2F;&#x2F;Listen for add clicks
		document.querySelector(&quot;#addButton&quot;).addEventListener(&quot;click&quot;, addPerson, false);
	}	

	openRequest.onerror = function(e) {
		&#x2F;&#x2F;Do something for the error
	}


},false);


function addPerson(e) {
	console.log(&quot;About to add person and note&quot;);

	var id = Number(document.querySelector(&quot;#key&quot;).value);
	
	&#x2F;&#x2F;Get a transaction
	&#x2F;&#x2F;default for OS list is all, default for type is read
	var transaction = db.transaction([&quot;people&quot;],&quot;readwrite&quot;);
	&#x2F;&#x2F;Ask for the objectStore
	var store = transaction.objectStore(&quot;people&quot;);

	&#x2F;&#x2F;Define a person
	var person = {
		name:&quot;Ray&quot;,
		created:new Date().toString(),
		id:id
	}

	&#x2F;&#x2F;Perform the add
	var request = store.add(person);

	request.onerror = function(e) {
		console.log(&quot;Error&quot;,e.target.error.name);
		&#x2F;&#x2F;some type of error handler
	}

	request.onsuccess = function(e) {
		console.log(&quot;Woot! Did it&quot;);
	}
	
	&#x2F;&#x2F;Define a note
	var note = {
		note:&quot;note&quot;,
		created:new Date().toString(),
		uid:id
	}

	var transaction2 = db.transaction([&quot;notes&quot;],&quot;readwrite&quot;);
	&#x2F;&#x2F;Ask for the objectStore
	var store2 = transaction2.objectStore(&quot;notes&quot;);

	&#x2F;&#x2F;Perform the add
	var request2 = store2.add(note);

	request2.onerror = function(e) {
		console.log(&quot;Error&quot;,e.target.error.name);
		&#x2F;&#x2F;some type of error handler
	}

	request2.onsuccess = function(e) {
		console.log(&quot;Woot! Did it&quot;);
	}
	
}
&lt;&#x2F;script&gt;

enter key: &lt;input id=&quot;key&quot;&gt;&lt;br&#x2F;&gt;
&lt;button id=&quot;addButton&quot;&gt;Add Data&lt;&#x2F;button&gt;

&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

<p>
This demo uses a simple form to ask you for a PK. When you click the button, it then adds a static person and note object using the value you gave for a PK. When you run this, no error is thrown. The success handler for both operations is run. But the data you created for the person is gone. This is horrible. 
</p>

<p>
But wait! Who uses defined primary keys? Only nerds! I like auto incrementing keys, so why not just switch to that? Simple enough, right? I made a new demo, with a new database, and modified my objectstores:
</p>

<pre><code class="language-javascript">		if(!thisDB.objectStoreNames.contains(&quot;people&quot;)) {
			thisDB.createObjectStore(&quot;people&quot;, {% raw %}{autoIncrement:true}{% endraw %});
		}

		if(!thisDB.objectStoreNames.contains(&quot;notes&quot;)) {
			thisDB.createObjectStore(&quot;notes&quot;, {% raw %}{autoIncrement:true}{% endraw %});
		}
</code></pre>

<p>
<strong>And the same damn error occurs.</strong> I kid you not. Ok, fine iOS. So I then tried something else. According to the <a href="http://www.w3.org/TR/IndexedDB/">spec</a>, you can create a transaction with multiple objectstores. I thought, maybe if I did that, iOS would handle the inserts better. So let's try this:
</p>

<pre><code class="language-javascript">var transaction = db.transaction([&quot;people&quot;,&quot;notes&quot;],&quot;readwrite&quot;);</code></pre>

<p>
But this threw an error:  DOM IDBDatabase Exception 8: An operation failed because the requested database object could not be found.
</p>

<p>
Ok, so next I thought - what if we used autoIncrement and different key names. Maybe the key name being the same was confusing things:
</p>

<pre><code class="language-javascript">		if(!thisDB.objectStoreNames.contains(&quot;people&quot;)) {
			thisDB.createObjectStore(&quot;people&quot;, {% raw %}{autoIncrement:true,keyPath:&quot;appleisshit&quot;}{% endraw %});
		}

		if(!thisDB.objectStoreNames.contains(&quot;notes&quot;)) {
			thisDB.createObjectStore(&quot;notes&quot;, {% raw %}{autoIncrement:true,keyPath:&quot;id&quot;}{% endraw %});
		}
</code></pre>

<p>
Nope, same error. So... finally I gave up. I specified an ID number and prefixed it with a string. 
</p>

<pre><code class="language-javascript">
function addPerson(e) {
	console.log(&quot;About to add person and note&quot;);

	var id = document.querySelector(&quot;#key&quot;).value;
	
	&#x2F;&#x2F;Get a transaction
	&#x2F;&#x2F;default for OS list is all, default for type is read
	var transaction = db.transaction([&quot;people&quot;],&quot;readwrite&quot;);
	&#x2F;&#x2F;Ask for the objectStore
	var store = transaction.objectStore(&quot;people&quot;);

	&#x2F;&#x2F;Define a person
	var person = {
		name:&quot;Ray&quot;,
		created:new Date().toString(),
		id:&quot;people&#x2F;&quot;+id
	}

	&#x2F;&#x2F;Perform the add
	var request = store.add(person);

	request.onerror = function(e) {
		console.log(&quot;Error&quot;,e.target.error.name);
		&#x2F;&#x2F;some type of error handler
	}

	request.onsuccess = function(e) {
		console.log(&quot;Woot! Did it&quot;);
	}
	
	&#x2F;&#x2F;Define a note
	var note = {
		note:&quot;note&quot;,
		created:new Date().toString(),
		uid:&quot;notes&#x2F;&quot;+id
	}

	var transaction2 = db.transaction([&quot;notes&quot;],&quot;readwrite&quot;);
	&#x2F;&#x2F;Ask for the objectStore
	var store2 = transaction2.objectStore(&quot;notes&quot;);

	&#x2F;&#x2F;Perform the add
	var request2 = store2.add(note);

	request2.onerror = function(e) {
		console.log(&quot;Error&quot;,e.target.error.name);
		&#x2F;&#x2F;some type of error handler
	}

	request2.onsuccess = function(e) {
		console.log(&quot;Woot! Did it&quot;);
	}
	
}</code></pre>

<p>
This worked. Of course, you still have the suck part of creating your own keys. You can, however, ask the objectstore for the size and simply increment yourself. I wrote up a new version that does this. This seems to work well and for now is what I'd recommend. It works fine in Chrome too so it isn't "harmful" to use this workaround. 
</p>

<pre><code class="language-markup">&lt;!doctype html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;meta name=&quot;viewport&quot; content=&quot;user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height&quot; &#x2F;&gt;
&lt;&#x2F;head&gt;
    
&lt;body&gt;

&lt;script&gt;
var db;

function indexedDBOk() {
	return &quot;indexedDB&quot; in window;
}

document.addEventListener(&quot;DOMContentLoaded&quot;, function() {

	&#x2F;&#x2F;No support? Go in the corner and pout.
	if(!indexedDBOk()) return;

	var openRequest = indexedDB.open(&quot;ios8_final3&quot;,1);

	openRequest.onupgradeneeded = function(e) {
		var thisDB = e.target.result;

		console.log(&quot;running onupgradeneeded&quot;);

		if(!thisDB.objectStoreNames.contains(&quot;people&quot;)) {
			thisDB.createObjectStore(&quot;people&quot;, {% raw %}{keyPath:&quot;id&quot;}{% endraw %});
		}

		if(!thisDB.objectStoreNames.contains(&quot;notes&quot;)) {
			thisDB.createObjectStore(&quot;notes&quot;, {% raw %}{keyPath:&quot;uid&quot;}{% endraw %});
		}

	}

	openRequest.onsuccess = function(e) {
		console.log(&quot;running onsuccess&quot;);

		db = e.target.result;

		console.log(&quot;Current Object Stores&quot;);
		console.dir(db.objectStoreNames);

		&#x2F;&#x2F;Listen for add clicks
		document.querySelector(&quot;#addButton&quot;).addEventListener(&quot;click&quot;, addPerson, false);
	}	

	openRequest.onerror = function(e) {
		&#x2F;&#x2F;Do something for the error
	}


},false);


function addPerson(e) {
	console.log(&quot;About to add person and note&quot;);


	&#x2F;&#x2F;Define a person
	var person = {
		name:&quot;Ray&quot;,
		created:new Date().toString(),
	}
	
	&#x2F;&#x2F;Perform the add
	db.transaction([&quot;people&quot;],&quot;readwrite&quot;).objectStore(&quot;people&quot;).count().onsuccess = function(event) {
		var total = event.target.result;
		console.log(total);
		person.id = &quot;person&#x2F;&quot; + (total+1);
		
		var request = db.transaction([&quot;people&quot;],&quot;readwrite&quot;).objectStore(&quot;people&quot;).add(person);
		
		request.onerror = function(e) {
			console.log(&quot;Error&quot;,e.target.error.name);
			&#x2F;&#x2F;some type of error handler
		}

		request.onsuccess = function(e) {
			console.log(&quot;Woot! Did it&quot;);
		}

	}

	&#x2F;&#x2F;Define a note
	var note = {
		note:&quot;note&quot;,
		created:new Date().toString(),
	}

	db.transaction([&quot;notes&quot;],&quot;readwrite&quot;).objectStore(&quot;notes&quot;).count().onsuccess = function(event) {
		var total = event.target.result;
		console.log(total);
		note.uid = &quot;notes&#x2F;&quot; + (total+1);
		
		var request = db.transaction([&quot;notes&quot;],&quot;readwrite&quot;).objectStore(&quot;notes&quot;).add(note);
		
		request.onerror = function(e) {
			console.log(&quot;Error&quot;,e.target.error.name);
			&#x2F;&#x2F;some type of error handler
		}

		request.onsuccess = function(e) {
			console.log(&quot;Woot! Did it&quot;);
		}

	}
	
}
&lt;&#x2F;script&gt;

&lt;button id=&quot;addButton&quot;&gt;Add Data&lt;&#x2F;button&gt;

&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

<p>
I hope this helps folks. As I said, maybe I'm being stupid and missing something obvious. I hope so. But considering that iOS 8 also broke file uploads (both "regular" and via XHR2), it isn't too surprising that this could be broken as well. I'm going to file a bug report now. If their reporting system supports sharing the URL, I'll do so in a comment.
</p>