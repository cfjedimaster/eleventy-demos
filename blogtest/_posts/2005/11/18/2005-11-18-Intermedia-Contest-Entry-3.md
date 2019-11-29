---
layout: post
title: "Intermedia Contest Entry 3"
date: "2005-11-18T18:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/18/Intermedia-Contest-Entry-3
guid: 923
---

Welcome to the third entry in the <a href="http://ray.camdenfamily.com/index.cfm/2005/10/30/Intermediate-ColdFusion-Contest">Intermediate ColdFusion Contest</a>. The earlier entries may be found at the end of this post. Today's entry is from Jeff D. Chastain, which for some reason sounded like a 'rogue gamblers' type name, so it's perfect for the contest. Before reading on, please check his application <a href="http://ray.camdenfamily.com/demos/contest2/jchastain/blackjack">here</a>. You can download his code from the download link at the bottom. That's the word <b>Download</b> for the Weegs out there. (Sorry man, couldn't resist. :) Remember that his code belongs to him!
<!--more-->
So - some initial non-ordered opinions on the game experience before getting into the code. I like how you have to click on the chips to bet. Not the graphics per se, which are nice, but this isn't a contest for graphics, but rather, I noticed how on this entry, and the <a href="http://ray.camdenfamily.com/index.cfm/2005/11/16/Intermediate-Contest-Entry-1">first one</a>, I didn't have to type something to bet. I think I like that. Makes the game a bit quicker to play. Or maybe I'm just a lazy guy. 

It's funny. I <i>was</i> going to complain about how I didn't like having to hit Deal after I placed my bet. I was going to say - shouldn't the game just throw the cards out as soon as I bet. Then it occurred to me that it would be a bit silly to let modify my bets while staring at the cards. (This is why I don't go to Las Vegas.) 

There is a typo when you try bet more money than you have in your bank. Only idiots tpyo. 

And lastly, maybe it was the old school gamer in me - but I was sure if I clicked in the right place I'd uncover a secret.

So now into the code. This is another entry that uses AJAX, and specifically the <a href="http://www.indiankey.com/cfajax">CFAJAX</a> project. I'm still not sold on the whole AJAX thing. I appreciate it from a technical side and have no problem requiring JavaScript, but as I said, I'm not sold on it. 

His code makes use of Application.cfc, but I noticed this in index.cfm:

<code>
&lt;cfif isDefined('url.init') OR NOT isDefined('session.dealer')&gt;
	&lt;cfset structClear(session) /&gt;
	&lt;cfset session.dealer = createObject('component', '_com.dealer').init() /&gt; &lt;!--- new dealer ---&gt;
	&lt;cfset session.player = createObject('component', '_com.player').init(2000) /&gt; &lt;!--- new player with inital $2000 bank ---&gt;
&lt;/cfif&gt;
</code>

I'd probably consider moving parts of this to onSessionStart, since thats what it is there for. Now - he doesn't just use this once. When the game starts over he uses it to reset the bank. The code, however, could be put in the onRequestStart. His CFC won't allow that as it is right now. The setBank() function is private, but it should be safe to change that to public and allow onRequestStart to do it. That would make the app a tiny bit quicker, as you wouldn't need to reload the CFCs for a new game. Nit picky maybe - but I think if you have the Application.cfc file there - you should use it. 

I'm going to point one bad thing about his CFCs than a good one. He didn't var scope his local variables. As my readers now, I consider that a cardinal sin. I'm going to keep repeating myself while I keep seeing code that doesn't do this. On the other hand - I like code like this: 

<code>
&lt;cffunction name="getBank" access="public" returntype="numeric" output="false" hint="get the bank amount"&gt;
	&lt;cfreturn variables.myBank /&gt;
&lt;/cffunction&gt;
</code>

This is from player.cfc. Why do I like this? In the past I would create global CFC variables and simply use them. So if some method needs variables.foo, I'd just use it. But by creating a simple method to abstract it, I think you gain a few things. First off - if you ever move the variable from the variables scope, you don't need to change N variables. Instead, you just update method. I swore I had another reason, but now I can't think of it. Anyway, I first noticed code like this in <a href="http://www.model-glue.com">Model-Glue</a> examples. I thought it was a bit crazy at first - but as I said, it makes sense to me now.

I was looking at this CFC folder when I noticed something odd. Every CFC had a corresponding CFM file. I opened up one and noticed that it was a test file. Here is a portion of player.cfm:

<code>
&lt;!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"&gt;
&lt;html&gt;
&lt;head&gt;
	&lt;title&gt;Player.cfc Test Harness&lt;/title&gt;
	&lt;meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;h1&gt;Player.cfc Test Harness&lt;/h1&gt;

&lt;p&gt;&lt;strong&gt;Creating new dealer ...&lt;/strong&gt;&lt;br/&gt;
&lt;cfset dealer = CreateObject('component', 'dealer').init() /&gt;
Dealer created&lt;/p&gt;

&lt;p&gt;&lt;strong&gt;Creating new player ...&lt;/strong&gt;&lt;br/&gt;
&lt;cfset player = CreateObject('component', 'player').init(2000) /&gt;
Player created&lt;/p&gt;

&lt;p&gt;&lt;strong&gt;Player's current hand includes ...&lt;/strong&gt;&lt;br/&gt;
&lt;cfset curHand = player.getHand() /&gt;
&lt;cfset curHandValue = player.getHandValue() /&gt;

&lt;cfloop from="1" to="#arrayLen(curHand)#" index="ptr"&gt;
	&lt;cfoutput&gt;#curHand[ptr].show().value# of #curHand[ptr].show().suite#&lt;/cfoutput&gt;&lt;br/&gt;
&lt;/cfloop&gt;

&lt;cfif arrayLen(curHand) EQ 0 &gt;
	Player's hand is empty
&lt;cfelseif curHandValue[1] EQ curHandValue[2] &gt;
	For a total of &lt;cfoutput&gt;#curHandValue[1]#&lt;/cfoutput&gt; points.
&lt;cfelse &gt;
	For a total of &lt;cfoutput&gt;#curHandValue[1]#/#curHandValue[2]#&lt;/cfoutput&gt; points.
&lt;/cfif&gt;
&lt;/p&gt;
</code>

In case it isn't obvious - what he has done is written a file he can hit and ensure the functionality of his CFC is still working right. This is a Good Thing(tm) and nowhere near enough of us do it. I don't do it, and you know what, I <i>really</i> need to help ensure all those projects I have up in the air run right. I was asked to check out <a href="http://cfunit.sourceforge.net/">CFUnit</a>, a unit testing framework, and I just haven't had the time, but I'm going to recommend other folks check it out as well as checking out <a href="http://www.cfcunit.org/cfcunit/">cfcUnit</a>. At worst - look at Jeff's simple one page test file. It does the job well I think. I'm kinda riffing now (how long is this blog post going to be), but one of the problems I have with my projects is ensuring my changes work across the databases I support. Using a test script that runs the same code in a loop over multiple databases would help me flesh out those problems earlier. 

So, I think I've said enough about this application. Time for my readers to chime in as well.

Earlier Entries:
<ul>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/17/Intermediate-Contest-Entry-2">Entry 2</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/16/Intermediate-Contest-Entry-1">Entry 1</a>
</ul><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fjchastain%2Ezip'>Download attached file.</a></p>