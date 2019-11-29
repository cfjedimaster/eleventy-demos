---
layout: post
title: "ColdFusion Newbie Contest - Entry 3"
date: "2007-05-23T01:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/23/ColdFusion-Newbie-Contest-Entry-3
guid: 2057
---

Welcome to the third entry in the <a href="http://ray.camdenfamily.com/index.cfm/2007/4/16/ColdFusion-Newbie-Contest-Announced--Monster-Maker">ColdFusion Newbie Contest</a>. Today's entry is... well, there isn't a name for it, so I'll call it the Thingy Store, after a term the author used. This entry was created by Simeon Cheeseman. This entry is pretty interesting. It is a bit hard to use, but I think Simeon has the beginnings of something pretty cool here.
<!--more-->
Because of limitations with the game (that I'll mention later), I could not run an online demo. You can download the zip by clicking the &quot;Download&quot; link, just be sure to keep reading so you know how to expand and place the zip.

The game first asks you to login. You will need to register and then use the username/password you selected. Once you've logged in, you then get to select a creature and a difficulty. That is pretty impressive. Giving you both a choice of creature type and skill level cool and gives the game more playability. 

After this you enter the main interface for the game. On the right you have a chart showing the current stats of your creature. On the left you have a panel to enter commands. I have to admit I kind of liked the text box. It reminded me of old school Infocom adventure games. (You kids can Google that if you don't know what I mean.) But the interface for commands was a bit hard to grok. Some commands apparently took arguments, and I was able to guess a few.

Also note the shop command. He actually built a mini store into the game. Cool! Although for the life of me I couldn't figure out how to earn money so I'm not sure what to do once you have spent all the money. (Update: Turns out there was a bug. Simeon sent me a fix and it is in the downloadable version.)

So outside of that - let me talk a bit about the code. There is a lot to this application (you can download it below), so I'll cover some of the high points.

First and foremost - I mentioned this in the last entry so I'll mention it again - please remember to use a default filename for your application so that the web server can load the file without me needing to specify it. Sure the 'home file' for your web server may be different, but in general I think using "index.cfm" should be the norm. In this case I had to guess at main.cfm. The file makes some interesting choices that I would have done differently. So for example, this block at top:

<code>
&lt;cfif not IsDefined("session.login") or session.login eq "no"&gt;
	&lt;cflocation url="/game/CFcomp/start.cfm"&gt;
</code>

Should have been done in Application.cfm instead. You want to ensure that your login check is always run, and Application.cfm/cfc is the only way to do that. 

There is also a big problem in his cflocation. See the hard coded game folder? I had originally just dropped his CFComp folder into my web root. To make it work right I had to move it to match the folders he picked.

Writing code to be portable like this can sometimes be difficult, but in general, I don't see where he couldn't have simply cflocated to start.cfm instead. 

Jumping to another page - the file pages/holder.cfm is run while you view the thingy. The first thing I noticed was the repeated check for session.login. As I said above, if he moved this to Application.cfm/cfc, he wouldn't need it here.

The second thing I noticed was a large number of checks for session variables. Here is that block:

<code>
&lt;!---This section geets the current time and outputs an appropriate greeting.---&gt;
&lt;cfif IsDefined("form.easy")&gt;
	&lt;cfset session.difficulty = 10&gt;
&lt;/cfif&gt;
&lt;cfif IsDefined("form.medium")&gt;
	&lt;cfset session.difficulty = 5&gt;
&lt;/cfif&gt;
&lt;cfif IsDefined("form.hard")&gt;
	&lt;cfset session.difficulty = 1&gt;
&lt;/cfif&gt;
&lt;cfif IsDefined ("form.name")&gt;
	&lt;cfset session.name = #form.name#&gt;
	&lt;cfset session.gender = #form.gender#&gt;
&lt;/cfif&gt;
</code>

A lot of code, right? The thing is - all of this could have been put inside a onSessionStart method of the Application.cfc file - and it would have been much shorter as well. Even if you can't use Application.cfc, he could have checked for the first hit of the session and defined the values then.

In the same file I also saw a few calls like this:

<code>
&lt;cfinvoke component="components.randomiser" method="randPercentage" returnvariable="health"&gt;
</code>

What is the problem with this? Notice that the component value is a string. Every time this file is run, that CFC is recreated. I see at least 4 of these which means the same CFC is recreated 4 times. It would be better to create an application scoped version of the CFC and call that. CFC creation can be a bit slow - so if you <i>can</i> cache an instance, why not?

Now let me talk a bit about the component usage. If you remembrr, one of the requirements was that the application make use of CFCs. As far as I can tell, this submission makes the most use of CFCs yet. I count 8 in his project. 

His CFCs look well built. I don't see any output=false attributes, but I do see proper var scoping. On the flip side though - his CFCs write back to the session scope. This is normally considered a no-no. 

Another thing I'd point out - I thought it was cool that each thingy had a CFC to represent it's various stats. This would normally be something I'd consider using inheritance for. For example - I can see a thingy.cfc acting as the core CFC, and each of his three Thingys would extend it. What's cool is that he could actually make the game generate it's thingy list by using cfdirectory and looking at the metadata for the CFCs. I've done this on a few projects. It means he could add a new Thingy by just adding a CFC and not writing code in the core application itself.

One last point before I open the gates to other comments. I noticed that his zip didn't contain instructions. When I ran the application and noticed it asks for a login, I thought for sure I'd run into an error because I didn't setup a datasource. 

Turns out he uses XML for storage. Now while I wouldn't recommend it for a production machine, it <b>really</b> made me happy that I didn't have to actually do anything in the ColdFusion administrator to prepare his application.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fcfcomp%{% endraw %}2Ezip'>Download attached file.</a></p>