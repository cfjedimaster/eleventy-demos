---
layout: post
title: "Intermediate Contest Entry 11"
date: "2005-12-12T18:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/12/Intermediate-Contest-Entry-10
guid: 968
---

Welcome to the eleventh entry in the <a href="http://ray.camdenfamily.com/index.cfm/2005/10/30/Intermediate-ColdFusion-Contest">Intermediate ColdFusion Contest</a>. (Only one more to go after this!) The earlier entries may be found at the end of this post. Today's entry is from Tony Weeg. Before reading on, please check his application <a href="http://ray.camdenfamily.com/demos/contest2/weeg">here</a>. You can download his code from the download link at the bottom. Please respect the copyright of the creator.
<!--more-->
So far - this is my favorite design - although it gets points off for the buttons being a bit confusing. I had to ask Tony what the ^ button did. (It increases your bet by whatever button you had hit last.) Outside of that - I love the look of this entry. Now - in previous entries I spoke about how you can't trust JavaScript. I quickly found two ways to break this application. First - the bet is a read only form field. However, the Web Developer extension for Firefox let's me turn that setting off. Remember when I said to not trust JavaScript? You can't trust read only form fields either. When I changed the value to a string, the application immediately threw an error. Oh - and guess what happens if you enter a negative number? I entered -99999999. I then made myself lose by hitting too much. Then my bank was nice and rich. 

The second way to break the application was in the initial screen. When it asks for the amount of money to start with, you can enter a string, and the application correctly ignores it. (Although it should probably tell you instead.) However - you are allowed to enter both 0 and a negative number. The game doesn't crash though - it just asks for more money. (Hey, just like a real casino!)

Ok, so let's dig into the code. Like an earlier entry, he resets his application variables on every hit. Not every variable, but still, none should be reset once set. He also creates card data from XML, which he does using cfsavecontent. He could have used cfxml as well. I normally would have placed the XML outside Application.cfm. But that's just a personal preference. His XML does seem a bit unnecessary though. Let me stop talking about it and show it for those who can't download the code:

<code>
&lt;cfsavecontent variable="application.cardsXML"&gt;&lt;?xml version='1.0' encoding='ISO-8859-1' ?&gt;&lt;cards&gt;
	&lt;Clubs&gt;
		&lt;Ace&gt;1&lt;/Ace&gt;
		&lt;King&gt;5&lt;/King&gt;
		&lt;Queen&gt;9&lt;/Queen&gt;		
		&lt;Jack&gt;13&lt;/Jack&gt;				
		&lt;Ten&gt;17&lt;/Ten&gt;
		&lt;Nine&gt;21&lt;/Nine&gt;
		&lt;Eight&gt;25&lt;/Eight&gt;
		&lt;Seven&gt;29&lt;/Seven&gt;
		&lt;Six&gt;33&lt;/Six&gt;
		&lt;Five&gt;37&lt;/Five&gt;
		&lt;Four&gt;41&lt;/Four&gt;
		&lt;Three&gt;45&lt;/Three&gt;
		&lt;Two&gt;49&lt;/Two&gt;
	&lt;/Clubs&gt;
	&lt;Spades&gt;
		&lt;Ace&gt;2&lt;/Ace&gt;
		&lt;King&gt;6&lt;/King&gt;
		&lt;Queen&gt;10&lt;/Queen&gt;		
		&lt;Jack&gt;14&lt;/Jack&gt;				
		&lt;Ten&gt;18&lt;/Ten&gt;
		&lt;Nine&gt;22&lt;/Nine&gt;
		&lt;Eight&gt;26&lt;/Eight&gt;
		&lt;Seven&gt;30&lt;/Seven&gt;
		&lt;Six&gt;34&lt;/Six&gt;
		&lt;Five&gt;38&lt;/Five&gt;
		&lt;Four&gt;42&lt;/Four&gt;
		&lt;Three&gt;46&lt;/Three&gt;
		&lt;Two&gt;50&lt;/Two&gt;
	&lt;/Spades&gt;
	&lt;Hearts&gt;
		&lt;Ace&gt;3&lt;/Ace&gt;
		&lt;King&gt;7&lt;/King&gt;
		&lt;Queen&gt;11&lt;/Queen&gt;		
		&lt;Jack&gt;15&lt;/Jack&gt;				
		&lt;Ten&gt;19&lt;/Ten&gt;
		&lt;Nine&gt;23&lt;/Nine&gt;
		&lt;Eight&gt;27&lt;/Eight&gt;
		&lt;Seven&gt;31&lt;/Seven&gt;
		&lt;Six&gt;35&lt;/Six&gt;
		&lt;Five&gt;39&lt;/Five&gt;
		&lt;Four&gt;43&lt;/Four&gt;
		&lt;Three&gt;47&lt;/Three&gt;
		&lt;Two&gt;51&lt;/Two&gt;
	&lt;/Hearts&gt;		
	&lt;Diamonds&gt;
		&lt;Ace&gt;4&lt;/Ace&gt;
		&lt;King&gt;8&lt;/King&gt;
		&lt;Queen&gt;12&lt;/Queen&gt;		
		&lt;Jack&gt;16&lt;/Jack&gt;				
		&lt;Ten&gt;20&lt;/Ten&gt;
		&lt;Nine&gt;24&lt;/Nine&gt;
		&lt;Eight&gt;28&lt;/Eight&gt;
		&lt;Seven&gt;32&lt;/Seven&gt;
		&lt;Six&gt;36&lt;/Six&gt;
		&lt;Five&gt;40&lt;/Five&gt;
		&lt;Four&gt;44&lt;/Four&gt;
		&lt;Three&gt;48&lt;/Three&gt;
		&lt;Two&gt;52&lt;/Two&gt;
	&lt;/Diamonds&gt;			
&lt;/cards&gt;&lt;/cfsavecontent&gt;</code>

Looking at this I can't help but wonder if a simple loop could have worked as well. One loop over the suits and one over the string names of the cards. I'm not saying this is bad - I'm just saying there are many ways to skin the cat. 

Something else I noticed - in fullTilt.cfm he has this code block:

<code>
&lt;cfif isDefined("url.clearStartOver") and len(url.clearStartOver)&gt;
	&lt;cfset structDelete(session,"player")&gt;
	&lt;cfset structDelete(session,"dealer")&gt;		
	&lt;cfset structDelete(session,"yourName")&gt;			
	&lt;cfset structDelete(session,"lastBetValue")&gt;
	&lt;cfset structDelete(session,"gameInProgress")&gt;	
	&lt;cfset structDelete(session,"winnerDisplay")&gt;	
	&lt;cfset structDelete(session,"youAlreadyWon")&gt;		
	&lt;cfset structDelete(session,"bankValue")&gt;	
	&lt;cfset structDelete(session,"bankValueForDisplay")&gt;			
	&lt;cfset structDelete(session,"gameOver")&gt;				
	&lt;cflocation url="fullTilt.cfm?step=welcomeToTheTable"&gt;
&lt;/cfif&gt;

&lt;cfif isDefined("url.makeDeposit") and len(url.makeDeposit)&gt;
	&lt;cfset structDelete(session,"player")&gt;
	&lt;cfset structDelete(session,"dealer")&gt;		
	&lt;cfset structDelete(session,"lastBetValue")&gt;
	&lt;cfset structDelete(session,"gameInProgress")&gt;	
	&lt;cfset structDelete(session,"winnerDisplay")&gt;	
	&lt;cfset structDelete(session,"youAlreadyWon")&gt;		
	&lt;cfset structDelete(session,"bankValue")&gt;	
	&lt;cfset structDelete(session,"bankValueForDisplay")&gt;			
	&lt;cfset structDelete(session,"gameOver")&gt;				
	&lt;cflocation url="fullTilt.cfm?step=makeDeposit"&gt;
&lt;/cfif&gt;
</code>

I would have considered putting the game data in a sub-struct of the Session scope. That way you could nuke the entire game with one structDelete. Or I'd consider making a UDF that does the same as the lines above. That way if you add a new key, you can just update the UDF. (Yes, you can make UDFs that work with the session scope. Normally it is a no-no, but for a utility function like this, I think it would be fine.) Ah - I just reread the code and each block is doing something different. I would still recommend though a more modular approach - again - in case your game data keys change. 

Let's turn to his CFC. As you know, I'm going to complain about the lack of var scoping. Sorry Tony. :) Something else I don't agree with - he loads a file of UDFs into his CFC. Not the end of the world, of course, but if I need to use UDFs like that in a CFC, I typically turn them into a CFC.

What does everyone else think?

Earlier Entries:
<ul>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/12/9/Intermediate-Contest-Entry-10">Entry 10</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/12/7/Intermediate-Contest-Entry-9">Entry 9</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/12/1/Intermediate-Contest-Entry-8">Entry 8</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/29/Intermediate-Contest-Entry-7">Entry 7</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/28/Intermediate-Contest-Entry-6">Entry 6</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/23/Intermediate-Contest-Entry-4">Entry 5</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/21/Intermediate-Contest-Entry-4">Entry 4</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/18/Intermedia-Contest-Entry-3">Entry 3</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/17/Intermediate-Contest-Entry-2">Entry 2</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/16/Intermediate-Contest-Entry-1">Entry 1</a>
</ul><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fweeg%2Ezip'>Download attached file.</a></p>