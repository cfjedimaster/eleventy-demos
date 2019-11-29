---
layout: post
title: "Ask a Jedi: Coding for Review"
date: "2006-06-15T17:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/06/15/Ask-a-Jedi-Coding-for-Review
guid: 1336
---

John asks:

<blockquote>
I am coding ColdFusion now for over 6 years within different teams. During that time I have found it quite difficult to find the right style of coding to make it easy to review.

Is there general guideline?

Like calling a query qryQueryName or qry_QueryName or qry_queryName or queryName.

It is not about finding the perfect one, but a thought-out one I can relate to the team and this way make debugging easier.
</blockquote>

This is one of those questions that illicit a great deal of responses, so be prepared to get a wealth of opinions. Let me describe my coding style in general.

1) I use tabs instead of spaces. I hate spaces for tabs. Don't know why. I think because I use the keyboard a lot and clicking the right arrow on a tab will move faster than having to go over a set of spaces.

2) I indent all code in conditionals, wrapped tags, etc. I have a few exceptions. I don't always indent the functions of a component. I feel like I should since cffunction is a child of cfcomponent, but at the same time, it seems silly to indent them when the cfcomponent tags make up 1% of the file usually. The main reason for indentation, in my opinion, is to help remember what code belongs to blocks of conditions, loops, etc. 

3) I lower/camel case my code. So I'll do:

<code>
&lt;cfset x = htmlEditFormt(form.fooBar)&gt;
</code>

In the old days I used to capitalize all of my code. I was stupid. I admit it.

4) Variable Names: This was the main focus of your question. In the past I've done the format where the variable types are included in the name. This is called <a href="http://en.wikipedia.org/wiki/Hungarian_notation">Hungarian notation</a>. I don't typically do it. Every now and then I'll slip and name a query something like qPeople, but in general, I don't use it. At first it seems kind of cool, but I guess I always figured if I didn't know what the variable was doing, then maybe something was wrong with my development. If you follow the link above, you will see more criticisms of the notation and I tend to agree with them.

I do believe in good variable names. So peopleList is better than pl. In fact, I'd probably say you should only use one character variables for iterators. (Again though, I've been known to cheat on this rule as well.)

At the end of the day - nothing beats documentation. I've never regretted over-documenting. On the other side, I have regretted not writing enough documentation.