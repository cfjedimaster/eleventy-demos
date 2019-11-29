---
layout: post
title: "First release of ColdFire for Chrome"
date: "2012-08-24T16:08:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2012/08/24/First-release-of-ColdFire-for-Chrome
guid: 4714
---

Over the past month or so I've been working on a Chrome extension that makes use of dev tools. My goal was to learn more about building Chrome extensions in general. My plan of attack was a Chrome port of <a href="http://coldfire.riaforge.org">ColdFire</a>.
<!--more-->
For my readers who don't use ColdFusion, ColdFire is a Firebug extension that takes ColdFusion debug information and renders it in a Firebug template. ColdFusion does a pretty darn good job of sharing request-level debug information. This is great for times when your pages are slow and you need help tracking down why it's slow. For example, maybe in a typical request you've got 5 API calls to components and 10 database queries among them. 

Now imagine the request is taking 10 seconds. That's an insane amount of time for a web page to load. But given all the activity, how do you track down what process is taking the longest?

By using the debug data, one could discover, perhaps, that it's one particular query that is borked. One query taking 99% of the total time. Data like that is invaluable. 

Normally this debug information is crapped at the bottom of the page. Firebug and ColdFire make it prettier. Here's an example from the Firebug version:

<img src="https://static.raymondcamden.com/images/ScreenClip111.png" />

I had previously written a basic extension to create a panel (see <a href="http://www.raymondcamden.com/index.cfm/2012/7/15/How-to-add-a-panel-to-Chrome-Dev-Tools">this blog entry</a>) and then some code to actually update the panel (see <a href="http://www.raymondcamden.com/index.cfm/2012/8/3/How-to-update-the-DOM-in-a-Chrome-Extension-Panel">this blog entry</a>). Now I needed to actually take the debug data returned by the server and render it the Chrome DevTools panel.

I had assumed this would be simple. I grabbed a copy of <a href="http://handlebarsjs.com/">Handlebars</a> and began creating a basic template. But right away I ran into an issue. As soon as I tried to compile my template, I got a security error. Some quick Googling turned up this Chromium bug report: <a href="http://code.google.com/p/chromium/issues/detail?id=107538">extensions doen't load for some valid CSP schemes</a>

There's a lot to that bug report, but the summary is that anything using eval() is going to be prohibited in extension code, unless you want to use an iFrame. (Anyone who has done Adobe AIR for HTML will remember this.) While the official docs recommend using an iFrame (see <a href="http://developer.chrome.com/trunk/extensions/sandboxingEval.html">this reference</a>), I went an easier route. A fellow named Matthew Robertson <a href="http://matthewrobertson.org/blog/2012/07/10/javascript-templates-and-chromes-content-security-policy/">blogged</a> on this very topic and recommended making use of Handler's precompiled templates. Essentially, this is a way to write your templates, compile them with Node, and include a new JavaScript file into your project. 

This worked fine, except to note that I was not able to use *.handlebars at the command line. Instead, I used this syntax: handlerbars file1.handlebars file2.handlebars file3.handlebars -f ../template.js

At that point, it was pretty easy to continue. I've blogged before about how it can be difficult to debug Chrome extensions. For the most part, you can't just save a file and reload one file. I had to close two devtools instances, reload the extension, reload my test page, open up devtools, and then open up <i>another</i> devtools extension as well. After a few hours of this though I got pretty quick. (I've got a bad headache though so consider that as well.)

For folks who want to try this out, you can download the bits at the end of this post. Note that it requires the main ColdFire cfm handler template to work. For folks who could care two bits about ColdFusion, I'd still love any feedback on the extension in general. Currently "General", "Execution Times", and "DB Queries" are working. 

Hey - how about some screen shots? Sure, why not. Here is the General tab:

<img src="https://static.raymondcamden.com/images/ScreenClip112.png" />

And here is Exec Times - make note of the total times at the bottom. It calls out how much of an impact the database had on the request as well as component calls. 

<img src="https://static.raymondcamden.com/images/ScreenClip113.png" />

And then finally - the db queries. Note the horrible SQL I wrote to create a cross join. Oddly it still ran incredibly fast.

<img src="https://static.raymondcamden.com/images/ScreenClip114.png" /><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2012%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fcoldfire%{% endraw %}2Ezip'>Download attached file.</a></p>