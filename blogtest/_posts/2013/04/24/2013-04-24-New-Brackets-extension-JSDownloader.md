---
layout: post
title: "New Brackets extension - JSDownloader"
date: "2013-04-24T13:04:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2013/04/24/New-Brackets-extension-JSDownloader
guid: 4918
---

Over the weekend I was working on a small project and needed a copy of jQuery. I try to avoid the CDN as I find myself at airports without wifi access sometimes so I did what I normally do:

<ul>
<li>Go to jQuery.com</li>
<li>Click the download link</li>
<li>Click for the latest minified version</li>
<li>Right click, save as</li>
</ul>
<!--more-->
That's what I always do - but it kinda bugs me. I had heard of a tool called <a href="https://github.com/twitter/bower">Bower</a> that I thought might help. It's a package manager for the web. In theory, it would do what I wanted. I went to the command line, installed it via npm (have I said before how much npm rocks?), and then  fetched a copy of jQuery like so: bower install jquery. 

This worked - and it was epic cool - until I realized how much it grabbed...

<img src="https://static.raymondcamden.com/images/Screenshot_4_24_13_11_28_AM.png" />

Ugh. Don't get me wrong - this was still quicker then my old process. And I "get" the idea behind the metadata involved here and why it would be useful in the future. Bower is pretty damn powerful and I definitely recommend folks take a look at it.

But what if you just want a copy of the library, one time, and that's it? 

I decided to whip up a quick Brackets extension as a proof of concept. Clicking the "Run JSDownloader" menu option opens up a dialog of options:

<img src="https://static.raymondcamden.com/images/Screenshot_4_24_13_11_33_AM.png" />

Clicking the library fires off a process to download it:

<img src="https://static.raymondcamden.com/images/Screenshot_4_24_13_11_35_AM.png" />

And yeah... that's it. Simple, direct, exactly what I need. There's a few caveats though.

Right now it only supports "single file" downloads. I've got basic architecture in there to support a list of files, but it isn't complete. The idea is that if you provide a list of files, it will create a subdirectory based on the name of the library (as in: currentdir/jqueryui/) and then copy the resources there. But this isn't complete yet because...

The second issue is that Brackets still doesn't support binary file writes in extensions. In theory I could do so if I hook up a Node module to my extension, but... honestly it feels like a bit much. I'd rather just wait a bit and hope for support in a future sprint.

Finally, there is no support in Brackets yet for refreshing the project view. So while the extension certainly works, you need to do a reload to see the files show up.

So - where did that last of four projects come from? This is kinda cool I think. In order to "drive" the data list, my extension reads from a simple JSON packet. Here's how it looks now:

<script src="https://gist.github.com/cfjedimaster/5453564.js"></script>

While this file is in the extension itself, my code reads the GitHub version of it instead:

<script src="https://gist.github.com/cfjedimaster/5453567.js"></script>

This means folks could add a new library by just committing to my GitHub repo. I don't have a nice UI to refresh the cache, but if folks end up using and contributing to this extension, I'll add it.

Download/Fork the code here: <a href="https://github.com/cfjedimaster/brackets-jsdownloader">https://github.com/cfjedimaster/brackets-jsdownloader</a>