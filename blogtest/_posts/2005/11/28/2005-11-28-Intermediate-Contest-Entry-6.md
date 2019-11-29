---
layout: post
title: "Intermediate Contest Entry 6"
date: "2005-11-28T16:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/28/Intermediate-Contest-Entry-6
guid: 941
---

Welcome to the sixth entry in the <a href="http://ray.camdenfamily.com/index.cfm/2005/10/30/Intermediate-ColdFusion-Contest">Intermediate ColdFusion Contest</a>. The earlier entries may be found at the end of this post. Today's entry is from Daniel Ness. Before reading on, please check his application <a href="http://ray.camdenfamily.com/demos/contest2/blackjack_dness">here</a>. You can download his code from the download link at the bottom. Please respect the copyright of the creator.
<!--more-->
So - I like the background. Not important - but I thought it was cool. I'm not sure why, but this Blackjack game seemed to beat the pants off of me. I'd say the dealer won three out of four hands. I also have to admit to not getting what "Ante" met at first. As I said though, I'm not much of a card player. 

Let's now dig into the code a bit. I noticed a few problems right off the bat with his Application.cfc file. It is a bit short so I'll paste it all here:

<code>
&lt;cfcomponent output="false"&gt;
	&lt;!--- New application object, with timeout and sessions ---&gt;
	&lt;cfset this.name="blackjack_dness"&gt;
	&lt;cfset application.highscore=1000&gt;
	&lt;cfset this.applicationTimeout=createTimeSpan(0,12,0,0)&gt;
	&lt;cfset this.sessionManagement=true&gt;

	&lt;cffunction name="onRequestStart" returntype="void" output="false"&gt;
		&lt;!--- If we need a new session, or they want to restart the session, go here ---&gt;
		&lt;cfif not isDefined("application.highscore") or isDefined("url.AppRestart")&gt;
			&lt;cfset application.highscore=1000&gt;
		&lt;/cfif&gt;
		&lt;cfif not isDefined("session.blackjack") or isDefined("url.restart")&gt;
			&lt;!--- We store all the information in the session struct. ---&gt;
			&lt;cfset session.blackjack = createObject("component","cfc.blackjack").init()&gt;
			&lt;cfset session.dealer    = createObject("component","cfc.blackjackplayer").init()&gt;
			&lt;cfset session.player    = createObject("component","cfc.blackjackplayer").init()&gt;
		&lt;/cfif&gt;
	&lt;/cffunction&gt;
&lt;/cfcomponent&gt;
</code>

The main problem I have is that he is using the Application.cfc file - but not really using the <i>power</i> of it. Notice how he defines variables in both the Application and Session scope - but he does so in the onRequestStart method. These values should be set in the onApplicationStart and onSessionStart method instead. I mean - sure - they do work here - but why bother using the Application.cfc framework if you don't leverage the power of those methods?

Once again we have a validation problem. He uses JavaScript to validate that your best is not less than zero and not higher than your bank - but he doesn't validate for numbers. This is certainly possible in JavaScript - just takes a bit more work than it would in ColdFusion. Another validation problem - after a hand ends, you can get the dealer to keep sending you cards by just going to (install url)/index.cfm?hitme=now. In this case, there is nothing wrong with the URL variable per se - but the game isn't checking the state before handing out a new card.

Some nit picking from his blackjack.cfc: For the methods that don't return anything, like newHand, he should add a returnType="void". You don't <i>need</i> it, but it makes the code easier to read. In the same method (and in others), he does not use "arguments." before his argument variables. Again - not necessary - but does make the code easier to read. I recommended in an earlier post that all variables should either be Variable scoped (for global CFC variables), Argument scoped, or with no scope to indicated a local variable. Another minor nit - he created a method to return the game's status, but didn't actually use it. Instead, he normally directly accessed the variable. I'd also say he should have added a corresponding set method if he was going to use the get method. All of the above are minor things and I'm sure some folks would disagree, so take the advice with a grain of salt.

Oh - and he didn't var scope. I bet you thought I'd miss that, eh? -grin-

Earlier Entries:
<ul>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/23/Intermediate-Contest-Entry-4">Entry 5</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/21/Intermediate-Contest-Entry-4">Entry 4</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/18/Intermedia-Contest-Entry-3">Entry 3</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/17/Intermediate-Contest-Entry-2">Entry 2</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/16/Intermediate-Contest-Entry-1">Entry 1</a>
</ul><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fblackjack{% raw %}%5Fdness%{% endraw %}2Ezip'>Download attached file.</a></p>