---
layout: post
title: "Cordova Demo - Viewing all Contacts"
date: "2014-12-23T07:51:44+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2014/12/23/cordova-demo-viewing-all-contacts
guid: 5477
---

A quick demo of something I've wanted to see myself for a while now - a user on Stackoverflow asked if it was possible to <a href="http://stackoverflow.com/questions/27468762/retrieve-mobile-all-phone-numbers-or-contacts-using-phonegap">view all the contacts</a> on a device using PhoneGap/Cordova. It is rather trivial to do so. Simply perform a search and skip providing an actual filter. Here is an example.

<!--more-->

<pre><code class="language-javascript">document.addEventListener("deviceready", init, false);
function init() {

	navigator.contacts.find(
		[navigator.contacts.fieldType.displayName],
		gotContacts,
		errorHandler);

}

function errorHandler(e) {
	console.log("errorHandler: "+e);
}

function gotContacts(c) {
	console.log("gotContacts, number of results "+c.length);
	for(var i=0, len=c.length; i&lt;len; i++) {
		console.dir(c[i]);
	}
}</code></pre>

All I've done here is run the <code>find</code> method of the Contacts plugin. You must provide the first argument,  which specifies which fields you will search against, but you do not have to actually provide a search value. Running this code as is will return the entire contact object, but obviously you could, and should, ask for a subset of the contacts if you only care about particular values.

I tested it on my Android phone and it worked really darn fast, despite having 400+ contacts. Here is the result being viewed via <a href="https://www.genuitec.com/products/gapdebug/">GapDebug</a>:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2014/12/GapDebug.png" alt="GapDebug" width="750" height="382" class="alignnone size-full wp-image-5478" />

Not really rocket science, but maybe useful. If you want to copy this code into your own project, you can find it here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/stealcontacts">https://github.com/cfjedimaster/Cordova-Examples/tree/master/stealcontacts</a>.

Ok, I was about to post this as is, but then I thought, let me add something fun. I modified the code slightly to see if a contact photo exists - and if so - append it to the DOM:

<pre><code class="language-javascript">function gotContacts(c) {
	console.log(&quot;gotContacts, number of results &quot;+c.length);
	picDiv = document.querySelector(&quot;#pictures&quot;);
	for(var i=0, len=c.length; i&lt;len; i++) {
		console.dir(c[i]);
		if(c[i].photos &amp;&amp; c[i].photos.length &gt; 0) {
			picDiv.innerHTML += &quot;&lt;img src=&#x27;&quot;+c[i].photos[0].value+&quot;&#x27;&gt;&quot;;
		}
	}
}</code></pre>

A simple little tweak, but with a fun result: <img src="https://static.raymondcamden.com/images/wp-content/uploads/2014/12/device-2014-12-23-074946.png" alt="device-2014-12-23-074946" width="450" height="800" class="alignnone size-full wp-image-5479" />

Enjoy!