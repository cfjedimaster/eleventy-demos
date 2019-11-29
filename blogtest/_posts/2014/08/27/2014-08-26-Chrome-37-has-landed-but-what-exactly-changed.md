---
layout: post
title: "Chrome 37 has landed - but what exactly changed?"
date: "2014-08-27T08:08:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2014/08/27/Chrome-37-has-landed-but-what-exactly-changed
guid: 5296
---

<p>
This is something of a pet peeve of mine, and something I tend to whine about from time to time, so I will <i>more</i> than understand if you take this opportunity to stop reading and do something more productive than to listen to me complain. Still here? Good. Yesterday Chrome 37 was released. Awesome. So what changed? Let's (try) to find out.
</p>
<!--more-->
<p>
The first thing I'd expect in any application is an easy way to get to the release notes, probably from the menu: Some App / About Some App. For Chrome, the "Chrome / About Google Chrome", takes you to this page:
</p>

<p>
<img src="https://static.raymondcamden.com/images/s121.png" class="bthumb" />
</p>

<p>
Nothing here seems to imply anything informative about the release. The Help link leads to documentation, but nothing specific about 37. (Well, I assume that if 37 added feature X, it is covered here, but as I don't know what X is, I can't confirm that.) At the bottom of the About page (not shown in the screen shot above) is a note about Chrome being based on Chromium. I would <i>not</i> expect that link to provide me anything.  As Chrome is "based on" Chromium, I'd expect the release notes for Chrome to be different, much like how Adobe Edge Code is based on Brackets. Ok, complete dead end there. Let's try Google.
</p>

<p>
The first result for "chrome 37 release notes" takes me here: <a href="http://googlechromereleases.blogspot.com/2014/08/stable-channel-update_26.html">Stable Channel Update</a>. Woot. Hopefully you know that "Stable Channel" is the same as the main release. That's obvious, right? There are three main bullet points on this article:
</p>

<p>
<ul>
<li>DirectWrite support on Windows for improved font rendering</li>
<li>A number of new apps/extension APIs</li>
<li>Lots of under the hood changes for stability and performance</li>
</ul>
</p>

<p>
So, I kind of expect to learn about two main areas of changes: End User changes and Developer changes. End User changes would be things like, "You can type cowbell in the URL bar to find Christopher Walken." It is the type thing that impacts <i>everyone</i>. As someone who uses Chrome every day - all day - I think I know it well but I'm sure there are things I may not know about. From what I can tell, only one big change landed here, and it only impacts Windows. 
</p>

<p>
In terms of Developer changes, I'm thinking about things like - support for &lt;dialog&gt;, which according to HTML5Rocks, was in <a href="http://updates.html5rocks.com/2014/07/dialog-element-shipped-in-Chrome-37-Beta">Chrome 37 beta</a>. To me that's a pretty cool change, but I can see it not being important enough to be listed. So that web page links to <i>all</i> the changes as well. You can find this here: <a href="https://chromium.googlesource.com/chromium/src/+log/36.0.1985.0..37.0.2062.0?pretty=full">https://chromium.googlesource.com/chromium/src/+log/36.0.1985.0..37.0.2062.0?pretty=full</a>.
</p>

<p>
This is a formatted list of SVN changes for the release. As an example, here is the first item.
</p>

<blockquote>
Navigation transitions: Added "addStyleSheetByURL" function to insert stylesheet links. 

If transition-entering-stylesheet is defined in the response headers for the incoming document, they're parsed out, passed to the TransitionPageHelper in the embedder, and are applied to the page via addStyleSheetByUrl at the appropriate time in the transition. 

This is the chrome side of the CL, blink side here: https://codereview.chromium.org/285623003/ 

Design doc: https://docs.google.com/a/chromium.org/document/d/17jg1RRL3RI969cLwbKBIcoGDsPwqaEdBxafGNYGwiY4/edit# 
Implementation details: https://docs.google.com/a/chromium.org/document/d/1kREPtFJaeLoDKwrfmrYTD7DHCdxX1RzFBga2gNY8lyE/edit#heading=h.bng2kpmyvxq5 
BUG=370696

Review URL: https://codereview.chromium.org/309143002

git-svn-id: svn://svn.chromium.org/chrome/trunk/src@278856 0039d316-1c4b-4281-b951-d872f2087c98
</blockquote>

<p>
Yep - no idea. I'm assuming this is an internal change of some sort. For fun, I did a "Save As PDF", and apparently there is 19 pages of this. I'll be honest - I stopped reading. I did, however, do a CTRL+F for dialog. As I said, it was in Chrome 37 Beta, so I bet it landed, right? Nope - no result for dialog.
</p>

<p>
And what about "A number of new apps/extension APIs"? Searching for API returns 14 results - the second one being for Android, which is nice and all but I'm trying to find out what changed for <i>desktop</i> Chrome. 
</p>

<p>
But here is where things get weird. I went to the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog">MDN page for Dialog</a>, copied their sample code, and it worked perfectly in Chrome 37. So it <i>did</i> ship, right? But it isn't documented. Well, that's fair. Google could have decided that it wasn't quite ready for prime time yet. Many companies will do that. 
</p>

<p>
But is that the case here? I honestly don't know. I expect <a href="http://www.html5rocks.com">HTML5Rocks</a> may soon have an article about 37, but unless you know about the site, then how do you find out? How many of my readers know about HTML5Rocks? I'd also have to imagine Google has enough people on staff to get something written in time for release. (Hell, hire me and I'll do it. ;) 
</p>

<p>
For comparison's sake - let's test Firefox.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s217.png" />
</p>

<p>
Ok, useless. Let's try "Help, Firefox Help":
</p>

<p>
<img src="https://static.raymondcamden.com/images/s39.png" />
</p>

<p>
Boom. Ok, a bit small, and not <i>terribly</i> obvious, but there it is - "What's New". This takes you to this page: <a href="https://www.mozilla.org/en-US/firefox/31.0/releasenotes/">https://www.mozilla.org/en-US/firefox/31.0/releasenotes/</a>.
</p>

<p>
This brings you to a <i>wonderfully</i> designed page with labels by each change:
</p>

<p>
<img src="https://static.raymondcamden.com/images/s43.png" />
</p>

<p>
This is perfect. I'd love to see Chrome start doing this. I <i>hope</i> they start doing this.
</p>

<p>
p.s. Have you noticed recently that textarea elements in Chrome will use a green/grey squiggle for grammar issue? This is different than the red squiggle for spelling issues.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s51.png" class="bthumb" />
</p>

<p>
I say green/grey because I swear this morning I saw a light green squiggle, but I can't reproduce it now.
</p>