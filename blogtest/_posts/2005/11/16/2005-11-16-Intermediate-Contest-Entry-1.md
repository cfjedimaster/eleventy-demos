---
layout: post
title: "Intermediate Contest Entry 1"
date: "2005-11-16T15:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/16/Intermediate-Contest-Entry-1
guid: 919
---

Our first entry comes from Steve Gustafson. Before reading on, please check his application <a href="http://ray.camdenfamily.com/demos/contest2/sgustafson/blackjack">here</a>. Now that you have played with it a bit, let's take a look at selected portions of the code. Let's start with his Application.cfc file:
<!--more-->
<code>
&lt;cfcomponent output="false"&gt;
    &lt;cfsetting showdebugoutput="NO"&gt;
    &lt;cfscript&gt;
        this.name="gusBlackJack";
        this.sessionManagement = true;
        this.sessionTimeOut = CreateTimeSpan(0,0,20,0);
        this.scriptProtect = true;
    &lt;/cfscript&gt;

    &lt;cffunction name="onApplicationStart"&gt;
    &lt;/cffunction&gt;

    &lt;cffunction name="OnSessionStart"&gt;
        &lt;cfset session.playedCardList = ''&gt;
    &lt;/cffunction&gt;

	&lt;cffunction name="OnRequestStart"&gt;
	   &lt;cfargument name = "request" required="true"/&gt;
       
	&lt;/cffunction&gt;
&lt;/cfcomponent&gt;      
</code>

I want to point out a few lines in particular. First off - notice how he turns off debugging. Why would you do this? ColdFusion debugging can be turned on at the server level, and if you forget to restrict debugging to a particular IP, then everyone in the world will see your debugging information. That's definitely <i>not</i> something you want. I'm a big fan of "Being Anal" in regards to stuff like this. You will notice I do the same in BlogCFC (although I use an Application.cfm file there instead). So - a minor point - but something to keep in mind.

In keeping with the "Being Anal" thread, he also specifies a session timeout and a scriptProtect. Specifying a sessiontimeout is a good idea since in CFMX 7, there was a bug where onSessionEnd wouldn't fire without it. (This has been fixed in 7.01.) <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/wwhelp/wwhimpl/common/html/wwhelp.htm?context=ColdFusion_Documentation&file=part_dev.htm">ScriptProtect</a> is a handy way to easily protect against cross-site scripting. It isn't perfect - but it is still a good idea to use if you aren't sure you are protecting against it in code yourself. 

Now let's take a quick look at index.cfm. I'm only going to point out one thing here and it is more of a minor nit-pick than anything else. The following is from the top of the file, and is not the entire file itself:

<code>
&lt;cfsetting showdebugoutput="No"&gt;
&lt;!--- This section handles the ajax requests ---&gt;
&lt;cfif isDefined('url.action')&gt;
    &lt;cfset bjOBJ = createObject("component","blackjack")/&gt;
    &lt;cfif url.action EQ 'hitMe'&gt;
        &lt;cfset thisRslt = bjObj.dealCard()&gt;
        &lt;cfoutput&gt;#thisRslt#&lt;/cfoutput&gt;&lt;cfabort&gt;
    &lt;cfelseif url.action EQ 'newGame'&gt;
        &lt;cfset thisRslt = bjObj.newGame()&gt;
        &lt;cfoutput&gt;#thisRslt#&lt;/cfoutput&gt;&lt;cfabort&gt;
    &lt;/cfif&gt;    
&lt;/cfif&gt;
&lt;!--- end ajax section ---&gt;
&lt;!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"&gt;
&lt;html&gt;
&lt;head&gt;
	&lt;title&gt;Gus's CF BlackJack&lt;/title&gt;
    &lt;link rel="stylesheet" type="text/css" href="styles.css" /&gt;
    &lt;script src="xmlhttp.js" type="text/javascript"&gt;&lt;/script&gt;
    &lt;script language = "javascript"&gt;
        var playerBank = 100;
        var wager = 0;
        var playerVal = 0;
        var dealerVal = 0;
        var hasAce = 0;
    &lt;/script&gt;
&lt;/head&gt;
</code>

As you can see, he put the code to handle AJAX requests at the top of the file. To me, this doesn't belong here. I'd have a separate file just to handle those requests. Again, this is just my opinion and nothing more. I will, however, harp on something more. Notice how he creates the component for every request. This confused me a bit until I looked at his CFC:

<code>
&lt;cfcomponent displayname="BlackJackByGus" hint="This component handles the backend for the Blackjack Application&gt;"&gt;

    &lt;cffunction name="shuffle" hint="I select a random value" returntype="numeric" access="private" output="No"&gt;
        &lt;cfargument name="maxNum" type="numeric" required="True"&gt;
          &lt;cfreturn RandRange(1, arguments.maxNum)&gt;
    &lt;/cffunction&gt;

    &lt;cffunction name="getSuit" hint="I select the suit to be dealt" returntype="string" output="No" access="private"&gt;
        &lt;cfset suit = shuffle(4)&gt;
        &lt;cfif suit EQ 1&gt;
            &lt;cfset strSuit = 'Spades'&gt;
        &lt;cfelseif suit EQ 2&gt;
            &lt;cfset strSuit = 'Hearts'&gt;        
        &lt;cfelseif suit EQ 3&gt;
            &lt;cfset strSuit = 'Diamonds'&gt;        
        &lt;cfelse&gt;
            &lt;cfset strSuit = 'Clubs'&gt;        
        &lt;/cfif&gt;
        &lt;cfreturn strSuit&gt;
    &lt;/cffunction&gt;

    &lt;cffunction name="getCard" hint="I select the card to be dealt" returntype='numeric' output="No" access="private"&gt;
        &lt;cfset card = shuffle(13)&gt;
        &lt;cfreturn card&gt;
    &lt;/cffunction&gt;    

    &lt;cffunction name="dealCard" hint="I select the card to be dealt" returntype="string" output="No" access="public"&gt;
        &lt;cfset cardNum = getCard()&gt;
        &lt;cfset cardSuit = getSuit()&gt;
        &lt;cfset thisCard = "#cardSuit#_#cardNum#"&gt;
        &lt;cfif ListFind(session.playedCardList, thisCard)&gt;
            &lt;cfreturn dealCard()&gt;        
        &lt;cfelse&gt;
            &lt;cfset session.playedCardList = listAppend(session.playedCardList,thisCard)&gt;
            &lt;cfif cardNum LT 10&gt;
                &lt;cfset cardValue = "#thisCard#{% raw %}|#cardNum#|{% endraw %}#session.playedCardList#"&gt;
            &lt;cfelse&gt;
                &lt;cfset cardValue = "#thisCard#{% raw %}|10|{% endraw %}#session.playedCardList#"&gt;
            &lt;/cfif&gt;

            &lt;cfreturn cardValue&gt;
        &lt;/cfif&gt;
    &lt;/cffunction&gt;

    &lt;cffunction name="newGame" hint="I begin a new game of blackjack" returntype="boolean" output="No" access="public"&gt;
        &lt;cfset session.playedCardList = ''&gt;
    &lt;/cffunction&gt;
&lt;/cfcomponent&gt;
</code>

What worried me was - how is he keeping track of what cards have been dealt. If you look at CFC, you will see that he references a session variable, playedCardList, to store the used cards. Typically, it is a bad idea to reference <i>any</i> outside scope in a CFC. How would I have done this differently? 

First, I would have stored the playedCardList as a variable in the CFC itself. Secondly, I would have then stored the CFC in the session scope. This would kill two birds with one stone. First off - it makes my CFC a bit better in that it is no longer tied to the session scope. If I decide to switch to some other scope, it would be easier since I'm not having to change the CFC itself. Secondly, I would then need to check for the existence of the CFC before creating an instance. This will make the application run a bit quicker since we would only run createObject() once per session. 

Another nit - nowhere in his CFC does he use the var scope, and every method (but shuffle) is missing var statements. In getSuit, for example, this line:

<code>
&lt;cfset suit = shuffle(4)&gt;
</code>

Should be:

<code>
&lt;cfset var suit = shuffle(4)&gt;
</code>

Similar changes are needed in his other methods. This is a serious problem. Not using the var scope can lead to some <i>very</i> hard to debug problems. It's times like this where I wish I could tell CF to be 'strict' and not let me create variables like that. (I know, I know, CF wasn't built for it. ;) 

So, that's it. All in all, this is a nice submission. Good job, Steve!<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fsgustafson%2Ezip'>Download attached file.</a></p>