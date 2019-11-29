---
layout: post
title: "Share Your (Code) Pride"
date: "2010-08-13T09:08:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/08/13/Share-Your-Code-Pride
guid: 3910
---

I've been thinking about this for a few days now and I thought it would be good for a Friday morning post. I'm a bit hazy on the exact date, but I have a very clear memory of the first program I ever wrote. (AppleSoft Basic FTW!) I've been writing code for almost 30 years now. I've written a lot of good code. I've written a lot of - um - not so good code. But over all that time, there are certain things that I'm pretty darn proud of. I thought I'd share the code (well, the concept at least) that I'm most proud of and open the discussion to anyone else who wants to share as well.
<!--more-->
<p>
Back in the early 90s I was big into <a href="http://en.wikipedia.org/wiki/MUD">MUD</a> games. If you are too young (or were too cool) to have played them, just think of interactive, multiplayer online games in pure text form. Warcraft in text. In most MUDs, if you advanced to a certain level you could leave the players game and become a Wizard, or creator. Depending on the MUD you played on, that meant you could extend the virtual world and add new areas, quests, and, best of all, monsters. 
<p>
Coding in the MUDs I played on was done with a language called <a href="http://en.wikipedia.org/wiki/LPC_(programming_language)">LPC</a>. This was a simplistic varient of C. (I say simplistic because whenever I see "real" C code I shudder a bit.) For the most part coding in LPC was pretty fun. You could build a room, describe it, and put a NPC (monster, person, whatever) inside that could interact with players. (Or attack them!) 
<p>
The last MUD I played intensively was Everdark, a fantasy-based MUD. When it came time for me to build my own zone, I wanted to do something really special. I added two features to my realm that were - as far as I know - pretty unique in the MUD universe. The first thing I did was to add "time" to my realm. MUDs had a concept of time of course. I mean, you walked around. Fought creatures. Etc. But for the most part the world you interacted with was static. If the sun was shining on a castle it was always shining. I wrote a system that created a clock for all the rooms in my realm. My rooms could then return a different description based on the current time. Rooms could also "announce" things to players in the room. So if the room was a beach (think of 'room' in a more generic sense than normal) I could, at 6, mention the sun rise. All in all, depending on how verbose I felt that day, I could be incredibly description.
<p>
The second enhancement I created was for the NPCs in my realm. I added basic conversation support. You could go up to Bob and type:
<p>
<code>
ask bob about weather
</code>
<p>
At which point Bob might say, "I don't mind the sun so much but I despise the rain." You could then follow up with:
<p>
<code>
ask bob about rain
</code>
<p>
At which point Bob could begin to tell you about his knees and how they act up in the rain. You get the idea. The point was that the code was setup to be super easy. I don't remember the exact syntax, but it was as simple as:
<p>
<code>
addResponse("weather","I don't mind the sun so much but I despide the rain.");
addResponse("rain","The rain always makes my knees hurt.");
</code>
<p>
Adding an alias, like "the rain", was as easy as:
<p>
<code>
addResponse("rain,the rain", "The rain always makes my knees hurt.");
</code>
<p>
You get the idea. All in all - I think my realm felt more alive, more interactive, and just more immersive than most MUD quests. I got the code to a point where I could focus on the writing and not the syntax. 
<p>
I have no idea where this code is now - but darnit - I was incredibly proud of what I created. So - how about you guys?