---
layout: post
title: "Intermediate Contest Entry 5"
date: "2005-11-23T10:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/23/Intermediate-Contest-Entry-4
guid: 935
---

Welcome to the fifth entry in the <a href="http://ray.camdenfamily.com/index.cfm/2005/10/30/Intermediate-ColdFusion-Contest">Intermediate ColdFusion Contest</a>. The earlier entries may be found at the end of this post. Today's entry is from Behrang Noroozinia. Before reading on, please check his application <a href="http://ray.camdenfamily.com/demos/contest2/noroozinia/">here</a>. You can download his code from the download link at the bottom. Please respect the copyright of the creator.

The first thing I noticed about this application was how simple it looked. That is <i>not</i> a complaint. I like simplicity. I like how it defaulted the 10 dollar bet. As I mentioned in an earlier entry, I'm lazy, so I have preferred the entries that didn't make me type in an amount each time.

I tried to break the bet entry box, but it seems like he handled validation very well. I tried Apple, -10, and other things, and they all worked. This entry too accepted 9.9999999999, and I eventually ended up with 0.009999999 cents in my account. I'd probably suggest updating the validation to check the cents value. This could be done easily enough with string functions. To get the cents, you could do: 

<code>
&lt;cfif listLen(bet, ".") is 2 and len(listLast(bet,".")) gte 3&gt;
.....
&lt;/cfif&gt;
</code>

The absolute coolest thing in this game is the history function. This shows you every hand, who won, and how much money was won or lost. <b>Darn</b> nice little feature there.

Now let's dig into his code a bit. The first thing I found was a lack of var scoping in his showHands UDF. I'm sure everyone is tired of hearing me harp on var scoping... well... sorry, I'm not going to stop. Skipping the var scope can lead to <i>very</i> hard to debug issues. I'm going to keep bugging people about it till they pry my dead hangs from the keyboard (hopefully many, many years from now).

He uses CFCs to handle most of the game logic. I noticed quite a bit of try/catch pairs in his index.cfm file, and looking into his CFCs, I see he uses cfthrow to be very particular about user actions. In other words, if you try to hit when you aren't supposed to, the game logic will know it. It seems like he went over the top with his validation, which I think is a good thing.

A minor nit - in his methods that return void, he included a &lt;cfreturn&gt; tag. I normally don't include any &lt;cfreturn&gt; tag, and I believe that would be the generally accepted practice. (At least IMHO.) 

I liked how his Deck.cfc was set up, especially the way cards are handed out. Here is the code:

<code>
&lt;cffunction name="nextCard" access="public" output="false" returntype="Card"&gt;
		
	&lt;cfif variables.nextIndex gt arrayLen(variables.cards)&gt;
		&lt;cfset shuffle()&gt;
	&lt;/cfif&gt;
	&lt;cfset variables.nextIndex = variables.nextIndex + 1&gt;
		
	&lt;cfreturn variables.cards[variables.nextIndex - 1]&gt;
&lt;/cffunction&gt;
</code>

Notice how he returns a Card component - and automatically handles reshuffling if he runs out of cards. This would handle a case where, by some miracle, enough cards were dealt out to empty the deck. While this would/should never happen in a 2 person BJ game, he could easily move his Deck.cfc, and Card.cfc to a Poker game. 

I noticed that in Card.cfc, he used the This scope. I'm guessing he did this to make it easier to output the card values. While I still would have used a get/set method, I can see his reasoning for this.

Earlier Entries:
<ul>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/21/Intermediate-Contest-Entry-4">Entry 4</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/18/Intermedia-Contest-Entry-3">Entry 3</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/17/Intermediate-Contest-Entry-2">Entry 2</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/16/Intermediate-Contest-Entry-1">Entry 1</a>
</ul><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fnoroozinia%2Ezip'>Download attached file.</a></p>