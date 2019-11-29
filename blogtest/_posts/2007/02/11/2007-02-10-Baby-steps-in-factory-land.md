---
layout: post
title: "Baby steps in factory land"
date: "2007-02-11T05:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/02/11/Baby-steps-in-factory-land
guid: 1831
---

About a week or so ago I attend a <a href="http://ray.camdenfamily.com/index.cfm/2007/2/2/Frameworks-Conference-Intro-to-Object-Factories--Rob-Gonda">presentation</a> on object factories by Rob Gonda. Object factories were something I had heard about and read about, but didn't quite get. The presentation really helped a lot, and I thought I'd share my thoughts on how I understand this concept, and then quickly show a practical example of how I applied this to the new beta of <a href="http://canvas.riaforge.org">Canvas</a>.
<!--more-->
First lets talk a bit about how a person typically creates a set of components for use within an application. Most folks will (hopefully) create these components in the Application scope so they only have to create it on time. So let's start with a simple onApplicationStart method:

<code>
&lt;cffunction name="onApplicationStart" returnType="boolean" output="false"&gt;
  &lt;cfset application.ship = createObject("component", "cfcs.ship").init("dsn", "arrayofshipclasses")&gt;
  &lt;cfset application.soldier = createObject("component","cfcs.soldier").init("dsn", "arrayofjobs")&gt;
  &lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>

This application uses 2 CFCs (Ship and Soldier). Each CFC has 2 arguments necessary to initialize them. So far so good. If either of the CFCs change then it isn't a big deal. 

Where things get complex is when you begin to add a few more CFCs to the mix:


<code>
&lt;cffunction name="onApplicationStart" returnType="boolean" output="false"&gt;
  &lt;cfset application.ship = createObject("component", "cfcs.ship").init("dsn", "arrayofshipclasses")&gt;
  &lt;cfset application.soldier = createObject("component","cfcs.soldier").init("dsn", "arrayofjobs")&gt;
  &lt;cfset application.planet = createObject("component", "cfcs.planet").init("dsn","arrayofplanettypes","maxforgame")&gt;
  &lt;cfset application.player = createObject("component", "cfcs.planet").init("dsn","arrayofplayertypes","maxforgame")&gt;
  &lt;cfset application.ruleset = createObject("component", "cfcs.ruleset").init("dsn")&gt;
  &lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>

So that isn't terribly bad. It's a bit messy, but ok. But let me throw a monkey wrench into the process. What if....

<ul>
<li>Ship.cfc needs it's own planet, solder, and ruleset cfc?
<li>Solder.cfc needs a copy of ruleset
<li>Planet.cfc needs a copy of soldier, ruleset
<li>Player.cfc needs a copy of ship,solder,planet, and ruleset.
</ul>

Um, so I can handle that. Each of the CFCs above, in their init methods, will simply have their own creatObjects. While I used to have 5 CFCs cached I now have 15. Well, RAM is cheap so I'm not too worried, and it's not like the CFCs take up a lot of RAM anyway. But what is more troublesome is  the thought of change. If the required attributes for ruleset change, now I have to update multiple CFCs as well as Application.cfc. And guess what happens if I forget?

So the first thing a factory can help me out with is simply handling creating objects for me. Let's build a super simple factory. Consider the code below:

<code>
&lt;cfcomponent output="false"&gt;

&lt;cffunction name="getComponent" returnType="any" output="false"&gt;
	&lt;cfargument name="name" type="string" required="true"&gt;
	
	&lt;cfswitch expression="name"&gt;
	
		&lt;cfcase value="ship"&gt;
			&lt;cfreturn createObject("component", "cfcs.ship").init("dsn", "arrayofshipclasses")&gt;
		&lt;/cfcase&gt;
		
		&lt;cfcase value="soldier"&gt;
			&lt;cfreturn createObject("component","cfcs.soldier").init("dsn", "arrayofjobs")&gt;
		&lt;/cfcase&gt;

		&lt;cfcase value="planet"&gt;
			&lt;cfreturn createObject("component", "cfcs.planet").init("dsn","arrayofplanettypes","maxforgame")&gt;
		&lt;/cfcase&gt;
		
		&lt;cfcase value="player"&gt;
			&lt;cfreturn  createObject("component", "cfcs.planet").init("dsn","arrayofplayertypes","maxforgame")&gt;
		&lt;/cfcase&gt;
		
		&lt;cfcase value="ruleset"&gt;
			&lt;cfreturn createObject("component", "cfcs.ruleset").init("dsn")&gt;
		&lt;/cfcase&gt;
		
		&lt;cfdefaultcase&gt;
			&lt;cfthrow message="#arguments.name# is not a recognized component."&gt;
		&lt;/cfdefaultcase&gt;
		
	&lt;/cfswitch&gt;
	
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;	
</code>

All I've done is created a function that - based on a name passed in, will return an instance of the component. Where things really get nice then is back in the Application.cfc file. Look at the change:


<code>
&lt;cffunction name="onApplicationStart" returnType="boolean" output="false"&gt;
  &lt;cfset application.factory = createOject("component", "cfcs.factory")&gt;
  &lt;cfset application.ship = application.factory.getComponent("ship")&gt;
  &lt;cfset application.soldier = application.factory.getComponent("soldier")&gt;
  &lt;cfset application.planet = application.factory.getComponent("planet")&gt;
  &lt;cfset application.player = application.factory.getComponent("player")&gt;
  &lt;cfset application.ruleset = application.factory.getComponent("ruleset")&gt;
  &lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>

Wow - a lot simpler, right? And if a component's needs change - I can edit the factory and not change anything else in Application.cfc.

What this <i>doesn't</i> yet fix are two issues: How do my CFCs, which each needs instances of each other, get their instances? Sure they can also use application.factory, but that breaks encapsulation. Secondly - my factory makes a new instance of a CFC for every request. Is there anyway to make that nicer?

To be continued...