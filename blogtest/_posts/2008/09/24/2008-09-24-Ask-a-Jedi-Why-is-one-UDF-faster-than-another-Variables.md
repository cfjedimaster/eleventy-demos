---
layout: post
title: "Ask a Jedi: Why is one UDF faster than another? Variables?"
date: "2008-09-24T18:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/09/24/Ask-a-Jedi-Why-is-one-UDF-faster-than-another-Variables
guid: 3029
---

Patrick Stormthunder asks:

<blockquote>
<p>
After some testing on my company's site for the purpose of optimization, I came across something that has shaken my faith in, well, variables.  I am hoping you can help me understand these results.
</p>

<p>
What follows is a simple implementation of a "null" value with the test for null (isNull()) written two ways, the first with a variable reference and the second without one.  Running the first test 1000 times takes 7000 milliseconds on my development machine. Running the second test takes 25 milliseconds.
</p>
</blockquote>
<!--more-->
Before showing Patrick's code, I'll say right away that I'm not a big fan of the 'run this code block 1 zillion times' speed test. I don't think it's very reliable or realistic. Yes, I've done it myself, but at the end of the day I think you can do better. As an example of why I don't trust speed tests, when I ran his code, my results were <b>incredibly</b> different. The slow code took, on average, 30ms, while the fast code took about 8ms. At that level, I'd simply not worry about it and use what is more appropriate/better written/etc. Let's take a quick look at his code though:

<code>
cfset variables.null="{% raw %}|\|{% endraw %} {% raw %}|_|{% endraw %} {% raw %}|_ |{% endraw %}_"/&gt;

&lt;cffunction name="isNull" hint="is the valueless?" access="public" output="false"&gt;
       &lt;cfargument name="value" required="true" /&gt;
       &lt;cfreturn arguments.value EQ variables.null /&gt;
&lt;/cffunction&gt;

&lt;cftimer label="test1"&gt;
&lt;cfloop index="i" from="0" to="1000"&gt;
&lt;cfset myTestVar=isNull(i) /&gt;
&lt;/cfloop&gt;
&lt;/cftimer&gt;

&lt;cfset variables.null="{% raw %}|\|{% endraw %} {% raw %}|_|{% endraw %} {% raw %}|_ |{% endraw %}_"/&gt;

&lt;cffunction name="isNull2" hint="is the valueless?" access="public" output="false"&gt;
       &lt;cfargument name="value" required="true" /&gt;
&lt;cfreturn arguments.value EQ "{% raw %}|\|{% endraw %} {% raw %}|_|{% endraw %} {% raw %}|_ |{% endraw %}_" /&gt;
&lt;/cffunction&gt;

&lt;cftimer label="test2"&gt;
&lt;cfloop index="i" from="0" to="1000"&gt;
       &lt;cfset myTestVar=isNull2(i) /&gt;
&lt;/cfloop&gt;
&lt;/cftimer&gt;
</code>

As you can see - he has two UDFs. Each takes a value and compares it to a null variable which is a string. The first UDF is the slow one - but as I said, even though my test showed it to be about 3 times as slow, it was still around 30 ms. What bugs me though and what I think is more important is the break of proper encapsulation. The UDF directly accesses the outside Variables scope, and shoot, perhaps that is the reason for the slow down. Either way, even if the speed tests were reversed, I'd recommend the second UDF simply because it is better written and more encapsulated. 

Oh a whim I went ahead and added a third test:

<code>
&lt;cftimer label="test3"&gt;
&lt;cfloop index="i" from="0" to="1000"&gt;
	&lt;cfset someres = (i eq variables.null)&gt;
&lt;/cfloop&gt;
&lt;/cftimer&gt;
</code>

This returned results right in the middle of the two UDFs. I then wrote one more test:

<code>
&lt;cftimer label="test4"&gt;
&lt;cfloop index="i" from="0" to="1000"&gt;
	&lt;cfset someres = compare(i, variables.null) is 0&gt;
&lt;/cfloop&gt;
&lt;/cftimer&gt;
</code>

This code block ran the fastest, although only slightly more than the second UDF, and I'm sure if I used compare in the UDF it would catch up. But you know what? I hate compare. I can never remember it's API so at the end of day, I'll use EQ just to make things more readable.

p.s. I'll use this blog entry as another excuse to recommend <a href="http://coldfire.riaforge.org">ColdFire</a>. Check out how nicely displayed the timer results are shown at the bottom my browser:



<img src="https://static.raymondcamden.com/images//Picture 121.png">