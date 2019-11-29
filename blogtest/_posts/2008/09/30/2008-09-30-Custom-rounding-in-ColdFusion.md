---
layout: post
title: "Custom rounding in ColdFusion"
date: "2008-09-30T11:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/09/30/Custom-rounding-in-ColdFusion
guid: 3036
---

Yesterday a friend asked an interesting question. Normal rounding is based on the rule we are familiar with. Anything decimal point that is 5 and higher will round up to the next number. So 11.5 becomes 12. My friend though had a client who wanted to change the rules. Instead of rounding on 5, they wanted to round on 4. So 11.4 would become 12. 11.39 would round down to 11. Sounded weird to me, but maybe that's what the Wall Street folks have been doing lately.
<!--more-->
I whipped up a quick function that treated numbers like strings:

<code>
function myRound2(x)  {
	if(listLen(x,".") is 1) return x;
	if(left(listLast(x, "."),1) &gt;= 4) return incrementValue(listFirst(x,"."));
	return listFirst(x,".");
}
</code>

This worked fine until he tested with a negative number. He came back with a nicer solution (makes me wonder if he will ever ask me again for help!) that worked in all cases:

<code>
function myRound(x) {
if (abs(x - int(x)) &gt;= .40) return ceiling(x);
else return int(x);
}
</code>

His solution correctly handled the negative numbers. You could even make it a bit more abstract:

<code>
function myRound(x,y) {
if (abs(x - int(x)) &gt;= (y/10)) return ceiling(x);
else return int(x);
}
</code>

This will let me pass any value for the rounding limit.

Anyway, I'll use the above as a good springboard to remind folks about unit testing. When he found the issue with my code and negative numbers, it would have been the perfect place to write a unit test to ensure that never became a problem again.