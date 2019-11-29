---
layout: post
title: "Using the Chrome JavaScript Debugger"
date: "2011-11-09T09:11:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/11/09/Using-the-Chrome-JavaScript-Debugger
guid: 4426
---

Folks who regularly read my blog (or follow <a href="http://twitter.com/cfjedimaster">me on Twitter</a>) know that I like to remind people about the built in networking tools in modern browsers. For a while this was Firebug, but now that I'm a Chrome user it's the dev tools. Nine times out of ten the answer to why your Ajax application isn't working can be discovered by just looking at what your network data result was. But what do you do when that fails to help? In this blog entry I'm going to talk about a real problem I encountered last night with one of my Ajax based applications and the tools I used to diagnose and fix the issue.
<!--more-->
<p>

One of my open source projects, <a href="http://lighthousepro.riaforge.org">Lighthouse Pro</a>, is a basic issue tracker written in ColdFusion. To make working with large sets of issues easier, jQuery is used to load in the data one page at a time. Users can filter, sort, search, and paginate all through Ajax requests. To give you a basic idea, here's a quick screen shot:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip218.png" />

<p>

All of those form fields on top allow for different types of filtering and all immediately refresh the issue list. This worked fine (see note below) until a user last night discovered that the list suddenly stopped showing up. My first thought was a network issue, so in my Chrome browser I opened it up and took a look see...

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip219.png" />

<p>

Hmmm, status code 200. That implies no error on the server side. But maybe something funky is going on with the data? 

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip220.png" />

<p>

Nope - nothing odd there. Obviously there was more data then what you see in that screen shot, but I didn't see anything odd in the JSON, nor did I see anything appended to the end or in front that would break the JSON. So what do I do?

<p>

I knew that Chrome contained a debugger that allowed for step debugging. For those who have absolutely no idea what that means, it is basically a way for me to pause JavaScript on the page and slowly step through the code. I can look at variables and try to see what's going wrong. <b>This is huge</b> in case you don't get it. I switched to my scripts tab and selected my main document since I knew the main logic was on the page itself. I scrolled down a bit and saw...

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip222.png" />

<p>

Notice I've got an error handler for my Ajax but it only cares about one type of error - a session timeout. Who wants to bet that I have some <i>other</i> error? If you click on the line #, you can add a breakpoint. That's what I did below:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip223.png" />

<p>

Notice that the breakpoint is now listed in the right hand side as well. Ok, so here is the kick butt part. I reload my browser and immediately see execution stop.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip224.png" />

<p>

Parse error! Ahah. So right away I'm thinking - my JSON string <i>looks</i> nice, but I bet one of those funky, "special" characters is causing me an issue. I switch back to my Network tab - I copy out the response, and head over to a <a href="http://json.parser.online.fr/">slick online JSON parser</a> I found. 

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip225.png" />

<p>

What's cool about this tool is that I can now begin cutting out text, carefully ensuring I keep the JSON structurally valid, and eventually get down to a very small string. I then notice something. As I move my cursor, at one point, it takes two clicks to move. <b>Bam</b> Evil character of death found. But what is it? 

<p>

I know switch over to ColdFusion. I drop the string into a variable and simply iterate over each character so I can find the culprit.

<p>

<code>
&lt;cfloop index="x" from="1" to="#len(badstr)#"&gt;
	&lt;cfset c = mid(badstr, x, 1)&gt;
	&lt;cfoutput&gt;#c#=#asc(c)#&lt;br/&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

<p>

I was looking for some high value, 8000 or so, but instead ran across ascii code 11 - the vertical tab. 

<p>

*sigh*

<p>

So at this point I simply whipped up a quick fix to my JSON encoding, pushed it, and verified it was fine. 

<p>

Anyway - I hope this helps. If you do a quick Google for Chrome debugger you will find many more, deeper articles out there. Mainly I want my readers to <i>know</i> about this option. It saved my butt today.

<p>

p.s. Ok, you can stop reading now if bored. ;) Interestingly enough, Lighthouse Pro has now been the impetus for two really big growths in my Ajax learning. This obviously was very interesting and educational for me. But even more interesting was the story of how I first converted LHP to Ajax. I ran into many issues with performance that - frankly - surprised me. Ajax apps are always supposed to be faster, right? Faster, better, slicker, etc? Turns out that wasn't the case. I made some basic architectural mistakes in my move to Ajax that worked fine in limited testing but not in production. But I'll leave that story for another day...