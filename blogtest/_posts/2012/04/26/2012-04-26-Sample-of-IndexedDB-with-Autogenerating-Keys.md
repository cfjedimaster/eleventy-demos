---
layout: post
title: "Sample of IndexedDB with Autogenerating Keys"
date: "2012-04-26T11:04:00+06:00"
categories: [development,html5,javascript]
tags: []
banner_image: 
permalink: /2012/04/26/Sample-of-IndexedDB-with-Autogenerating-Keys
guid: 4598
---

I'm still struggling my way through learning IndexedDB. I'm going to post examples as I learn - but as a warning - please consider anything I post as potentially wrong, misleading, and dangerous to the fabric of the universe.

In today's post - I simply wanted to create an objectstore (again, think of a table) with an autogenerating key. The (mostly) incredibly useful <a href="https://developer.mozilla.org/en/IndexedDB/Using_IndexedDB">MDN documentation</a> talks a bit about how you can either provide a key manually or use a key generator. However it doesn't explain how you actually use a key generator. This <i>seems</i> to imply that indexeddb has a way to allow you to write your own logic to create keys. For example, perhaps by combining a few properties, or perhaps by simply counting the existing objects and adding one to it. I'm still not sure if that actually exists. However, there is a simpler way of doing it. 

When you create your object store, you provide a name and a map of options. One option is the keypath, which is basically the property of your data expected to hold a value. The second option is a key called autoIncrement. This defaults to false, but if you set it to true, you get nicely autoincrementing keys. Here's an example by itself:

<script src="https://gist.github.com/2499947.js?file=gistfile1.js"></script>

And here is a complete template. Note it also supports a simple button to add data and then dump it to console. Note that adding data currently barfs on Chrome with:

<b>Uncaught Error: DATA_ERR: DOM IDBDatabase Exception 5</b>

Which according to the <a href="https://developer.mozilla.org/en/IndexedDB/IDBDatabaseException">MDN reference</a> is "Data provided to an operation does not meet requirements." If I had to guess, I'd say maybe Chrome isn't supporting the auto generated key. (Note - I just did a test and confirmed this. Well, I'll be focusing then on Firefox, which seems to be more to spec.) For a complete example, see the code below.

<script src="https://gist.github.com/2499973.js?file=gistfile1.html"></script>