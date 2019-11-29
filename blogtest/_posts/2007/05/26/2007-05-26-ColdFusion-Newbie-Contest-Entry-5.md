---
layout: post
title: "ColdFusion Newbie Contest - Entry 5"
date: "2007-05-26T11:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/26/ColdFusion-Newbie-Contest-Entry-5
guid: 2064
---

Welcome to the 5th entry in the <a href="http://ray.camdenfamily.com/index.cfm/2007/4/16/ColdFusion-Newbie-Contest-Announced--Monster-Maker">ColdFusion Newbie Contest</a>. Today's entry is "Monsta" (is that like Gansta?) from Jay Cunnington. This entry will run online so I've set up a demo here:

<a href="http://ray.camdenfamily.com/demos/contest6/monsta">Monsta Demo</a>
<!--more-->
This entry starts off nicely. I like all the choices you get when creating the monster. Hence the birth of my little girl, Rae, the 4 eyed ill tempered sea bass. Jay only has graphics for one type of monster, but you get the idea. The options are pretty simple. You can feed, entertain, or kill (how cruel!) your monster. That's pretty much it so let's jump into the code.

<img src="http://ray.camdenfamily.com/demos/contest6/monsta.png">


One of the first things I noticed was that his application didn't have an application.cfc/cfm file. He does use a cfapplication tag inside the index.cfm file, but in general I'd recommend always using a separate application.cfm/cfc file. Even if you do next to nothing in it - it is good practice. 

Another issue I see is that his CFC isn't cached. Notice this line (this is just one example):

<code>
&lt;!---get a structure with everything about the mosnter in---&gt;
&lt;cfif LEN(task)&gt;
	&lt;cfinvoke component="monsta"  method="GetEverything" returnvariable="MyMonsta" /&gt;
&lt;/cfif&gt;
</code>

See how the component is named? Everytime he runs his cfinvoke the CFC will be recreated. This can be a performance issue since CFC creation can be a bit slow at times. Since he does have an application in play, he should have created a copy in the application scope and then switched to using that CFC variable instead. If he had, the line above could be:

<code>
&lt;!---get a structure with everything about the mosnter in---&gt;
&lt;cfif LEN(task)&gt;
	&lt;cfinvoke component="#application.monsta#"  method="GetEverything" returnvariable="MyMonsta" /&gt;
&lt;/cfif&gt;
</code>

Outside of that - the main guts of index.cfm is handling the action and then displaying the results. His game logic for handling the task is rather simple, so I'll show it here:

<code>
&lt;cfswitch expression="#task#"&gt;
	&lt;!---what actions are there that can be done to the mosnter---&gt;
	&lt;cfcase value="Give Birth"&gt;
		&lt;cfinvoke component="monsta" method="newMonster"&gt;
			&lt;cfinvokeargument name="MName" value="#mons_name#" /&gt;
			&lt;cfinvokeargument name="MEyes" value="#mons_eyes#" /&gt;
			&lt;cfinvokeargument name="MType" value="#mons_type#" /&gt;		
		&lt;/cfinvoke&gt;
	&lt;/cfcase&gt;
	&lt;cfcase value="Feed"&gt;
		&lt;cfinvoke component="monsta" method="FeedMonster" /&gt;	
	&lt;/cfcase&gt;
	&lt;cfcase value="Entertain"&gt;
		&lt;cfinvoke component="monsta" method="TainMonster" /&gt;
	&lt;/cfcase&gt;
	&lt;cfcase value="Suicide"&gt;
		&lt;cfinvoke component="monsta" method="suicideMonster"&gt;
			&lt;cfinvokeargument name="Mname" value="#MyMonsta.name#" /&gt;
			&lt;cfinvokeargument name="MEyes" value="#MyMonsta.eyes#" /&gt;
			&lt;cfinvokeargument name="MType" value="#MyMonsta.type#" /&gt;			
		&lt;/cfinvoke&gt;	
	&lt;/cfcase&gt;
&lt;/cfswitch&gt;
</code>

Nothing to comment on here really. I'd probably add a cfdefaultcase, even if you just have it do nothing, I like to have it in the code so I at least know that I'm thinking of the unknown case. 

Now lets jump into the CFC. Right off the bat I see missing output statements. Now to be fair, this is probably more my thing than a real global best practice. I tend to be anal about white space and always try to use output=false in my cfcomponent/cffunction tags. 

A more serious issue is the lack of var scoping. Almost every function needs these lines added.

One cool thing - or not really cool but something I think some newbies forget about - is in getEverything:

<code>
&lt;cfinvoke method="getBirth" returnvariable="MBirth" /&gt;
&lt;cfinvoke method="getEyes" returnvariable="MEyes" /&gt;
&lt;cfinvoke method="getType" returnvariable="MType" /&gt;
&lt;cfinvoke method="getFood" returnvariable="MFood" /&gt;
&lt;cfinvoke method="getTain" returnvariable="MTain" /&gt;
&lt;cfinvoke method="getsuicide" returnvariable="MSui" /&gt;		</code>

Notice that he is using cfinvoke without a component value. This simply means to run the mehtod inside the component itself. Don't just think that CFC methods are just for outside use. Having CFC methods use each other can greatly improve the CFC.

I was surprised to see he used a cookie to store the data. His monsta uses a structure for it's data, but he WDDXifies the data and stores it in a cookie to keep it around. Now this is a bit dangerous. Don't forget that a cookie has a 4k size limit and WDDX can be a bit fat, but pretty interesting usage here. (And plus I liked being able to play without setting up a database.)

So all in all - very nice and simple, and I like it. The lack of output control and var scoping is bad, but also pretty common. I like the simple nature of this. It just works well.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fmonsta%{% endraw %}2Ezip'>Download attached file.</a></p>