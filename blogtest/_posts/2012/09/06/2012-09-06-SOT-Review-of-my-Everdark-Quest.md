---
layout: post
title: "SOT: Review of my Everdark Quest"
date: "2012-09-06T12:09:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2012/09/06/SOT-Review-of-my-Everdark-Quest
guid: 4724
---

SOT (or Seriously Off Topic) post to share with you today. This morning I was sitting in the <a href="http://www.heartlanddc.com/">HDC</a> keynote and was surprised to hear the speaker talk about MUDs. For those of you who are a too young, MUDs were multiplayer RPGs in the days before World of Warcraft. They were entirely text based (well, at first) and were basically Zork-clones on acid. Many MUDs existed but they've waned somewhat in popularity over the past few decades.
<!--more-->
The last MUD I was active on was Everdark (everdark.org:3000). I built a zone called Ravenport that was - in my mind - some of the best coding I've done in my life. I added two things to the zone that I had not seen elsewhere.

First - all my NPCs could converse with players. This was done using a simple: "ask X about y" syntax. In order to make this easy to code, I built in a simple API so that I could do something like: respond("beer","Oh yes, I like beer."). Once that was in place I made conversations a key part of the zone and solving the quest. (I also added a bunch of silly stuff just to see how far people would take their conversations.)

I also added a time system. I built a central object that kept track of time (just hours actually). All the rooms in my zone made use of this object and would be updated of time changes. If you were sitting on the beach for example, you would notice when the sun rose or set. Again, I built a simple API into my code so it was easy to add messages based on the time of day.

Anyway - all that code is still running. I probably wouldn't recognize the code now if I looked at it. ;) I logged in today and found that I had saved a player review of my zone back from the old days of 2006. Here it is in it's entirety. Enjoy.

<blockquote>
From: Rolgar*
Subj: Ravenport Epilogue
To:  taelara
Cc: sezrak bax rolgar
Date: Feb  3, 2006

The Ravenport quest was quite a masterpiece.  Since I have completed this
quest over such a long period of time and have savored it to the max, I
wanted to provide some feedback.

Best Qualities (the Feel)
The Raveport area is known for its uniqueness due to its time dependence
and the ability to converse with most of the denizens.  This area was the
prototype on ED for this type of atmosphere.  The quest itseld builds in
intensity as you get closer and closer to the Forge.  While this quest
emphasizes physical combat, many death traps have to be avoided using
intellect over brawn. 

Primary Challenge
Main Theme ____Overcoming fear and analyzing daunting challenges.
Achieving mirror of Memory is the turning point in the quest.

Most Enjoyable Areas
Searching the sewers of Rypscythe and figuring out when to attack without
drowning.
Obtaining Wormwood, this item is the wierdest item I have encountered in
the realm so far.
The knight puzzle at opening was a mindbender, overcoming the urge to jump
in was quite strong.
Finally, top prize goes to the Furax maze. My favorite, a very enjoyable
and intense part of the quest.

Mysterious Loose Ends
There is a button on the wall beneath the church, one room south of
gargoyles.  Never found a function for this button. (very odd)
In the sewers, there are scribbled messages and interesting skeletons, the
impression is that there may be extra items or secrets lurking about there.

Observations and Recommendations
This quest was great for enhancing fighting skills, you needed to hunt and
think on your feet while in combat.

No Grings are required for this quest, contrary to popular ED rumint.

The only issue that occured with obtaining addtional copies of mirror of
memory and wormwood.  When I would offer my memory of mirror to barkiel to
bring the quest back up to that point, Barkiel would just take the mirror. 
I did not realize that this was an issue initially.  Things really got
crazy when I died after killing Turing and had to reobtain both the mirror
and wormy.  This time when I thought I? had to check back in with Barkie,
not only did he take my items, he caccused me of being a cheater.  This
accusation along with the confiscation caused me concern and confusion. 
Coding difficulties are beyond my scope so I do not know the difficulties,
however if Barkiel had informed to continue on I would not have had to bug
the wizzes.  Thanks to all, Sezrak, Taelara, and Bax for your time in
dealing with this issue so that it all worked out in the end. 

Finally, I would like to thank the original creator Romana for her legacy.

Fighter Stats used, Str (19/19)  Con (26/26)  Dex (20/20)  Int (16/16)  Fig
(29/29)  Will (12/12)

Baron Rolgar
The Hollockian Warrior
Servant of Agrivar

=== Forwarded by: Bax, On : Feb  6, 2006
</blockquote>

p.s. Best text game ever? Easy - "A Mind Forever Voyaging."