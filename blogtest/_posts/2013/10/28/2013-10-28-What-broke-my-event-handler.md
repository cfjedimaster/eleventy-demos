---
layout: post
title: "What broke my event handler?"
date: "2013-10-28T17:10:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2013/10/28/What-broke-my-event-handler
guid: 5071
---

<p>
Just a quick tip here (and thanks to multiple folks on Twitter for guiding me to this) that I hope is helpful. I'm working on a web page that is pretty complex and has a series of scripts that are being loaded that I have no (direct) control over. My task was rather simple - given a link of a certain class - make note of the click event and do something before allowing the link to carry on as normal. This worked fine until this week. This is how I diagnosed the issue.
</p>
<!--more-->
<p>
The first thing I did was inspect the element. Here is a screen shot from my own blog. I assume most folks know about this already so I won't detail it too much. I can say that this is a tool I used to ignore because I figured it wasn't terribly helpful. I know my HTML. But then I discovered it was useful in showing you the "live" state (probably not the best term) of your DOM. By that I mean if you have scripts modifying the DOM, then Inspect Element is showing you the latest version - not the original HTML loaded from the server.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2013-10-28 at 3.36.47 PM.png" />
</p>

<p>
As soon as I did this - I discovered an onclick event in the link. This wasn't in the source HTML and must have been added by some other script. But how would I figure that out? Turns out you can right click on an element and do a Break On action:
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2013-10-28 at 3.37.07 PM.png" />
</p>

<p>
Cool. I selected "Attributes Modifications". At this point, Chrome will try to make the most precise break point it can. In my testing just now on my blog (for my screen shots), it used "a" as a breakpoint on a simple link. But when I tried it again on a link with a class, it was more specific:
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2013-10-28 at 3.48.27 PM.png" />
</p>

<p>
Boom. So, I reran my page, and bingo, it showed up right away. Unfortunately, the code was minimized and the tab was a bit unclear:
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2013-10-28 at 3.50.03 PM.png" />
</p>

<p>
Honestly, I wasn't sure what to do at this point outside of looking at <strong>all</strong> the scripts and doing a CTRL+F, but I just clicked "Step into next function" a few times and eventually it opened up the actual file. I'm not sure why it didn't do so originally, but, it worked. 
</p>