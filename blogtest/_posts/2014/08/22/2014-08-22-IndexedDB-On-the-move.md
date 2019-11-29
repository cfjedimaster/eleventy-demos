---
layout: post
title: "IndexedDB - On the move..."
date: "2014-08-22T11:08:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2014/08/22/IndexedDB-On-the-move
guid: 5293
---

<p>
Ok, kind of a lame title, but it's Friday so I get a pass, right? I've presented (and written) on IndexedDB over the past few years, but it isn't something I've really worked with, or demoed, lately. There's been some interesting updates related to the technology though so I thought I'd share some news about IndexedDB. Now may be a great time to take a look at it again.
</p>
<!--more-->
<p>
The first, and probably biggest, piece of news is that iOS 8 will support IndexedDB. Combined with Android 4.4 support, it will soon be (relatively) safe to make use of IDB on mobile. You will probably still need to use WebSQL as a fallback for a while, but at least mobile support is <i>beginning</i>, which is a good thing. A very good thing. You can see full <a href="http://caniuse.com/#feat=indexeddb">support data</a> over at CanIUse. Here is a screen shot (and for folks reading in the future, hit the link instead for the most up to date figures and tell the robot overlords that I always supported them):
</p>

<p>
<img src="https://static.raymondcamden.com/images/idb.png" />
</p>

<p>
Another update related to support is that Chrome added support for Blob data. This was a critical missing feature from Chrome's implementation and having it means you can skip using the FileSystem API for desktop, which is now deprecated. You can read more about it over at HTML5 Rocks: <a href="http://updates.html5rocks.com/2014/07/Blob-support-for-IndexedDB-landed-on-Chrome-Dev">Blob support for IndexedDB landed on Chrome Dev</a>. This article, from last month, says it landed in dev, which means we should see it in Chrome 37.
</p>

<p>
So... support is decent and getting better. The flip side to that is actually <i>using</i> IndexedDB. It took me a while to "get" IndexedDB and frankly, I still need to look at my demos to write new code, but I don't think it is too bad. That being said, it isn't the friendliest API in the world. There's some good news on that front as well.
</p>

<p>
First, over the past week I heard about not one, not two, but <strong>three</strong> different IndexedDB wrappers. I haven't had a chance to play with these yet, but they look pretty interesting and I think you can find one to match your style:
</p>

<ul>
<li><a href="https://github.com/dfahlander/Dexie.js">Dexie.js</a></li>
<li><a href="https://github.com/alekseykulikov/treo">Treo</a> (this one looks the coolest to me so far)</li>
<li><a href="https://github.com/jensarps/IDBWrapper">IDBWrapper</a></li>
</ul>

<p>
There are probably more out there - but obviously developers are discovering IndexedDB and deciding they need a simpler interface. Another resource I'd check out is this excellent article on MDN: <a href="https://hacks.mozilla.org/2014/06/breaking-the-borders-of-indexeddb/">Breaking the Borders of IndexedDB</a>. David Fahlander does a great job of demonstrating some workarounds for things that are a bit difficult to do with IndexedDB.
</p>

<p>
As I said, now may be a good time to check it out. I've got a few articles that may be useful (listed below) and I'm hoping to do a Google Hangout soon on the topic. (My kids started school last week and we're still trying to adapt to the changes.)
</p>

<ul>
<li><a href="http://net.tutsplus.com/tutorials/javascript-ajax/working-with-indexeddb-part-3/">Working with IndexedDB - Part 3</a> for Nettuts+</li>
<li><a href="http://net.tutsplus.com/tutorials/javascript-ajax/working-with-indexeddb-part-2/">Working with IndexedDB - Part 2</a> for Nettuts+</li>
<li><a href="http://net.tutsplus.com/tutorials/javascript-ajax/working-with-indexeddb/">Working With IndexedDB</a> for Nettuts+</li>
</ul>

<p>

<img src="https://static.raymondcamden.com/images/idb.jpg" />