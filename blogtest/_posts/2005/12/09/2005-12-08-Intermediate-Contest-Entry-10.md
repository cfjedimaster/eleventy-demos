---
layout: post
title: "Intermediate Contest Entry 10"
date: "2005-12-09T07:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/09/Intermediate-Contest-Entry-10
guid: 962
---

Welcome to the tenth entry in the <a href="http://ray.camdenfamily.com/index.cfm/2005/10/30/Intermediate-ColdFusion-Contest">Intermediate ColdFusion Contest</a>. The earlier entries may be found at the end of this post. Today's entry is from Charlie Griefer. Before reading on, please check his application <a href="http://ray.camdenfamily.com/demos/contest2/cj/blackjack">here</a>. You can download his code from the download link at the bottom. Please respect the copyright of the creator.
<!--more-->
Wow. What a design. I mean - look at that dealer. He looks like a young Tom Cruise. I think this entry will win just for that. ;) Ok, so it's me. Still though, even if it wasn't me, I'd find it pretty darn funny, and cool. It really gives the entry some personality and makes it feel like you are playing <i>with</i> someone, and not just against the computer. I like both the rules box and the Hands Won box. However, the rules box isn't exactly true. The minimum bet is actually 0.1 (10 cents) and you can bet more than 500 dollars (up to 999). There is also no automatic end gate. I got down to 0 dollars (or lower, see below) and the game didn't automatically end. At least though there was a nice and obvious 'start over' button so I wasn't stuck, as I was in some entries.

So obviously I discovered the minimum bet by trying to break the entry. It does handle negative entries, 0 entries, and string entries, but it doesn't give any feedback. I'd make the dealer crack a snide remark or something. I also discovered another problem. Here is some code that spits out JavaScript:

<code>
&lt;script type="text/javascript"&gt;
function validateForm(f) {
	if (isNaN(f.bet.value) {% raw %}|| f.bet.value &lt; 1 |{% endraw %}| f.bet.value &gt; &lt;cfoutput&gt;#variables.theGame.playerCash#&lt;/cfoutput&gt;) {
	f.bet.select();
	return false;
	}
	return true;
}
&lt;/script&gt;
</code>

Notice the portion that checks your bet against your bank? I disabled JavaScript and found I could bet the maximum (999) even though my bank was less than that. A good lesson here - never depend on JavaScript - even if a person (supposedly) can't even begin the game without it. All I did was use the Web Developer toolbar option for Firefox to turn off JavaScript while I was playing. Never, ever depend on JavaScript, especially when money is involved! (Ok, so this time it's fake, but it is still something to keep in mind.) Another thing on this issue - disabling JavaScript also lets me enter a string for a bet, which then makes the application throw an error. Sorry for harping on this, but I think you see why!

Outside of this - I didn't see much to complain about. I did find one un-VARed method variable in the init method ("deck"), but I believe that was the only variable he forgot to correctly scope. 

I noticed this in his getRaySays method:
<code>
&lt;!--- i know this whole method sucks.  by the time I realized it, was too late to turn back (deadlines and all, y'know).  should have set this variable throughout the CFC so as not to have to re-do all of this logic.  look for improvement in version 2.0! ---&gt;
</code>

Rest easy, Charlie. I've done the same thing. One nice thing about CFC development is you can write 'bad' methods and come back to them later. You can also (and this may be obvious) write completely fake methods. I.e., imagine the game loaded your bank from a database, and the database wasn't written. You could easily just make a method that returned 100, a hard coded value, and return to the method later once the database is set up. Again - this may be obvious - but it is something to keep in mind. Another example - imagine one method needed some complex math, like it needed to return the distance between two zip codes. You can always make the method return some number and then return to the method once you have the math ready. 

One last question. I notice he pays 1.5 times your bet on Blackjack. If I bet 3 dollars, this would mean I'd win 4.50. Do casinos do that normally, or do they round down (or up)?

Earlier Entries:
<ul>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/12/7/Intermediate-Contest-Entry-9">Entry 9</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/12/1/Intermediate-Contest-Entry-8">Entry 8</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/29/Intermediate-Contest-Entry-7">Entry 7</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/28/Intermediate-Contest-Entry-6">Entry 6</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/23/Intermediate-Contest-Entry-4">Entry 5</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/21/Intermediate-Contest-Entry-4">Entry 4</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/18/Intermedia-Contest-Entry-3">Entry 3</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/17/Intermediate-Contest-Entry-2">Entry 2</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/16/Intermediate-Contest-Entry-1">Entry 1</a>
</ul><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fcj%2Ezip'>Download attached file.</a></p>