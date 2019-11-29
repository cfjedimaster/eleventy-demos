---
layout: post
title: "Some morbid ColdFusion Birthday fun"
date: "2010-04-08T14:04:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/04/08/Some-morbid-ColdFusion-Birthday-fun
guid: 3775
---

So, many, many, <i>many</i> years ago I built a little web app called the <a href="http://www.deathclock.com">Death Clock</a>. I wrote it in Perl (which is what I began my web dev career in) and dropped it on my free university web space and promptly got kicked off in a week when it "spiked" at about 1000 hits per day. (This was back when web counters were big. I can't describe the excitement I got from reloading my page and seeing the little graphical counter - also a Perl script - incrementing by 5-10 hits.) I rewrote the code in pure JavaScript and then - a few years later - rewrote the site in ColdFusion. I sold that web site close to 6 or 7 years ago, but the code behind it is simple - and fun - so I thought I'd share a quick example today.

<p>
<!--more-->
First off - some background. The idea behind the Death Clock was simple. Based on your birthday, and your gender, you can make a rough <b>guess</b> (and trust me, a <i>lot</i> of people simply didn't get that it was for fun) at when you would die. That by itself isn't that interesting. But I used a bit of code to convert into seconds and then count down from there. Here is a quick example of what I mean. 

<p>

<code>
&lt;cfset bday = createDate(1973,4,8)&gt;
&lt;cfset lifeSpan = 72&gt;

&lt;cfset deathDay = dateAdd("yyyy",lifeSpan,bday)&gt;

&lt;cfoutput&gt;
Your day of death is #dateFormat(deathDay, "full")#.
&lt;p/&gt;
&lt;/cfoutput&gt;

&lt;cfset timeLeft = dateDiff("s",now(),deathDay)&gt;

&lt;cfoutput&gt;
You have #numberFormat(timeLeft)# seconds left to live.
&lt;/cfoutput&gt;
</code>

<p>

So given a birthday of - today (yep, that's me :) and a lifespan of 72 years (for men, and that's probably not accurate now), we can calculate a "death day" by simply using date add. For me that is Saturday, April 8, 2045, which means I'll be able to get a full week of work in at least before I kick the bucket. 

<p>

The next part simply calculates the difference in time - by seconds - between now and then. What's interesting is that back when I first wrote the Death Clock in ColdFusion, the dateDiff function had a small integer maximum. I kept getting the wrong results until I realized it was actually "flipping" over. I switched to getting days and then just multiplied out. 

<p>

Of course, I couldn't just leave it at that without adding a bit of jQuery. In this example I've put up two examples, and added some jQuery to grab the values and decrement them. The addCommas function is courtesy of this <a href="http://www.mredkj.com/javascript/numberFormat.html">blog entry</a>.

<p>

<code>

&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	var foundDoms = $(".numberCounter")
	if(foundDoms.length &gt; 0) setInterval("updateNumbers()", 1000)
})

function updateNumbers() {
	$(".numberCounter").each(function() {
		var currentVal = $(this).text()
		//remove commas from the #
		currentVal = currentVal.replace(/,/g,"")
		if(currentVal &gt; 0) currentVal--
		currentVal = addCommas(currentVal)
		$(this).text(currentVal)		
	})
}

function addCommas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length &gt; 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{% raw %}{3}{% endraw %})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
&lt;/script&gt;

&lt;cfset bday = createDate(1973,4,8)&gt;
&lt;cfset lifeSpan = 72&gt;

&lt;cfset deathDay = dateAdd("yyyy",lifeSpan,bday)&gt;

&lt;cfoutput&gt;
Your day of death is #dateFormat(deathDay, "full")#.
&lt;p/&gt;
&lt;/cfoutput&gt;

&lt;cfset timeLeft = dateDiff("s",now(),deathDay)&gt;

&lt;cfoutput&gt;
You have &lt;span class="numberCounter"&gt;#numberFormat(timeLeft)#&lt;/span&gt; seconds left to live.
&lt;/cfoutput&gt;

&lt;hr/&gt;

&lt;cfset bday = createDate(2010,4,8)&gt;
&lt;cfset lifeSpan = 72&gt;

&lt;cfset deathDay = dateAdd("yyyy",lifeSpan,bday)&gt;

&lt;cfoutput&gt;
Your day of death is #dateFormat(deathDay, "full")#.
&lt;p/&gt;
&lt;/cfoutput&gt;

&lt;cfset timeLeft = dateDiff("s",now(),deathDay)&gt;

&lt;cfoutput&gt;
You have &lt;span class="numberCounter"&gt;#numberFormat(timeLeft)#&lt;/span&gt; seconds left to live.
&lt;/cfoutput&gt;
</code>

<p>

Completely pointless, I know, but if you want to try it yourself, visit here:

<p>

<a href="http://www.raymondcamden.com/demos/apr82010/test4b.cfm?date=4/8/1973">http://www.coldfusionjedi.com/demos/apr82010/test4b.cfm?date=4/8/1973</a>

Tweak the URL to enter your own date (and I spent 2 seconds adding validation so I'm sure it can break pretty easily) and sit back. Time is fleeting. ;)