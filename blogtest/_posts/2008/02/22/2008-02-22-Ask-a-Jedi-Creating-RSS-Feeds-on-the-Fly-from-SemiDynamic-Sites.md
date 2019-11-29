---
layout: post
title: "Ask a Jedi: Creating RSS Feeds on the Fly from Semi-Dynamic Sites"
date: "2008-02-22T15:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/22/Ask-a-Jedi-Creating-RSS-Feeds-on-the-Fly-from-SemiDynamic-Sites
guid: 2667
---

Clay asks:

<blockquote>
<p>
I attended your RSS session that you gave at Max and now, here I am, with an RSS question.

I have no problem building feeds and such, my problem lies in some of my company's users needing to take advantage of RSS feeds without the technical know-how.

Allow me to explain...We have a training website that a colleauge of mine uses Captivate to develop. She is not
a programmer, but does a great job at designing curriculum. Whenever new curriculum is released or updated, they would like to push that out using RSS. The issue I see with RSS is that there is not a gui interface for creating them
(that I know of). I did stumble across a product called, "Feed For All" that provides this, but I would like to not add to their workload.

So now to my question...is it possible to dynamically create an RSS feed off of changes to a site/page. Ideally, whenever new changes are released, I would like the RSS to
update automatically. The issue with this line of thought seems to be sifting
through fixes/simple updates versus 'promotable' changes. My thought was that if
one could utilize the verity search and perhaps search for an ID of a tag, then
I could train them to simply put that ID on the new stuff and the feed could be
created dynamically.

Is anything like this possible?
</p>
</blockquote>

So I'm no Contribute user, but after searching Adobe, I found this in the <a href="http://kb.adobe.com/selfservice/viewContent.do?externalId=ad0ab8f&sliceId=1">release notes</a> for version 3.1:

<blockquote>
<p>
<b>RSS Activity Feed service</b><br>
CPS 1.1 now includes an activity feed service that receives Contribute event notifications and broadcasts them using RSS protocol. This allows website administrators to view website update notifications in their Blog Reader of choice. This service is in the form of a starter ColdFusion script, and can be extended to fit specific needs.
</p>
</blockquote>

This sounds more like an activity feed, and not a content feed, and probably not something you would want to share with the public. 

So with that said - I think you hit the nail on the head. While it would be possible to monitor files and note when they are updated, it would be harder to tell "big" updates from things like typo fixes. Since you want an all-automated system, you may have to live with that.

You <i>could</i> simply remind your authors that all edits will update the RSS feed, and that could possibly encourage them <i>not</i> to make typos. That would reduce the amount of times 'minor' updates get promoted in RSS. 

Outside of that - I can't think of anything else. Maybe some of my readers are Contribute users and can suggest something better!