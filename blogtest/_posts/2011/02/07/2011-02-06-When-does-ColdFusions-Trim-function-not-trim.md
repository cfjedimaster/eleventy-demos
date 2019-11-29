---
layout: post
title: "When does ColdFusion's Trim function not trim?"
date: "2011-02-07T10:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/02/07/When-does-ColdFusions-Trim-function-not-trim
guid: 4109
---

Here is a fun little quiz for you. Given a variable S (a number) that you output to screen with dashes like so:

<p>

<code>
&lt;cfoutput&gt;-#s#-&lt;/cfoutput&gt;
</code>

<p>

If you see this:

<p>

 -8 - 

<p>

then what would you expect to happen after you trim it? If you said 8, than you would be right.... <i>most of the time</i>. Assume you did trim it:

<p>

<code>
&lt;cfoutput&gt;-#trim(s)#-&lt;/cfoutput&gt;
</code>

<p>

And you still saw a space? What then? My buddy <a href="http://www.cfsilence.com">Todd</a> ran into this. The first thing that came to mind was special characters. I suggested looping over every character and printing out the character code like so:

<p>

<code>
&lt;cfloop index="x" from="1" to="#len(s)#"&gt;
	&lt;cfset c = mid(s, x, 1)&gt;
	&lt;cfoutput&gt;#c#=#asc(c)#&lt;br/&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

<p>

When Todd did this he saw:

<p>

8=56<br/>
&nbsp;=160

<p>

Yep - a special character. There are a variety of ways to handle this, including the awesomely named <a href="http://www.cflib.org/udf/demoronize">deMoronize</a> at CFLib, but in this case Todd needed to strip out not replace the bad character. I would have used a val() but he needed to look out for ranges as well (1-2) and therefore used a isNumeric check beforehand. I know I've blogged about this before but it definitely still trips us all out so watch out for it.