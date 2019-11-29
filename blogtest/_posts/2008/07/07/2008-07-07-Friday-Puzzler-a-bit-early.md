---
layout: post
title: "Friday Puzzler (a bit early...)"
date: "2008-07-07T14:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/07/07/Friday-Puzzler-a-bit-early
guid: 2920
---

After a bit of a <a href="http://www.vintagecoding.com/blog/2008/06/27/ray-are-you-too-busy/">public call out</a>, I realized it was time to start thinking of the Friday Puzzler again. I came up with what I thought was a fun one, but it ended up being something I thought would be a bit more than 5 minutes. So this Puzzler will be for the entire week, and to sweeten the pot a bit, Ben Forta will be sharing a copy of CFWACK (3rd book) with the winner. This isn't a real 'contest' per se, but just a slightly more intense Friday Puzzler. Ready?
<!--more-->
<img src="https://static.raymondcamden.com/images/cfjedi//lss1.jpg" align="left" style="margin-right:10px;">
The Friday Puzzler will be a Lemonade Stand simulation. The basic idea is simple. Each stand is given a budget of 10 dollars. Each day you will be given a weather prediction (high temp and weather type). Your goal then is to simply determine how many cups of lemonade to make and how much to sell them for. Your code will simply be a UDF. My simulator will run 20 days (the number may change) of iterations. For each day it will call your UDF, get your response, and then determine how well your stand then. Like all weathermen, what is predicted may not actually happen, so you have to take your chances. (Just like real life.) Now for the nitty gritty details.

<ul>
<li>Your UDF must 4 arguments.
<li>The first argument is predictedtemp, a number representing the predicted temperature.
<li>The second argument is predictedweather. This is a string with 4 types of weather. sunny, clear, rain, or storm. Obviously you will sell more lemonade on sunny days.
<li>The third argument is cupprice, or the cost (in cents) per cup of lemonade. This will range from 3 to 8 cents.
<li>The fourth argument is budget. This is how much money (in cents) that you have available.
<li>Your UDF must return a structure. 
<li>One key is pricepercup, which is how much you will sell your lemonade for (in cents).
<li>The other key is numberofcups which is the number of cups to make. <b>Note</b> - if you try to make more cups than your budget allows, your UDF will be killed (drawn and quartered). Also note that you cannot make more than 250 cups. You are only human after all.
<li>Lastly, your UDF must be named ls_X, where X should be your name. This is just to help me organize stuff. So ls_camden would be an example. Yes that's kind of a bad way to name a UDF, but it helps me run my simulator.
</ul>

Here is an example of a seller that is kind of dumb. All it does is make as many cups as possible. It doesn't check the weather at all.

<code>
&lt;cffunction name="ls_aggresiveSeller" output="false" returnType="struct" hint="I sell cheap and make a lot!"&gt;
	&lt;cfargument name="predictedtemp" type="numeric" required="true" hint="Predicted high temp."&gt;
	&lt;cfargument name="predictedweather" type="string" required="true" hint="Predicted weather."&gt;
	&lt;cfargument name="cupprice" type="numeric" required="true" hint="Production price."&gt;
	&lt;cfargument name="budget" type="numeric" required="true" hint="Their total amount of money."&gt;
	
	&lt;cfset var r = {}&gt;
	
	&lt;cfset r.pricepercup = 20&gt;
	&lt;!--- sell as many as possible ---&gt;
	&lt;cfset r.numberofcups = fix(arguments.budget / arguments.cupprice)&gt;

	&lt;!--- production cap is 250 ---&gt;
	&lt;cfset r.numberofcups = min(250, r.numberofcups)&gt;
	
	&lt;cfreturn r&gt;

&lt;/cffunction&gt;
</code>

A smarter function would look at arguments.predictedtemp and arguments.predictedweather and adjust the price (and amount). 

So any interest? Since this is a competitive contest, please email me your UDF. On Friday I'll blog the results. The winner is the one whose function makes the most money. But I'll also share some of the cooler solutions I see. 

Lastly - if anyone wants to throw in another prize or too, be my guest.