---
layout: post
title: "Ask a Jedi: ColdFusion 8 Ajax Features and JavaScript Detection"
date: "2008-03-13T17:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/03/13/Ask-a-Jedi-ColdFusion-8-Ajax-Features-and-JavaScript-Detection
guid: 2706
---

Justin asks:

<blockquote>
<p>
CF8 brought us some pretty rad RAD tools for quick and
dirty AJAX and SPRY stuff. However, they did not provide a quick and dirty browser detection method to go along with it. I'm using ugly stuff that isn't so rad or RAD to handle this.

Is there something out there we can include in any necessary page that would direct users to an informational page regarding their unsupported browser? The last customer actually had IE7, but their shop has always used Netscape 7. Unfortunately, CFDIV did not like it, but the user had
no idea that entire section of information was invisible.

If I were going to program this, what would be the best CF8 way to go about it? A CFC stored in the application scope? Perhaps checkUserAgent() function with a couple of options
for the browser requirements? The same CFC could probably have robot checking as well. Naturally, it shouldn't be used for security, but something is definitely needed.

Once someone does this, it should definitely be dropped on RIAForge as I consider all the new CF 8 SPRY tags to be completely useless for Internet sites without browser detection, intranet is just fine. 
</p>
</blockquote>

So first off - I'm not aware of any ColdFusion-based browser detector. I'm sure some exist. I know I wrote code in that area around 7-8 years ago. It can be done - but it tends to be kind of a pain in the rear. I've also used <a href="http://www.cyscape.com/Default.aspx?bhcp=1">BrowserHawk</a> in the past. This is a third party tool that provides checks for just about everything.

Secondly - browser detection isn't trivial. I don't think its fair at all to call all the cool new Ajax stuff useless. (Note that CF8's Spry integration is just one small part.) Not every organization needs serious browser detection. I rarely see it myself anymore. I <i>do</i> often see "You need X and Y", which I think is fair and - lets face it - a heck of a lot easier then multiple browser detector tests. That's almost like saying ColdFusion's charting features are useless because some people don't have Flash (all 3 of them - they live next door). 

You could try a few simple tricks - for example, this code will show a message to folks with JavaScript turned off:

<code>
&lt;cfdiv bind="url:test3.cfm"&gt;
No JavaScript? You Suck!
&lt;/cfdiv&gt;
</code>

If they have JavaScript turned on, the contents of test3.cfm load. It's a rather trivial trick, but it at least can check for JavaScript access. Once past that your best best is to feature detection, not browser detection. So for example:

<code>
if(document.images)
</code>

Checking for document.images is much simpler than checking a user agent and version, and it accomplishes what you want ("Does the browser support using JavaScript to load images?")

As always - I'm curious as to what others out there are using. Is it just me or are 'browser detector pages' going away?