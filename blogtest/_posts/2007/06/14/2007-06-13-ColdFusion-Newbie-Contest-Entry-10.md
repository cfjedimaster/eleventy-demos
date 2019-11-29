---
layout: post
title: "ColdFusion Newbie Contest - Entry 10"
date: "2007-06-14T10:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/14/ColdFusion-Newbie-Contest-Entry-10
guid: 2121
---

This last entry in the <a href="http://www.raymondcamden.com/index.cfm/2007/4/16/ColdFusion-Newbie-Contest-Announced--Monster-Maker">ColdFusion Newbie Contest</a> is here! It is an application created by Phillip Senn. As with the previous entry, I had difficulty setting up the code locally (due to my not having SQL Server at the time), so I'm going to point people to the online version: <a href="http://www.aacr9.com/index/camdenfamily/tamagotchi/">http://www.aacr9.com/index/camdenfamily/tamagotchi/</a>
<!--more-->
This entry is rather simple. As you can see - you are dropped into the creature maintenance immediately. A database is used for everything and I believe this means that if multiple readers hit the site, they will all be affecting the creature at the same time. So those of you who have easier access to SQL Server and want to try this application should download it instead. Anyway, as you can see, you simply feed and pet the creature, and that is it. In fact, I couldn't even kill off the creature. From a game play perspective, there isn't a lot here honestly, but there is some interesting code here for us to talk about. (Although the trick with making the image bigger as the creature ate was pretty funny.)

First off - Phillip made a huge mistake. Gigantic. He wrote a Word document describing what he did. That just makes me it easier for me to pick on him! (Just teasing Phill!) From the Word document we learn that Phillip only used stored procedures and views to interact with the data. Wow. I have to say I am impressed. It takes a lot of discipline to just use stored procs throughout an application. I will be 100% honest and admit I'm a database wimp and rarely use/write stored procs myself. 

In his word document he goes on to explain why he doesn't use the Arguments scope inside of CFFUNCTIONs. His argument is based on the fact that since you can't prefix local var scope variables, and you can't mix the two, then there should be no confusion. Personally I don't agree with that. I think that when working in any slightly complex method, you are going to want to have a good handle on what is an argument and what is a local variable. So I may be being picky here, but I'd always use the argument scope.

Most impressive is the use of Application.cfc. I do not believe many of the entries did this. He caches many CFCs in the Session state making proper use of onSessionStart. I also liked this bit of code:

<code>
&lt;cfif NOT Len(cgi.HTTP_USER_AGENT)&gt;
	&lt;cfreturn false&gt; &lt;!--- Bots ---&gt;
&lt;/cfif&gt;
</code>

I wonder how well this would work. I thought most bots actually <i>had</i> a user agent. It does bring up a good point. I know Michael Dinowitz has done some good work in blocking sessions for robots and has found this to be a big help for server performance. I don't know if Michael has written this up yet into a formal article, but if he hasn't, he should. (In his copious free time of course.)

In the last <a href="http://www.coldfusionjedi.com/index.cfm/2007/6/13/ColdFusion-Newbie-Contest--Entry-9">entry</a>, one of the things I warned about was the use of hard coded numbers in the code. So for example, if "1" means happy, I'd abstract that so that you can do getHappyState instead. I see similar type issues in Phillips code, specifically in index.cfm where he handling updating the state of the creature.

Another issue - and let me be 100% clear this - this is <b>not</b> a fair complaint for Phillip. I am bringing it up as a warning to others but not to say that Phillip did anything bad here. I noticed a file named session.cfm. It simply did this:

<code>
&lt;cfdump var="#Session#"&gt;
</code>

While useful, and I've done the same thing myself, it is critical to remember to not push files like this to production (as has been done here). I've made this mistake myself, so I'm just reminding people. 

Now let me dig into his CFCs. First off - Phillip points out that his CFCs all extend a common CFC, which is pretty cool to see. His common.cfc contains a base init, read, view, and delete method that his other CFCs can use. He uses an interesting CFC, Database.cfc, to handle abstracting his queries for him. This allows him to select data from other CFCs like so:

<code>
&lt;cfset qry=Variables.DatabaseObj.Select(
TableName="Tamagotchi_CreatureStateView",
Where="#Where#") /&gt;
</code>

I'll be hoenst and say I'm not quite sure I like that. Writing the SQL as he does in Database.cfc does mean he loses the ability to do cfqueryparam, and I'm not sure I'd give that up. But it is a very interesting usage. I'm going to give him extra brownie points though for using cfqueryparam everywhere he could though. Along with that I was also happy to see proper var scoping and output restriction. 

Phillip pinged me directly a day or so ago to say he removed returnType to keep the code a bit simpler. I guess I can see that - but I tend to be pretty anal about always including my return type. I'd suggest he add that back in. Did you know that in ColdFusion 8 you can turn on duck typing in the ColdFusion Administrator? This means you go crazy with typing and still get the performance benefits on production.

So thats all I have to say about this entry, and that means we are done! My next post will gather up all ten entries and I encourage folks to start thinking about what entry was their favorite. Also please give feedback to Phillips code (and feel free to disagree with my notes as well).<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FTamagotchi%{% endraw %}2Ezip'>Download attached file.</a></p>