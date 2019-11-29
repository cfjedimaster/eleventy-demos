---
layout: post
title: "What tags does your browser support? (2012)"
date: "2012-08-06T14:08:00+06:00"
categories: [development,html5,javascript]
tags: []
banner_image: 
permalink: /2012/08/06/What-tags-does-your-browser-support-2012
guid: 4696
---

A year ago I <a href="http://www.raymondcamden.com/index.cfm/2011/2/17/What-tags-does-your-browser-support">posted</a> a blog entry detailing my search to find documentation on what HTML (and related web specs) are supported in browsers. There are plenty of good HTML resources out there, but I had not ever looked at what the browser makers themselves came up with in terms of documentation. I've updated the text of that blog entry and posted it below. Most likely I'll post another update in 2013 as well. Enjoy - and as always - comments and suggestions for improvement are welcome.
<!--more-->
It seems like a simple enough question, right? If you are developing a web site and want to know the specifics of language support for a particular HTML tag, there should be a way to find out <b>exactly</b> what your browser supports. A few days ago I was thinking about this (at around 5AM actually - no idea why I was up that early) and decided to actually <i>test</i> this theory and see how easy this was in practice. This is especially important with the rise of HTML5. (It's got a logo now so we can start using it.)  I've read numerous blog posts about sexy cool new HTML5 features and they typically do an ok job of saying what's supported where, but I figured that I should be able to bookmark a nice reference and always be able to quickly check an "official" guide for the final word. To be clear - I know there are other web sites out there offering HTML reference information. But I feel that the browser makers should be stepping up to the plate to make it easier for their developers.

I began with a few simple Google searches. Something like "firefox html reference" or "chrome supported html guide." This is where I ran into my first big surprise. I rather quickly found documentation for Firefox, IE, and Safari. But I was unable to find a result for Google Chrome. Maybe it was just how I searched, but I just couldn't find anything. Google has a <a href="http://www.google.com/support/forum/p/Chrome/label?lid=5e916dca4598a98a&hl=en">Chrome Webmasters</a> forum, but <a href="http://www.google.com/support/forum/p/Chrome/thread?tid=3c82f941aeb7296e&hl=en">my post</a> asking about their support reference has so far gone unanswered. I did eventually find their reference, but for me it was very non-obvious. 

<h2>Firefox</h2>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip22.png" align="left" style="margin-right: 5px" /> The first guide I found was for Firefox: <a href="https://developer.mozilla.org/en/HTML/Element">HTML Element Reference</a>. I began by checking the docs for something as simple as the <a href="https://developer.mozilla.org/en/HTML/Element/b">b</a> tag. Mozilla's guide does a nice job explaining how it's different from strong. It also has a nice format that's easy to read and understand. I then looked for the layer tag. Surprisingly it wasn't there. I knew it was deprecated, and their guide mentions other deprecated tags, but layer was absent. I suppose it's not only deprecated now but removed. (Good.) I then checked the <a href="https://developer.mozilla.org/en/HTML/Element/canvas">canvas</a> tag. The guide not only flags it as HTML5 but also says when it was introduced. I had no idea it was in Firefox 1.5. That was like a billion years ago. But that type of information is great. 
<br clear="left">

<h2>Safari</h2>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip23.png" align="left" style="margin-right: 5px" /> No surprise that Apple has a nicely designed site for their reference: <a href="http://developer.apple.com/library/safari/#documentation/AppleApplications/Reference/SafariHTMLRef/Introduction.html">Safari HTML Reference</a>. I repeated my tests for Firefox. The guide for "b" did not go into detail about how it compares to strong, but I noticed that their availability section covers both the desktop as well as the mobile browser. That's a huge +1 for them. Obviously it isn't fair to say that Firefox is missing that - but I'm just happy Apple went to the trouble of documenting this for their mobile browser. Surprisingly Safari <i>did</i> have docs for <a href="http://developer.apple.com/library/safari/#documentation/AppleApplications/Reference/SafariHTMLRef/Articles/HTMLTags.html#//apple_ref/doc/uid/30001262-layer">layer</a>. They don't consider it deprecated but do recommend using an iframe instead.
<br clear="left">

<h2>Internet Explorer</h2>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip24.png" align="left" style="margin-right: 5px" /> For those of you who have to worry about IE (I'm so sorry), you will find the reference on MSDN: <a href="http://msdn.microsoft.com/en-us/library/ms533050(v=vs.85).aspx">HTML and DHTML Reference</a>. I was a bit surprised to see "DHTML" in the title as I thought that was old school. Oddly they also refer to HTML tags as "Objects". Clicking on the <a href="http://msdn.microsoft.com/en-us/library/ms535189(v=VS.85).aspx">reference for b</a> gives an <b>extreme</b> amount of information right away. They explicitly list all the attributes to the point where it's almost too much information. But I suppose it's better to err on the side of giving you enough documentation to get your job done. I was surprised to see <a href="http://msdn.microsoft.com/en-us/library/ms535851(v=VS.85).aspx">Marquee</a> still documented, but at least Microsoft admits to it being an extension and non-standard. For the <a href="http://msdn.microsoft.com/en-us/library/ff975073(v=VS.85).aspx">video</a> tag Microsoft uses an IE9 logo on top, but to me, that isn't quite clear enough. It's something that a non-careful reader could glance over if not paying attention. That being said, the doc makes it clear it's in draft status which is nice.
<br clear="left">

<h2>Chrome</h2>

Previously I pointed people to a wiki that documented Chrome and its HTML support. That wiki is no longer available (or no longer available at that URL). I raised the question on <a href="http://www.html5rocks.com">HTML5 Rocks</a> and Googler Eric Bidelman pointed out that <a href="http://developer.mozilla.org">MDN</a> also details Chrome support as well. This is not 100% up to date, but the goal is to get it there. To me, that's great news as MDN is an incredibly good resource anyway.

Also - check out <a href="http://www.chromestatus.com">ChromeStatus.com</a>, a quick 'readme' style guide to the current status of various bleeding edge APIs like CSS3 Regions and the GamePad API.

<h2>Opera</h2>

<img src="https://static.raymondcamden.com/images/screenshot17.png" align="left" />
I mistakenly did not include Opera in my last blog post. Thilo Hermann pointed this out and shared that information. <a href="http://www.opera.com/docs/specs/">Web Specifications support in Opera</a> covers HTML support by version of Opera and also goes into detail about user agent strings. Documentation includes pretty much everything (HTML, JavaScript, CSS) and displays support information in a ginormous table.

<br clear="left">

So obviously an HTML reference is only a small part of the puzzle. You also have CSS and JavaScript to consider as well. But it was an interesting exercise to see how the "big guys" handle this form of support for their developers. I'll admit to being a bit picky about my docs. If my browser doesn't help me - or if it gets in the way - I'll immediately get a bit ticked. Obviously web developers are a minority in terms of all the people who actually use a web browser. But I really feel like a browser vendor who looks out for - and helps - their developers will be able to gain market share and acceptance in the developer community.