---
layout: post
title: "Proof of Concept - Build a download feature for IndexedDB"
date: "2012-08-23T13:08:00+06:00"
categories: [html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2012/08/23/Proof-of-Concept-Build-a-download-feature-for-IndexedDB
guid: 4712
---

Before I begin, a quick editorial note. I almost didn't write this blog entry. After working on the code and getting everything working right, things quickly went to crap when I switched from Mac to Windows. I had odd results in Firefox as well. Overall, I feel that the solution I've come up with here is solid, but the current browser implementations are... less than ideal. So, please keep that in mind. Perhaps you are reading this a year from now while cruising around on your jetpack and the browsers have settled down in terms of their IndexedDB support. Perhaps. Until then, please consider that what follows is going to be less than perfect in your browser.
<!--more-->
<a href="http://www.w3.org/TR/IndexedDB/">IndexedDB</a> is a nice way to store massive amounts of data on the user's machine. This allows for personal storage of - well - just about anything. Browsers are still working on their implementation, and the feature can be a bit... tricky (see my earlier posts), but overall it can be an incredibly powerful feature.

I was thinking that it might be interesting to build a way to export and save data from an IndexedDB datasource. Why bother when the data is local? I don't know. Maybe as a way to save a 'version' to a USB stick. Maybe as a way to upload later to another machine. To be honest, I just wanted to build it and see what it took. 

Thinking about the process, I broke it down to a few steps.

First - we need to get all the data from our datasource. IndexedDB has a simple way to iterate over an objectstore (think table). What isn't so easy though is handling the fact that this is an async operation. If you have more than one objectstore you have to wait until all are done. 

Second - once you have all the data, you need to serialize it. Luckily we can rely on the browser's native JSON support to quickly convert it.

The third and final step is to stream it to the user. Fellow Adobian Christian Cantrell has a good <a href="http://blogs.adobe.com/cantrell/archives/2012/01/how-to-download-data-as-a-file-from-javascript.html">blog entry</a> on saving JavaScript data. But I used a modified version that made use of HTML5's new "download" attribute for anchors. 

Simple enough? I decided to begin with an earlier application I wrote that allowed for simple Note creation. If you've got a recent Firefox installed, you can play with it right now:

<a href="https://static.raymondcamden.com/demos/2012/aug/23/test.html">https://static.raymondcamden.com/demos/2012/aug/23/test.html</a>

This will not work in Chrome... sometimes... due to the issue I reported <a href="https://www.raymondcamden.com/2012/06/12/Issues-with-IndexedDB-and-Chrome">here</a>. Oddly - Google Canary, on <b>Mac</b> only, seems to work now - perfectly. That's the main browser I used for testing. But the <b>exact</b> same Canary on Windows did not work. Confusing - I know. 

Even if you aren't using a browser that will handle the demo, I encourage you to hit the page and view source. I'm going to be sharing lots of snippets as we go on.

To make the application a bit more complex I added a new objectstore called log. This is defined here:

<script src="https://gist.github.com/3438351.js?file=gistfile1.js"></script>

This objectstore will simply contain log messages. I modified my code so that when I created and deleted notes it would simply log the actions. To simplify this I wrapped the logic into a nice utility function:

<script src="https://gist.github.com/3438381.js?file=gistfile1.js"></script>

The end result is that my application is using two objectstores. One main "note" objectstore for the actual content and one called "log" which isn't actually shown to the user. 

I began the process of adding export support by adding a nice button to the top right of the application. Clicking this button begins the process I defined above.  As I mentioned, the first step was to actually get all the data. Because this is involves N asynchronous  processes, I decided to make use of jQuery Deferreds. jQuery Deferreds are black magic to me still. I have the hardest time wrapping my head around them but I was able to get something working. I'm betting there are nicer ways of doing this and I hope my readers can share some tips. Basically though I loop through each objectstore in the database (and note this code is entirely abstract - it should work for any IndexedDB instance) and create a new Deferred to handle the data collection for an individual objectstore. When done looping over the data, I resolve the deferred by returning an array of objects. Finally, $.when is used to collect all of this. 

<script src="https://gist.github.com/3438481.js?file=gistfile1.js"></script>

Let's talk about the last few lines above. You can see where I stringify the entire data set in one line. That's damn convenient. Any browser that supports IndexedDB will support the JSON object so it's a no brainer to use. 

Sending the data to the user was also pretty simple. You can see where I - initially - made use of the "Cantrell Solution" (yes, I'm using that term because it sounds cool ;). While this worked, it didn't allow for a file name. 

To get around this, I added an empty link to my DOM. That may not be necessary, I could have just made one in JavaScript, but it was quick and worked. If you view source you will see this in the layout: &lt;a id="exportLink" download="data.json"&gt;&lt;/a&gt;

Again - I feel kinda bad just dropping this into the page like that. I'd probably do it  entirely virtually in the future. But note the download attribute. That's all it takes to 'suggest' a filename for downloading. That's it! So given that I had a jQuery hook to the link already, I simply set the HREF equal to my serialized data. 

I initially tried to trigger a click, but for some reason, this didn't work correctly. Luckily I found a <a href="http://stackoverflow.com/a/1421968/52160">solution</a> on StackOverflow - the fakeClick function. You can see it yourself if you view source.

Unfortunately, Firefox does not quite work right with the download attribute. It should be coming soon, but for me, it never worked right. That means to truly test this demo, the only browser I know of that can do it all is Google Canary on OS X. Hopefully that will change soon.

So - despite all the buts and warnings above - I hope this is an interesting demonstration for my readers. As always, I'd love to hear your feedback on how this could be improved.