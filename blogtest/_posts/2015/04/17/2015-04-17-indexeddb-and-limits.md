---
layout: post
title: "IndexedDB and Limits"
date: "2015-04-17T15:05:42+06:00"
categories: [development,html5,javascript]
tags: []
banner_image: 
permalink: /2015/04/17/indexeddb-and-limits
guid: 6018
---

Earlier this week I posted about hitting the limits of LocalStorage (<a href="http://www.raymondcamden.com/2015/04/14/blowing-up-localstorage-or-what-happens-when-you-exceed-quota">Blowing up LocalStorage</a>) and today I thought I'd do a bit of testing around IndexedDB. Unfortunately, I don't really have a simple "if you do this, X happens" type story to tell, but I did find out some interesting things about storage limits. I want to thank the following people for help in writing this post: <a href="https://blog.wanderview.com/">Ben Kelly of Mozilla</a>, <a href="http://www.calormen.com/">Joshua Bell of Google</a>,  <a href="http://addyosmani.com/blog/">Addy Osmani</a> of Google</a>, and <a href="http://www.paulirish.com/">Paul Irish of Google</a>.

<!--more-->

So before we begin, let's talk limits. This is what MDN has to say:

<blockquote cite="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API#Storage_limits">
<p>There isn't any limit on a single database item's size, however there is in some cases a limit on each IndexedDB database's total size. This limit (and the way the user interface will assert it) varies from one browser to another:</p>
<ul>
 <li>Firefox has no limit on the IndexedDB database's size. The user interface will just ask permission for storing blobs bigger than 50 MB. This size quota can be customized through the <code>dom.indexedDB.warningQuota</code> preference (which is defined in <a class="external external-icon" href="http://mxr.mozilla.org/mozilla-central/source/modules/libpref/src/init/all.js" title="http://mxr.mozilla.org/mozilla-central/source/modules/libpref/src/init/all.js">http://mxr.mozilla.org/mozilla-central/source/modules/libpref/src/init/all.js</a>).</li>
 <li>Google Chrome: see <a class="external link-https external-icon" href="https://developers.google.com/chrome/whitepapers/storage#temporary" rel="freelink">https://developers.google.com/chrome...rage#temporary</a>.</li>
</ul>
</blockquote>

This is - unfortunately - not quite correct. (But frankly, MDN being as awesome as it is gets a pass for not being perfect.) I mentioned to Ben Kelly that it was a bit weird that Firefox would only prompt for one big insert but be ok with a bunch of small ones. In fact, my test script (more on that below), inserted a 3 meg-ish Base64 image. I ran it about 100+ times or so and never got a prompt. Ben pointed out in this GitHub issue (<a href="https://github.com/w3c/quota-api/issues/2#issuecomment-93793297">Rethink about the storage model</a>) that the prompting for "one big blob" had been removed. 

One thing I'll point out before going further - storage as a general concept for browsers is in a huge state of flux right now. There is chaos. That's a bit frustrating, but it is <i>really good</i> that these conversations are happening now. In my mind this should have happened before Web Audio and Animation crap, but I'm a nerd who likes databases and IDB doesn't demo as well as Unreal in the browser. ;) If you want to see some of the current thinking in regards to storage, see: <a href="https://wiki.whatwg.org/wiki/Storage#API">WhatWG Storage</a>

Ok, so going back to that MDN quote - the link for Chrome is also incorrect. If you follow it, you will see that IndexedDB is described as temporary. Under persistent storage, it even says this:

<blockquote>
Persistent storage is storage that stays in the browser unless the user expunges it. It is available only to apps that use the Files System API, but will eventually be available to other offline APIs like IndexedDB and Application Cache.
</blockquote>

But I got confirmation that this is no longer true. But... it is possible that Chrome may delete your IDB. If space on the host machine is low, then Chrome will clear out an IDB data based on a LRU policy. It will delete the entire local database - it will not trim. And to be clear, we are talking about <i>one</i> IDB database instance, not all of them.

Firefox will also follow a similar procedure. If disk space becomes an issue, it will clear out IDB. 

So given that there isn't a real good way to test quota, I was kinda curious to see what would happen if I abused IDB a bit. I wrote the following script which, on button click, would insert the base64 version of a 3 meg ish image. By the way, this code is pretty bad. I just noticed I convert the image on every click. I should cache the string in RAM while I test. But you get the idea - click a button - insert a bunch of crap.

<pre><code class="language-markup">
&lt;!doctype html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;meta name=&quot;viewport&quot; content=&quot;user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height&quot; /&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;script&gt;
var db;
imgurl = &quot;baby.jpg&quot;;

function urlTo64(u, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', imgurl, true);
  xhr.responseType = 'blob';

  xhr.onload = function(e) {
    if (this.status == 200) {
      // get binary data as a response
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

	//No support? Go in the corner and pout.
	if(!indexedDBOk()) return;

	var openRequest = indexedDB.open(&quot;bighonkingtest&quot;,1);

	openRequest.onupgradeneeded = function(e) {
		var thisDB = e.target.result;

		console.log(&quot;running onupgradeneeded&quot;);

		if(!thisDB.objectStoreNames.contains(&quot;crap&quot;)) {
			thisDB.createObjectStore(&quot;crap&quot;, {% raw %}{keyPath:&quot;id&quot;,autoIncrement:true}{% endraw %});
		}

	}

	openRequest.onsuccess = function(e) {
		console.log(&quot;running onsuccess&quot;);

		db = e.target.result;

		console.log(&quot;Current Object Stores&quot;);
		console.dir(db.objectStoreNames);

		//Listen for add clicks
		document.querySelector(&quot;#addButton&quot;).addEventListener(&quot;click&quot;, addData, false);
	}

	openRequest.onerror = function(e) {
		//Do something for the error
	}


},false);


function addData(e) {
	console.log(&quot;About to add data&quot;);

  urlTo64(imgurl, function(s) {
    console.log(&quot;s size&quot;,s.length);
  	//Get a transaction
  	//default for OS list is all, default for type is read
  	var transaction = db.transaction([&quot;crap&quot;],&quot;readwrite&quot;);
  	//Ask for the objectStore
  	var store = transaction.objectStore(&quot;crap&quot;);

  	//Define data
  	var data = {
  		img:s
  	}

  	//Perform the add
  	var request = store.add(data);

  	request.onerror = function(e) {
  		console.log(&quot;Error&quot;,e.target.error.name);
  		//some type of error handler
  	}

  	request.onsuccess = function(e) {
  		console.log(&quot;Woot! Did it&quot;);
  	}
  });

}
&lt;/script&gt;

&lt;button id=&quot;addButton&quot;&gt;Add Data&lt;/button&gt;

&lt;/body&gt;
&lt;/html&gt;</code></pre>

I did a lot of testing, and by testing, I mean I just clicked like crazy. It took a while, but I finally got an error in Firefox:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/ff1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/ff1.png" alt="ff1" width="1678" height="550" class="alignnone size-full wp-image-6019" /></a>

Ben Kelly and I spoke more on Twitter (like, a few seconds) ago, and he added some more information about Firefox:

1) Yes, it will evict (i.e. kill) an IDB by a LRU (Least Recently Used) policy.
2) The max is dynamic and based on your hard drive.

He had these details to add:
"Heurestic is roughly: all origin combined can take up to 50{% raw %}% available disk space, no one origin more than 20%{% endraw %} available."
"Err... no one origin more than 20{% raw %}% of the total allowed for all origins.  So thats actually 20%{% endraw %}*50{% raw %}%=10%{% endraw %} of available disk."

<a href="http://jonnyknowsbest.co.uk/">Jonathan Smith</a> wrote an interesting little JS snippet you can paste into your console to check the size of an IDB table: <a href="https://github.com/jonnysmith1981/getIndexedDbSize">getIndexedDbSize</a>. 

If I read his results right, I got Firefox up to about 2.8 gigs of storage before it threw that error. My drive maxes out at 500 gigs. So if Firefox can take 10{% raw %}% of that and one origin can take 20%{% endraw %}, then 2.8 feels certainly within the ballpark.

For Chrome, I couldn't get it to throw a QuotaErr, and eventually Smith's test script ended up crashing the tab. It is also possible I just gave up before I hit the upper limit.

I didn't test in Safari because of how horrible they have screwed up IDB. I don't even want to think of it. Opera worked pretty much the same as Chrome.

So - take aways? IDB is still good "persistent" storage in terms of how it has never been 100% perfect persistent storage. A user has always been able to go into dev tools and screw crap up. So knowing the browser itself may nuke it based on storage issues isn't a deal breaker for me. And as I mentioned above - this whole area is in motion and needs to improve. And it will - I have faith.