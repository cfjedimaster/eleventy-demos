---
layout: post
title: "Issues with IndexedDB and Chrome"
date: "2012-06-12T10:06:00+06:00"
categories: [development,html5,javascript]
tags: []
banner_image: 
permalink: /2012/06/12/Issues-with-IndexedDB-and-Chrome
guid: 4647
---

I've been doing some investigation into IndexedDB lately, and one of the issues I ran into was Chrome not following the <a href="http://www.w3.org/TR/IndexedDB/">spec</a> correctly. As a blogger I have the luxury of simply not caring and writing code just for Firefox. But I was writing an article recently and was told it would make sense to try to support Chrome. Here is what I had to do to make my article work in both browsers. Supposedly Chrome will soon support the spec so this won't matter. Till then, I hope this article is helpful for folks.
<!--more-->
Before we get started, let's get the vendor prefix issues out of the way. Here is some code I modified from <a href="https://developer.mozilla.org/en-US/">MDN</a> to simplify my code:

<script src="https://gist.github.com/2917664.js?file=gistfile1.js"></script>

The first thing I ran into involved objectStore creation. According to the spec, you can only create new objectStores when the version changes (you specify a version when you open the IndexedDB). Consider the following code:

<script src="https://gist.github.com/2917602.js?file=gistfile1.txt"></script>

When run in Firefox, it will correctly notice your first time run and run onupgradeneeded. I go the extra step to be <i>really</i> sure and check the objectStoreNames property as well. 

Chrome, unfortunately, doesn't run this at all. Instead, you have to manually set the version and use the success handler for that request. Here is an expanded version of the code that supports both Firefox and Chrome.

<script src="https://gist.github.com/2917615.js?file=gistfile1.js"></script>

You can see where my onsuccess for opening the connection checks the objectStoreNames properties and if necessary, runs setVersion. That returns a request object that I can use in an onsuccess handler in to create my store. Technically I've got a bit of DRY violation going on here with the objectStore definition, but you can get the idea. When Firefox runs this code, it will run onupgradeneeded first (on the initial run) so when it gets to the onsuccess for openRequest the objectStore is already created.

Once that problem was solved, the next issue I ran into was with the static constants I used to open transactions. And here is where living on the bleeding edge is not terribly fun. My initial code worked in Firefox but not in Chrome. I then made it work in both. I then updated Firefox to 13 and it stopped working. I then fixed it up for both. But wait for it - the constants are also going away in the latest spec. So given this code:

<script src="https://gist.github.com/2917697.js?file=gistfile1.js"></script>

We need to change it to...

<script src="https://gist.github.com/2917720.js?file=gistfile1.js"></script>

Woot. Specs are fun! Let me leave you with one last little tip. Need a quick way to get the count of an objectStore? This method will get and return the value to a callback. 

<script src="https://gist.github.com/2917745.js?file=gistfile1.js"></script>