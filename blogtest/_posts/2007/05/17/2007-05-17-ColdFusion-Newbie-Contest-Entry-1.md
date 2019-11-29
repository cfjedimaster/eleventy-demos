---
layout: post
title: "ColdFusion Newbie Contest - Entry 1"
date: "2007-05-17T17:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/17/ColdFusion-Newbie-Contest-Entry-1
guid: 2044
---

<img src="http://ray.camdenfamily.com/enclosures/gothboy%2Egif" align="left" hspace="10"> Welcome to the first entry in the <a href="http://ray.camdenfamily.com/index.cfm/2007/4/16/ColdFusion-Newbie-Contest-Announced--Monster-Maker">ColdFusion Newbie Contest</a>! Before I get started on these reviews, let me lay down the ground rules here. The whole point of this contest is for us to learn. I'm a <b>huge</b> believer in looking at, and talking about, other people's code. I've learned a lot of what I know today from others so I think this contest can really serve as a platform to share and learn. Even those these entries are from newbies, I highly encourage those of you who are more experienced to take a look. You never know when you may learn something. With that being said, I'm going to point out what I like and what I don't like about these applications. I am not a ColdFusion God. You should not take my opinion here for the absolute final word. These are my opinions, nothing more. I encourage others to also chime in with their opinions as well. The number one rule though is to be polite. We were all <a href="http://ray.camdenfamily.com/index.cfm/2007/4/19/Why-you-will-never-read-my-blog-again">beginners</a> at once point and time. So feel free to point out mistakes I didn't find - but be nice!

Enough namby-pamby crap. Let's go! Our first entry is Goth Boy by John Ramon. You can download his code below and you can see it running <a href="http://ray.camdenfamily.com/demos/contest6/gothboy">here</a>. I feel like I should warn folks that this entry is probably a bit PG-13. We are all adults here, but this entry does have a few things that may offend folks. (Or maybe I'm just getting too sensitive in my old age.) Play with it a bit and then read what I have to say. It's ok, I'll wait.
<!--more-->
First and foremost - the design of this is amazing. I'm not going to pick a winner based on design since, well, my design skills stink, but I really love the look and feel of this. He did a great job I think and I'm sure most of my readers will agree. The gameplay is pretty cool too. Instead of making Goth Boy happy (or sad as I would have guessed), your goal is to keep him from being <i>too</i> happy or sad. I guess Goth Boy believes in moderation. Now let's jump into the code.

He doesn't get points off for it - but I'll point out that he uses Application.cfm. I know this is the simpler way to do application management, but all developers need to look into Application.cfc and start moving to that way of doing things. While it isn't quite as simple, it is still the best way to set up your application. For more information, see the <a href="http://livedocs.adobe.com/coldfusion/7/htmldocs/00001112.htm">livedocs page</a> on the topic.. If you look at this code that defines the session values, I think it would be a lot cleaner in an onSessionStart method.

In the same file, I like the fact that he defines timeouts for his application and session variables. I will admit to <b>not</b> doing this myself, but I tend to think that it is helpful at times to specify things like this just so it is obvious. Sure we all know what the defaults are (do we all know this?) but having it right there is a good reminder. 

Moving on down, from a game perspective, I really liked how he made the dynamics random:

<code>
&lt;!--- Set the high low of the happiness before death ---&gt;
&lt;cfparam name="session.toLittleHappiness" default=#RandRange(1, 10)#&gt;
&lt;cfparam name="session.toMuchHappiness" default=#RandRange(90, 100)#&gt;
</code>

This code snippet controls the 'happiness' range. Because it has a bit of randomness to it, every game will be a little bit different. Nice!

On the flip side though - he has a set of variables that use hard coded values, like the starting value of sadness. I'd consider moving these out to an XML or INI configuration file so it is a bit easier to update. I try to make sure that any static, hard coded variables like that are stored outside of 'program' code. For an example of this, see the <a href="http://blogcfc.riaforge.org/index.cfm?event=page.svnview&path={% raw %}%2Forg%{% endraw %}2Fcamden{% raw %}%2Fblog&file=blog%{% endraw %}2Eini%2Ecfm">INI file</a> that BlogCFC uses for configuration.

He used an image map for his intro/instructions page. I only point that out because it seems like years since I worked with image maps. Do people still use them often? The last time I had to build one (few months ago), I could only find a Windows 3.1 era editor. The Dreamweaver editor kept crashing on me.

Now lets move into GothBoy.cfm the main "engine" of the game. The first thing that bugs me is the lack of URL scoping on variables. While this works just fine in ColdFusion, in general you should always properly scope your variables. This makes the application work a (tiny) bit quicker, and also makes it more clear where the data is coming from. For example, if I know that "price" is a URL variable, I'll do a heck of a lot more validation than if it was a query variable. To see how this is a problem - notice that the actions you do on GothBoy are passed in as a URL variable named obj. He doesn't do any validation on this so it is possible to put in a bad obj value. The application doesn't throw an error, but doesn't quite handle it well. 

Each obj (again, this is an 'action' you do on the kid) has an effect. This is reflected in the GothBoy.cfm file, but I'd recommend this be moved out into a configuration file. So if I decide that ice cream is not a bad thing anymore but a good thing, I shouldn't have to edit code in order to make this change. I also found his code a bit hard to follow with doMode1 and doMode2. These variables didn't really speak to what they were doing. doMode1 affected sadness and doMode2 affected happiness. I'd consider making that a bit more obvious. 

Notice this in GothBoy.cfm: 

<code>
&lt;cfset doMode1 = #RandRange(1, 2)#&gt;
</code>

This is a classic newbie mistake of overusing pound signs. You only need them when outputting a variable. This should be rewritten as:

<code>
&lt;cfset doMode1 = RandRange(1, 2)&gt;
</code>

This doesn't have any impact on your performance, it just makes things a bit easier to read.

Now we come to him CFC usage. He created a CFC named getFeelings. This CFC simply wraps one function - smartAss. As I said above, this is a PG-13 blog post! The function is used to generate a random message based on the action you had taken on the boy. Again I'd say this could be much better done in XML (the string portion I mean). Outside of that, the CFC usage is a good beginning, but I'd like to see a lot more moved into the CFC later on. The main file, GothBoy.cfc, should really be just handling the input and output, and letting the CFC handle everything related to the state, reaction, etc. John has the right idea here with this method, but he just needs to push it a bit further.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FGothBoy%{% endraw %}2Ezip'>Download attached file.</a></p>