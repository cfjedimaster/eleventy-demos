---
layout: post
title: "Intermediate Contest Entry 2"
date: "2005-11-17T21:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/17/Intermediate-Contest-Entry-2
guid: 922
---

Welcome to the second entry in the <a href="http://ray.camdenfamily.com/index.cfm/2005/10/30/Intermediate-ColdFusion-Contest">Intermediate ColdFusion Contest</a>. The earlier entry may be found at the end of this post. Today's entry is from Seth Petry-Johnson. Before reading on, please check his application <a href="http://ray.camdenfamily.com/demos/contest2/seth">here</a>. You can download his code from the download link at the bottom. (Remember that his code belongs to him!)
<!--more-->
The first thing I noticed was a bug, a pretty bad one. Being the mischievous person I am, when the game asked me to enter a name, I decided not to. This gave me an infinite URL recursion error. I noticed later on that <i>any</i> error seemded to cause this. I decided to dig right into the code to see where the bug was. Turns out - this was quite the complex little application. To be honest, it took me a while to figure out the problem. This doesn't mean the application was bad - just that I had to spend a few minutes looking into his setup to follow the 'path' of the application. Due to the nature of the bug, I tried cflog. This helped me determine that the problem occurred in blackjack.cfm, not in application.cfm. (At this point, you may want to follow along in the source code.) Specifically, the issue occurred here:

<code>
&lt;!--- advance the game to its next point of user interaction ---&gt;
&lt;cfset session.blackjackGame.play()&gt;
</code>

So I began to peek around and saw quite a sophisticated setup. The Blackjackgame CFC was actually BlackjackGameController.cfc. (One little pet peave - I would probably suggest using variable names close to the CFC file name - especially if you have a CFC with the exact same name that isn't the same as what is actually being stored in the data.) So, as far as I could see, play() wasn't doing anything yet since I was still in 'step 0' of the game so to speak. Returning to blackjack.cfm, I see:

<cfoutput>
<!--- display the next content panel --->
<cfinclude template="BlackjackCFC_content/#session.blackjackGame.getContentPanelName()#">
</cfoutput>

From what I can tell, and this is pretty nice, the controller CFC is dictating which include to run next. This makes perfect sense and is a good approach. So, this method led me to the file, inc_GetPlayInfo.cfm. I can tell by the file name that this is the file asking me for my name (duh). 

Ok - still with me? This file posts to blackjack_actions.cfm. This file also seems to have the only cflocation in the application, so it must be the culprit for the infinite looping. I then noticed this:

<code>
&lt;cfif errorMgr.hasErrors()&gt;
	&lt;cfset session.SavedRequestArgs = Request.args&gt;
	&lt;cfset session.ValidationErrorMgr = errorMgr&gt;
	&lt;cflocation url="#AddQuerystringToUrl(onError, 'GetParamsFromSession=yes&ShowErrorMessages=yes')#" addtoken="no"&gt;
&lt;cfelse&gt;
	&lt;cflocation url="#onNext#" addtoken="no"&gt;
&lt;/cfif&gt;
</code>

I added a cfoutput right before the cflocation, along with a cfabort. I noticed the URL had no file, just a ? with parameters after it. I'd be willing to bet this worked on Seth's box, and that he had IIS, while I was using Apache. So I quickly uploaded it this server, which is IIS, and it worked fine. I know I've had issues with IIS versus Apache before, so I certainly don't blame Seth. I did a bit more digging. He was passing onError to AddQuerystringToUrl. The value of onError should have been the URL to hit. Again, from the same file:

<code>
&lt;cfif IsDefined("Request.args.onError") AND (Len(Trim(Request.args.onError)) GT 0)&gt;
	&lt;cfset onError = Request.args.onError&gt;
&lt;cfelse&gt;
	&lt;cfset onError = CGI.HTTP_REFERER&gt;
&lt;/cfif&gt;
</code>

Turns out - my cgi.http_referer was blank! I'm guessing then what he should do is add a sanity check and maybe default to blackjack.cfm. (Which is what I did. I simply added it in the cflocation.)

So, after all that complaining about one little bug - what do I like. First off - I forgot to mention something on the <a href="http://ray.camdenfamily.com/index.cfm/2005/11/16/Intermediate-Contest-Entry-1">first entry</a> - and this entry has it as well. I really like how both entries show you your card total. This is great for people who may not know the game very well. I'd probably add an option though to turn this off. (But that is way beyond the scope of the original specifications.)

Another thing I like - the validation (once the error handling bug if fixed) seems dead on. I tried a bet of "apple", I tried a bet of "-9", and the application caught them all. One thing it didn't catch was that it allowed a bet of 9.999999999. It seemed to just round it up, which is probably fair. Outside of that - it even seemed to handle the back button well, and my reloading without hitting anything. I may have missed something - but it looks like the application is pretty rock solid. 

Seth's application makes very intense use of CFCs - including a CFC for the game, a playing card, a deck, a player, a blackjack dealer, a card's rank and a card's suit. But wait - there is more. There are also Factory CFCs which help manage those other CFCs. Definitely not a "Uber CFC" like my BlogCFC (which is a good thing!). His system was complex enough for him to provide a <a href="http://ray.camdenfamily.com/demos/contest2/seth/BlackjackCFC/BlackjackCFC_UML.jpg">UML diagram</a>. This is a pretty nice setup, and I encourage folks to download the zip (link below) and look around his setup.

Lastly - and I almost didn't notice this - he uses an ini file to control aspects of the game. Specifically the starting amount and where the dealer stays. Here is his INI file:

<code>
[blackjack]
dealerHitsBelow=17
startingMoney=100.00
</code>

This is nice as it makes tweaking the core aspects of the game something a non-technical person could handle. (I discussed ini files in an <a href="http://ray.camdenfamily.com/index.cfm/2005/8/26/ColdFusion-101-Config-Files-AGoGo">earlier post</a>.)

Earlier Entries:
<ul>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/16/Intermediate-Contest-Entry-1">Entry 1</a>
</ul><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fseth%2Ezip'>Download attached file.</a></p>