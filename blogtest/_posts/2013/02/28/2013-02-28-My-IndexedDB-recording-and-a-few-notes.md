---
layout: post
title: "My IndexedDB recording, and a few notes"
date: "2013-02-28T14:02:00+06:00"
categories: [development,html5,javascript]
tags: []
banner_image: 
permalink: /2013/02/28/My-IndexedDB-recording-and-a-few-notes
guid: 4869
---

Here is the recording URL for the presentation I just gave on IndexedDB: <a href="http://experts.adobeconnect.com/p30v2nmantc/">http://experts.adobeconnect.com/p30v2nmantc/</a>

You can find the full source code for the demos and slide deck here: <a href="https://github.com/cfjedimaster/indexeddb-preso">https://github.com/cfjedimaster/indexeddb-preso</a>

Now for some random notes:

I plan on writing up this presentation as an article (not sure for whom yet, maybe Smashing Mag). But basically, I'm going to turn the presentation and demo assets into a guide that can be downloaded, read offline in the bathroom, etc. 

Secondly, one topic I didn't go into, but bit me in the butt today, was the transaction object's "oncomplete" handler. This comes into play when doing something like this:

Add some crap.
Run a method to get all crap so I can see it listed.

I've had a "Note Database" demo in my presentation for a while now and it worked fine... until today. When I presented it today (and you can see my surprise in the recording), I noticed that my add/edit/delete operations were not updating the list of notes. Why? Because I was asking the system to refresh the notes in the success handler of the <b>request</b> (where the request was either add/edit/delete). Instead, I needed to wait for the transaction to end as a whole. 

As an example of this mistake, here is my original code for delete:

<script src="https://gist.github.com/cfjedimaster/5059335.js"></script>

Notice that displayNotes() is in the request success handler. Here is the corrected version.

<script src="https://gist.github.com/cfjedimaster/5059346.js"></script>

I've broken up my chained calls there a bit so I get access to the transaction and add the oncomplete there.

Previously this wasn't required in Chrome, so I'm assuming something has changed, but to be honest, this feels like the right way of doing things anyway.