---
layout: post
title: "Picking randomly but not from the last few choices"
date: "2011-01-22T15:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/01/22/Picking-randomly-but-not-from-the-last-few-choices
guid: 4090
---

A few nights ago I was playing Call of Duty Black Ops with some friends of mine. (And despite what they say - I'm a darn good player and always come out with a positive Kill to Death ratio. Honest.) For those of you who haven't done an online game like Black Ops, the basic idea is that you play a round with your friends against a random "room" of people. Each match lasts a few minutes and in the next round a different map will be chosen for you to play with. I greatly simplified that but hopefully those of you who have managed to escape the addiction will get the basics.

<p>

So as I said - each game consists of a random map. The game is <i>supposed</i> to pick a map that you didn't play in the last round. Sometimes though - inexplicably - the game does just that. On the other side - sometimes it seems like we will have a play session for a few hours and some maps are <i>never</i> chosen.

<p>

As you can imagine, this tends to bug us and becomes something of a hot topic while we play. Being the big nerd I am I spent some time thinking about the code behind choosing the next map. It would be trivial to pick random maps from a list until each map has been chosen. (And if folks want to see an example of that in ColdFusion, just ask.) But it seems like Black Ops tries to do something a bit different. It feels random - but you get repeats. When things work well, you don't repeat a map you just played, but you may repeat a map before another map you <i>haven't</i> hit is picked. As I said, Black Ops seems a bit broken but I can kinda get what it is attempting to do. (And for those of you who play, yes, I'm ignoring the vote system.) 

<p>

So I gave this some thought and came up with what I thought would be a good formula:

<p>

Given a set of maps (or any random object) N.<br/>
We want to remember the last few choices.<br/>
We will remember Size of N/2 items.<br/>
When picking a new item, it must not be in the Remember list.<br/>
When chosen, add the item to the Remember list.<br/>
If the Remember list is bigger than Size of N/2, pop off the oldest one.<br/>

<p>

Make sense? Here is an example. Given a set of 10 maps, we will remember the last 5 played. So when a new map is chosen, it is randomly chosen from the list but it cannot be in the last 5. We then add that to the last 5 and pop off the 1st game you played. Here is the ColdFusion code I wrote up. It supports a list of 1 or 2 items which is a bit dumb but I wanted to be complete.

<p>

<code>
&lt;cfset gameList = ['Array', 'Cracked', 'Crisis', 'Firing Range', 'Grid', 'Hanoi', 'Havana', 'Jungle', 'Launch', 'Nuke Town', 'Radiation', 'Villa', 'WMD']&gt;

&lt;cfset recentGames = []&gt;
&lt;cfset recentGameSize = fix(arrayLen(gameList)/2)&gt;

&lt;cfoutput&gt;Size of recentGames queue will be #recentGameSize#&lt;p&gt;&lt;/cfoutput&gt;

&lt;!--- run 100 tests ---&gt;
&lt;cfloop index="x" from="1" to="100"&gt;

	&lt;!--- If size of games is 1 always return it ---&gt;
	&lt;cfif arrayLen(gameList) is 1&gt;
		&lt;cfset picked = gameList[1]&gt;
	&lt;!--- If size is 2, it's very simple logic ---&gt;
	&lt;cfelseif arrayLen(gameList) is 2&gt;
		&lt;cfloop index="y" from="1" to="#arrayLen(gameList)#"&gt;
			&lt;cfif gameList[y] neq recentGames[1]&gt;
				&lt;cfset picked = gameList[y]&gt;
				&lt;cfset recentGames[1] = picked&gt;
				&lt;cfbreak&gt;
			&lt;/cfif&gt;
		&lt;/cfloop&gt;
	&lt;!--- Interesting logic is here. ---&gt;
	&lt;cfelse&gt;
		&lt;cfset picked = ""&gt;
		&lt;cfloop condition="picked eq ''"&gt;
			&lt;cfset possiblePick = gameList[randRange(1, arrayLen(gameList))]&gt;
			&lt;cfif not arrayFind(recentGames, possiblePick)&gt;
				&lt;cfset picked = possiblePick&gt;
				&lt;cfset arrayPrepend(recentGames, picked)&gt;
				&lt;cfif arrayLen(recentGames) gt recentGameSize&gt;
					&lt;cfset arrayDeleteAt(recentGames, recentGameSize+1)&gt;
				&lt;/cfif&gt;
			&lt;/cfif&gt;
		&lt;/cfloop&gt;
	&lt;/cfif&gt;

	&lt;cfoutput&gt;
		&lt;cfif picked is "Nuke Town"&gt;&lt;b&gt;&lt;/cfif&gt;
		For round #x# picked was #picked#
		&lt;cfif picked is "Nuke Town"&gt;&lt;/b&gt;&lt;/cfif&gt;
		&lt;br/&gt;
	&lt;/cfoutput&gt;
	&lt;cfflush&gt;
&lt;/cfloop&gt;
</code>

<p>

To see an example of this action, click the Demo button below. I made one map, "Nuke Town", bold, as a way to see how often it would show up. (And it just so happens that this is one mine and my friends favorite maps.)

<p>

<a href="http://www.raymondcamden.com/demos/jan222011/test.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

Enjoy. I promise my next blog entry will contain <i>useful</i> ColdFusion code!