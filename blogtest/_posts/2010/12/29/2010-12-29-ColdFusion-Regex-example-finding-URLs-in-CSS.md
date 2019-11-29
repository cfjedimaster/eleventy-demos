---
layout: post
title: "ColdFusion Regex example - finding URLs in CSS"
date: "2010-12-29T14:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/12/29/ColdFusion-Regex-example-finding-URLs-in-CSS
guid: 4066
---

<a href="http://www.cfsilence.com">Todd Sharp</a> and I were talking today about finding URLs within CSS. Specifically - things in the format of url(...). For example (and yes, I know this is a bad CSS example since it repeats the same ID, but I built it up with cut and paste):

<p>

<code>
#id{
background-image: url('foo.jpg');
}

#id{
background-image: url('goo.jpg');
}


#id{
background-image: url('doo.jpg');
}
</code>

<p>

Todd had the following regex courtesy of a <a href="http://www.bennadel.com/blog/1137-CSSRule-cfc-Parsing-CSS-Rules-In-ColdFusion.htm">blog post by Ben Nadel</a>: 

<p>

<code>
url\([^\)]+\)
</code>

<p>

And while this can return all the instances, it also includes the wrapping url(). I don't believe what Todd wanted could be done in one function call, but there are a few ways we could do it in a loop. Here is what i came up with.
<!--more-->
<p>

<code>
&lt;cfsavecontent variable="s"&gt;
#id{
background-image: url('foo.jpg');
}

#id{
background-image: url('goo.jpg');
}


#id{
background-image: url('doo.jpg');
}

&lt;/cfsavecontent&gt;

&lt;cfset matches = reFind("url\(([^\)]+)\)",s, 1, true)&gt;
&lt;cfloop condition="matches.pos[1] gt 1"&gt;
	&lt;cfset match = mid(s, matches.pos[2], matches.len[2])&gt;
	&lt;cfset match = rereplace(match,"['""]", "", "all")&gt;
	&lt;cfoutput&gt;
		match was #match#&lt;p&gt;
	&lt;/cfoutput&gt;
	&lt;cfset matches = reFind("url\(([^\)]+)\)",s, matches.pos[1]+matches.len[1], true)&gt;
&lt;/cfloop&gt;
</code>

<p>

Basically I just use a conditioned loop and reFind. Note the use of the fourth argument to ensure I get subexpressions back. It may be hard to see, but I modified Ben's regex to add an additional ( and ) around the 'inner' portion of the match. The result of my reFind call will be both the <i>entire</i> match as well as the inner match. I do one more quick regex replacement to get rid of the single or double quotes (and I'm pretty sure this could be done in the original regex instead, but it's one more line so I won't be losing any sleep over it), and then I output the result. Given the sample string above, my results are:

<p>

<blockquote>
match was foo.jpg<br/>
match was goo.jpg<br/>
match was doo.jpg<br/>
</blockquote>