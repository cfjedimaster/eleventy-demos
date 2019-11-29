---
layout: post
title: "New files in Flash Builder and code hinting/coloring"
date: "2010-04-18T14:04:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2010/04/18/New-files-in-Flash-Builder-and-code-hintingcoloring
guid: 3784
---

Ok, anyone with more than one day of Flex Builder/Flash Builder experience can ignore this and laugh at me (discretely). I've run into this a few times before and as I always tend to forget <i>why</i> I thought maybe a blog entry would help seal it in my memory.

I was working on my <a href="http://www.cfobjective.com">cfObjective</a> demo code today (the last demo, I swear, I'm ready to present, honest) and ran into something odd. I had added a few files to my project and the color coding was broken. What was weird is that it was only broken for script blocks. I saw color coding just fine for mxml tags. I'd type mx:Script though and not only <i>not</i> get the automatic C Data block but I also didn't get any coloring or code completion. 

Turns out the reason was simple. When you make a new file in Flex/Flash Builder, you are given a large set of options: 

<img src="https://static.raymondcamden.com/images/Screen shot 2010-04-18 at 12.45.09 PM.png" title="OMFG What do I pick?" />

You may laugh - but I find that a bit intimating. I generally know what I want, but I'd rather just select "File" and then start coding. Turns out, when you do that, the IDE isn't quite sure how to handle it. I guess that's pretty fair if you think about it. 

It finally occurred to me to simply <i>close</i> the file and reopen it. As soon as I did, all the code hinting and coloring worked fine. 

This also falls into the "Duh" category, but I was pretty annoyed by the auto-identation Flash Builder used. It just didn't match my style. It never occurred to me to simply go into the preferences and disable it. In fact, there is an entire section just on Indentation.