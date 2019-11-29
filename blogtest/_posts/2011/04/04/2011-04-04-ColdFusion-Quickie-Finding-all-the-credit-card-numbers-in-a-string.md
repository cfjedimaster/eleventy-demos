---
layout: post
title: "ColdFusion Quickie: Finding all the credit card numbers in a string"
date: "2011-04-04T12:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/04/04/ColdFusion-Quickie-Finding-all-the-credit-card-numbers-in-a-string
guid: 4184
---

My coworker just asked for a quick way to find all the credit cards in a string. Here is a script I wrote up for it. This does <i>not</i> apply the Luhn algorithm on the results. It simply looks for 16 numbers in a row or 4 sets of 4 digits separated by a space. One nice thing you might like - and might not have seen before - is the use of reMatch, which finds, and returns, all the matches of a regex in a string. I'm sure someone is going to come around and write this 10x better, so consider it a challenge. ;)

<p>

<code>
&lt;cfsavecontent variable="source"&gt;
This is some text with 8902 1248 2381 3821 some crap in it. This
line will have 5, not 4, but we should still match the four 9999 8902 1248 2381 3821. And
now let's just do 16 in a row 4719209812347891 and then 15 471920981234789 and then 17 - 47192098123478910.
Testing my word boundary 1719209812347891.
&lt;/cfsavecontent&gt;

&lt;cfset reg = "\b[[:digit:]]{% raw %}{16,16}{% endraw %}\b"&gt;

&lt;cfdump var="#reMatch(reg, source)#"&gt;

&lt;cfset reg2 = "\b[[:digit:]]{% raw %}{4,4}{% endraw %} [[:digit:]]{% raw %}{4,4}{% endraw %} [[:digit:]]{% raw %}{4,4}{% endraw %} [[:digit:]]{% raw %}{4,4}{% endraw %}\b"&gt;
&lt;cfdump var="#reMatch(reg2, source)#"&gt;

&lt;cfset megareg = "#reg#|#reg2#"&gt;
&lt;cfdump var="#reMatch(megareg, source)#"&gt;
</code>

<p>

Note - the first two dumps were simply for testing. If you just wanted the final result you would only run the last call.