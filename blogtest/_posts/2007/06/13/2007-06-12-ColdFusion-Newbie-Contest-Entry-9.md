---
layout: post
title: "ColdFusion Newbie Contest - Entry 9"
date: "2007-06-13T10:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/13/ColdFusion-Newbie-Contest-Entry-9
guid: 2118
---

Welcome to the second to last entry in my <a href="http://www.raymondcamden.com/index.cfm/2007/4/16/ColdFusion-Newbie-Contest-Announced--Monster-Maker">ColdFusion Newbie contest</a>. I should be hitting up the last one tonight and announcing a winner tomorrow or Friday. These last two took a while because I wasn't able to get them running locally. Now normally that would be a disqualification. But - as both of these submissions had online versions, I decided to give them a review and include them in.
<!--more-->
The first entry is <a href="http://cf.bigfatdesigns.com/">Big Fat Monster</a> from Nick Sweeney. The link in the previous sentence goes to the online version of the game. As with some of the other entries, the design is really nice. I hope these guys aren't cheating and using other designers. (And I swear I'm not jealous. Really.) You will have to register first and then log in. Once you do, you can create a monster with a few basic skins. There is a "Hall of Fame" on the home page which is pretty darn cool. Another cool feature is that your monster apparently gets into battles by itself while you are out. Now my list of "while you were out" battles included battles I actually participated in, so I'm not sure how that feature works. Once working with your monster, you have a pet, feed, nap, and fight option. The fighting is rather simple. You select an enemy and cross your fingers. There is also a cute "mBay" button to buy items, but I never saw any items there. (So it turns out this is a browser issue. I did a view
source and saw items, but I never saw them in Firefox. I bet it works for IE. Now Nick definitely can't win! ;)


When registering, I noticed that JavaScript was used to validate the form. What is the first thing we when we see a JS checked form, boys and girls? Turn off JS of course. This not only led to an error, it led to an error that revealed the code. This shows two problems here. First - no server side validation, and secondly, the 'Enable Robust Exception' information was turned on. Actually there are three problems - there was no general error handler defined for the application. The last two items could be fixed in about five minutes and regular readers of my blog know that I tend to harp on these subjects. 

Digging into the code - I first noticed a full path in Application.cfm. This was a big problem in <a href="http://www.coldfusionjedi.com/index.cfm/2007/5/31/ColdFusion-Newbie-Contest--Entry-7">entry 7</a>, so I've been keeping an eye out for it in other entries. As a reminder - anytime you hard code a path in your code your making it more difficult for you to move the code in the future. Keep that in mind.

Moving into index.cfm, I immediately see this:

<code>
&lt;cfinvoke
	Component="Battles"
	Method="listBattles"
	ResultsLimit="50"
	Returnvariable="BattleList"&gt;
</code>

Which makes me wonder why an Application scoped CFC isn't being used instead. The CFC in question also lacks var scoping and output control. Although the var scope issue may be less of a problem since his CFC isn't cached, it is still something that can be fixed. I've been complaining about this in almost all the entries, but here is a quick example so you can see exactly what I mean:

<code>
&lt;cffunction 
	name="TodaysBattles"
	returntype="query"
	hint="Returns Todays Battles"&gt;

	&lt;cfargument name="ForMonster" required="yes" default=""&gt;
	&lt;cfset BattleDay = DateAdd("d",-1,Now())&gt; 
	&lt;cfquery name="qryGetBattles" datasource="#REQUEST.DataSource#"&gt;
		SELECT BigFatMonsterBattles.*
		FROM BigFatMonsterBattles
		Where BigFatMonsterBattles.AttackerID = #ARGUMENTS.ForMonster#
		AND BigFatMonsterBattles.BattleTime &gt;= #BattleDay#
		ORDER By BigFatMonsterBattles.BattleTime DESC
	&lt;/cfquery&gt;

	&lt;cfreturn qryGetBattles&gt;
&lt;/cffunction&gt;
</code>

In this case, all that is needed is to add two var statements. I'm also going to restrict the output and use cfqueryparam:

<code>
&lt;cffunction 
	name="TodaysBattles"
	returntype="query"
	hint="Returns Todays Battles" output="false"&gt;

	&lt;cfargument name="ForMonster" required="yes" default=""&gt;
	&lt;cfset var qryGetBattles = ""&gt;
	&lt;cfset var BattleDay = DateAdd("d",-1,Now())&gt; 
		
	&lt;cfquery name="qryGetBattles" datasource="#REQUEST.DataSource#"&gt;
		SELECT BigFatMonsterBattles.*
		FROM BigFatMonsterBattles
		Where BigFatMonsterBattles.AttackerID = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#ARGUMENTS.ForMonster#"&gt;
		AND BigFatMonsterBattles.BattleTime &gt;=&lt;cfqueryparam cfsqltype="cf_sql_timestamp" value="#BattleDay#"&gt;
		ORDER By BigFatMonsterBattles.BattleTime DESC
	&lt;/cfquery&gt;

	&lt;cfreturn qryGetBattles&gt;
&lt;/cffunction&gt;
</code>

Another problem I saw - and this really speaks to a common theme I'm seeing in this entry - is in monster_list.cfm. This is the main file run when working with your monster. In order to use this page you must be logged in. His code though does something like this:

<code>
&lt;ciff logged in&gt;
lots of code
&lt;cfelse&gt;
link to let the user log in
&lt;/cfif&gt;
</code>

This is a mistake to me. First off - the Application.cfm file really should be handling this logic. Secondly, from just a readability standpoint, if I see a file that is 95% CFIF block then I see a problem. In general I try to avoid files like that. If I can't use Application.cfm (the CFIF may not be security related), I'll swap my CFIF logic to something more like this:

<code>
&lt;cfif not X&gt;
blah
&lt;cfabort&gt;
&lt;/cfif&gt;
rest of page
</code>

One cool thing - the cfchart usage. This was also done well in  <a href="http://www.coldfusionjedi.com/index.cfm/2007/5/31/ColdFusion-Newbie-Contest--Entry-7">entry 7</a> and I think serves as a reminder about how nice this feature is. As far as I know it wasn't updated for ColdFusion 8, which is unfortunate, but it is pretty powerful as is.

I was rather surprised by the code in monster_battle.cfm. I encourage folks to take a look at it. Apparently Nick used formulas from Diablo II and the code is an interesting read. I find it odd that he mixes in queries and CFCs calls though. This should all be in a CFC - but check the file out. It is definitely worth the time.

One big issue in monster_battle.cfm - notice that the monster value is passed in via URL parameter. Guess what happens if you change the value? No validation. I was able to make the code throw an error by just changing the ID to 1.

The last thing I'll point out is monster_action.cfm. This is the file that processes your actions. One of the things I noticed was a status code for the monster. So for example, if the status of your monster was 90-99, it meant it was dead. This leads to code that looks like so:

<code>
&lt;!--- Make Sure The Monster Is NOT Dead - Then Do the work ---&gt;
&lt;cfif #ThisMonster.MonsterStatus# LTE 89&gt;
</code>

Can folks see the problem here? It isn't so much that a number is being used - but rather a hard coded number. I would have rewritten this more like so:

<code>
&lt;!--- Make Sure The Monster Is NOT Dead - Then Do the work ---&gt;
&lt;cfif thisMonster.isAlive()&gt;
</code>

Abstract away the "is alive" logic. This is especially important since he repeats the logic multiple times on the page, and I'm sure throughout the application.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FforRay%{% endraw %}2Ezip'>Download attached file.</a></p>