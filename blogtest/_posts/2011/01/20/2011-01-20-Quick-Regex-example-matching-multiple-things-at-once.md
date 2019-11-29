---
layout: post
title: "Quick Regex example - matching multiple things at once"
date: "2011-01-20T18:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/01/20/Quick-Regex-example-matching-multiple-things-at-once
guid: 4088
---

Here is something I've never tried to do before with regex - match multiple "rules" but within one regex. Consider for example password validation. Normally this requires a string pass multiple rules:

<p>

<ul>
<li>Must be N characters long
<li>Must contain lower case characters
<li>Must container upper case characters
</ul>

<p>

I can do any of those rules easily enough but in the past I've done it "long" hand:
<!--more-->
<p>

<code>
&lt;cfset s = ["aaaa","aAa","AAAA","a9", "A9", "aA9","aaaAAA7"]&gt;

&lt;cfloop index="test" array="#s#"&gt;
	&lt;cfoutput&gt;#test# ok? &lt;/cfoutput&gt;
	
	&lt;cfif len(test) gte 7 and reFind("[a-z]", test) and reFind("[A-Z]", test)&gt;
		yes
	&lt;cfelse&gt;
		no
	&lt;/cfif&gt;&lt;br/&gt;
		
&lt;/cfloop&gt;
</code>

<p>

That works - but it seemed like there must be <i>some</i> way with regex to say "I want to ensure A matches, and B, and C, but I don't care where." My Google-fu failed until I came across this excellent blog post: <a href="http://nilangshah.wordpress.com/2007/06/26/password-validation-via-regular-expression/">Password Validation via Regular Expression</a>. In this blog entry, Nilang Shah, makes use of a "positive lookahead." These are items you can ensure match in a regex but don't get <i>returned</i> in the match. 

<p>

Let me be honest - I don't quite get how this stuff works. His example though worked perfectly. I took his third example and removed the requirement for a special character and got this:

<p>

<code>
&lt;cfset s = ["aaaa","aAa","AAAA","a9", "A9", "aA9","aaaAAA7"]&gt;

&lt;cfloop index="test" array="#s#"&gt;
	&lt;cfoutput&gt;#test# ok? &lt;/cfoutput&gt;
	&lt;cfset regex = "^.*(?=.{% raw %}{7,}{% endraw %})(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$"&gt;
	
	&lt;cfif reFind(regex, test)&gt;
		yes
	&lt;cfelse&gt;
		no
	&lt;/cfif&gt;&lt;br/&gt;
	
&lt;/cfloop&gt;
</code>

<p>

I don't quite get why we have to anchor it nor do I get the .* in the look aheads. But I can say it works great.