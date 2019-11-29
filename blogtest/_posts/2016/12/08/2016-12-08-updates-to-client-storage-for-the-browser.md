---
layout: post
title: "Updates to Client Storage for the Browser"
date: "2016-12-08T14:21:00-07:00"
categories: [development]
tags: [javascript]
banner_image: /images/banners/storage1.jpg
permalink: /2016/12/08/updates-to-client-storage-for-the-browser
---

**I made some edits to this post after some feedback from Dru Knox, a Chrome PM. I've marked them with "Edit:", so 
please be sure to note those changes!**

I've been interested in client-side storage for a few years now. (And in fact, last year I wrote a [book](https://www.amazon.com/Client-Side-Data-Storage-Keeping-Local/dp/1491935111/ref=as_sl_pc_qf_sp_asin_til?tag=raymondcamd06-20&linkCode=w00&linkId=URSVDLKI2FLVLMFM&creativeASIN=1491935111) on it as well.) When I first began to dig into the topic, my focus was on the various APIs themselves. In other words, what were the mechanics of actually storing
and retrieving data. What I found is that we had multiple options, some easier than others, but in general, it was pretty cool to have a way 
to store data on the client for both performance and offline support. 
<!--more-->
However... where things began to fall apart, and rather quickly, was on the higher level concept of how this storage was managed on the device itself. Specifically, how
do you know your data will actually persist when you store it and what will the browser do when, and if, it determines you've stored too much. I played around with this
a bit last year:

* [Blowing up LocalStorage (or what happens when you exceed quota)](https://www.raymondcamden.com/2015/04/14/blowing-up-localstorage-or-what-happens-when-you-exceed-quota)
* [IndexedDB and Limits](https://www.raymondcamden.com/2015/04/17/indexeddb-and-limits)

Luckily, as offline and PWAs have become increasingly more important over the past year or so, browser vendors (some more than [others](http://apple.com)) have
stepped up to the plate to help remove some of this ambiguity and make the storage system a bit more solid.

Earlier this week I read a good article on these efforts by Chris Wilson, [Persistent Storage](https://developers.google.com/web/updates/2016/06/persistent-storage). I 
suggest reading that article before continuing on. The basic premise is that there is a new API for what is called a [StorageManager](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager).

The StorageManager, at least for now, consists of three basic parts. The first, and this is the main focus of Wilson's 
article, is the ability 
to specify that data should be *really* persisted. This is the <code>persists</code> API. Yes, that name is a bit weird. 
Basically the idea is this. I can tell the browser to store the value "Cat" in LocalStorage under the key "BestAnimal." 
Currently the browser will store this, but also kick it to the curb when the browser sees fit. Data that 
is *persisted* though will be permanent.  This is cool, but I really take issue with the naming. I get that there is a difference between
"lasts a random amount of time" versus "lasts forever", but even in this it's more "The browser won't nuke it, but the user can", which isn't truly persistent either. But... yeah, naming
is hard, and frankly, I can't think of a better way to describe this either.

Another aspect to keep in mind - both Wilson's article and the MDN docs are a bit vague about what this applies to. The MDN docs for
[this API](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist) have this to say:

<blockquote>
The persist property of the StorageManager interface returns a Promise that resolves to true if the 
user agent is able to persist your site's storage.
</blockquote>

Nice and clear, but "site's storage" could mean:

* Cookies (yes, cookies are storage)
* LocalStorage
* IndexedDB
* WebSQL (yes, I know it is dead, but it is still very well supported, a mere 2% below IDB)
* Oh and that new [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) thing that is for ServiceWorkers that I've not looked at yet.

So what's covered? Everything but cookies and WebSQL. I think that's fair as you shouldn't be using WebSQL anymore (outside of SQLite in Cordova though) and cookies are - well, cookies.

Ok, so you can ask the browser to *really* store your stuff. Kinda. See the API lets you ask for this support, but currently, Chrome won't prompt
the user. Instead, it uses the following rules to see if you are allowed to use this feature:

* The site is bookmarked (and the user has 5 or less bookmarks)
* The site has high site engagement
* The site has been added to home screen
* The site has push notifications enabled

In general this makes sense, but I don't understand why a user can't have more bookmarks (I've got a crap ton) and I also don't
like the requirement that push notifications are enabled. I get enough notifications from apps. I wish apps would stop thinking they are
so important that they deserve the right to bother me at any point in time. Ok, a bit of a rant there. I love the idea of notifications, especially
with support in the web browser, but I wish it was a feature people would use *less* of. It's one of those "With great power..." type things that
people just seem to want to abuse. 

**Edit: To be clear, the list above is a list of options and you only need to satisfy ONE of them!**

That being said, I did some testing (and I'll be sharing some code below), and it looks like you can't test this feature locally. To be clear, 
it doesn't really break anything per se, even when the API tells you no, you can still store data in your various buckets, but if I want to *really*
test this out I'd have to test on mobile. And I guess delete my bookmarks to if I have too many. 

<strike>Notice that the third requirement essentially means this is a non-starter for desktop. Maybe the thinking is that it won't be necessary 
since desktops typically have lots of free space? But I can tell you right now that my iPhone has more free space than my MacBook Pro.</strike> **Edit: Again, I was wrong. :)**

And finally - here's a cool part. You can ask the browser to persist even after you've already stored data. So if you've been using
IDB for a while (first off - congrats!), you can ask for this permission now and it applies to the data you've already stored. Again, assuming you can pass 
the requirement test.

The second part to StorageManager is simply a check to see if your data is Really Persistent. (That's it, that's the name I'm going with!) 
This API is <code>persisted()</code>. Yep, I'm not going to screw up that ever. Honest. 

And the third part, not covered in this article but discussed over at MozDevNet, is the <code>estimate()</code> method. This is a cool one. It returns a quota and usage value. 
Now the quota isn't a hard and fast limit, it's an estimate, but it's still something! 

Support for these features is a bit wonky right now. Chrome supports <code>persist()</code> and <code>persisted()</code> but
not <code>estimate()</code>, even though MozDevNet says it should be supported. Firefox only supports the <code>estimate()</code> method but you must
enable it via a config setting.

So this is all a bit rough... but the important thing to note is that it is a beginning! I think it will go a long way
to making storage, in general, much more robust on the web platform.

Ok, with all that out of the way, I did build up a simple demo. I modified the code Wilson had used in his article and made it a
bit more complete. I was also curious if Chrome Devtools flagged anything different when this feature was enabled, but as I couldn't
test it, I don't know if it does or not. The absence of anything visible now doesn't mean it isn't supported - perhaps they only flag
the data when this feature is enabled. Anyway, here is a full example. 

<pre><code class="language-javascript">
$(document).ready(function() {
	appReady();

	if (navigator.storage &amp;&amp; navigator.storage.persist) {
		&#x2F;&#x2F;First, see if we already have it
		navigator.storage.persisted().then(persistent =&gt; {
			if(persistent) {
				console.log(&#x27;already granted&#x27;);
			} else {
				console.log(&#x27;not already granted, lets ask for it&#x27;);
				navigator.storage.persist().then(granted =&gt; {
					if (granted) {
						console.log(&quot;persisted storage granted ftw&quot;);
					} else {
						console.log(&quot;sad face&quot;);
					}
				});
			}
		});
	}

	&#x2F;&#x2F;what the heck
	if(navigator.storage &amp;&amp; navigator.storage.estimate) {
		navigator.storage.estimate().then(result =&gt; {
			console.log(result);
			console.log(&#x27;Percent used &#x27;+(result.usage&#x2F;result.quota).toFixed(2));
		});
	}
});

function appReady() {
	console.log(&#x27;Lets do it!&#x27;);
	&#x2F;&#x2F;now just store crap
	if(!window.localStorage.getItem(&#x27;count&#x27;)) window.localStorage.setItem(&#x27;count&#x27;, 0);
	let currentCount = Number(window.localStorage.getItem(&#x27;count&#x27;)) + 1;
	console.log(&#x27;Value is &#x27;+currentCount);
	window.localStorage.setItem(&#x27;count&#x27;, currentCount);

}
</code></pre>

Remember that you do not need to wait for these methods to finish, so my code fires up some localStorage Read/Write actions 
without waiting for the calls to ever complete. You can test this here: https://cfjedimaster.github.io/webdemos/misc/persisted_storage/test_ps.html

And the source is here: https://github.com/cfjedimaster/webdemos/tree/master/misc/persisted_storage