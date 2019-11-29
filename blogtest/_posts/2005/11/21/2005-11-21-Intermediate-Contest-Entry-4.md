---
layout: post
title: "Intermediate Contest Entry 4"
date: "2005-11-21T17:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/21/Intermediate-Contest-Entry-4
guid: 927
---

Welcome to the fourth entry in the <a href="http://ray.camdenfamily.com/index.cfm/2005/10/30/Intermediate-ColdFusion-Contest">Intermediate ColdFusion Contest</a>. The earlier entries may be found at the end of this post. Today's entry is from Uipko Berghuis. Before reading on, please check his application <a href="http://ray.camdenfamily.com/demos/contest2/berghuis/blackjack">here</a>. You can download his code from the download link at the bottom. Please respect the copyright of the creator.
<!--more-->
Let's get started. The first thing I noticed about this application was the use of JavaScript prompts for gathering information. I don't know why but I really don't like that. But that's not the end of the world. His other UI choices I like. It is very simple, but it works, although normally I would imagine BANK would be DEALER instead. 

The game worked for me until I ran out of money, and then I got 'stuck' and could no longer restart. Even if I removed the URL variables and simply opened up "index.cfm", after the prompts for my name and the logon, the screen would simply say START. I noticed that it seemed to think I only had 0 credits. I began to dig and discovered that as soon as you made a bet that emptied your purse, the game would abort. It was due to this line here:

<code>
// Check for url cheaters
variables.newGame = url.bet GT variables.player.iCredits OR url.bet LTE 0;
</code>

As the comment says, he was trying to ensure a person wasn't cheating, however, it didn't take into account the case where the player bets it all. If you try to verify this, it is a bit hard to reset the game. You can only reset if the url.action field has a value, and you must add &reset=1. 

Another little nit - in stop.cfm, he does:

<code>
&lt;cfset session = structClear(session)&gt;
</code>

You don't set the result of structClear to the session. Rather, you simply throw away the result:

<code>
&lt;cfset structClear(session)&gt;
</code>

I see in other files he did this correctly. (FYI, I've never heard of the name Uipko, so if you are a girl, forgive me!)

This solution also made use of CFCs. From what I can see - he makes very good use of the var statement and doesn't seem to forget any. He does do a few questionable things in his CFCs though. First off - he uses the This scope for instance data. This is <i>generally</i> frowned upon and most people will tell you to use the Variables scope and write a get/set method to access the data. He also uses the cfproperty tag. This doesn't do anything except add metadata to the CFC, and is (again, generally) only typically used in web services. I'd normally suggest against both of these techniques. Oh - one more thing about the CFCs. I noticed a few had output="true" where he wasn't really outputting anything. This isn't the end of the word, but will create extra whitespace. (Somewhere... out there.... a poor country is yearning, begging, pleading for whitespace. ColdFusion is there to meet that need!)

So, as before, let me hear what other's think, and you can download the code from the link below. See it, Tony? It's maybe two inches lower. See it? Right there? No, not there Tony, there. (Sorry, that's the last Tony in-joke I'll make. I promise!)

Earlier Entries:
<ul>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/18/Intermedia-Contest-Entry-3">Entry 3</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/17/Intermediate-Contest-Entry-2">Entry 2</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/16/Intermediate-Contest-Entry-1">Entry 1</a>
</ul>

This is the fourth entry. We have eight more to go. My feeling is that I'll get one more done this week, and then four or so next week, with a wrap up in early December, just in time to start the Advanced/Jedi/Guru/Warlord/ThunderTiki/etc contest - just in case you were worried you would be bored over the Christmas holidays. ;)<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fberghuis%2Ezip'>Download attached file.</a></p>