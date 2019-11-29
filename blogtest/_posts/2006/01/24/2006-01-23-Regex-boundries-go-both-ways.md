---
layout: post
title: "Regex boundries go both ways"
date: "2006-01-24T06:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/24/Regex-boundries-go-both-ways
guid: 1052
---

So I was working on the <a href="http://ray.camdenfamily.com/index.cfm/2006/1/24/Cookbook-Update">update</a> to the <a href="http://www.coldfusioncookbook.com">cookbook</a> site to allow for auto-hyperlinking of tags and functions. I began my work by simply trying to get createUUID() to hyperlink.

So my initial regex simply looked for "createUUID()". One of the first things I realized is that the parens were special in regex. Therefore, I changed the regex to: "createUUID\(\)". This worked beautifully so I began to put in the rest of the data. When I tested the display however, I noticed a problem. parseDateTime() was matching inside of lsParseDateTime(). 

Luckily regex makes this easy to solve. You can surround a regex with \b characters. What does this mean? Let me steal from the docs:

<blockquote>
Specifies a boundary defined by a transition from an alphanumeric character to a nonalphanumeric character, or from a nonalphanumeric character to an alphanumeric character.

For example, the string " Big" contains boundary defined by the space (nonalphanumeric character) and the "B" (alphanumeric character).

The following example uses the \b escape sequence in a regular expression to locate the string "Big" at the end of the search string and not the fragment "big" inside the word "ambiguous".

reFindNoCase("\bBig\b", "Don't be ambiguous about Big.")

&lt;!--- The value of IndexOfOccurrence is 26 ---&gt;

When used inside of a character set (e.g. [\b]), it specifies a backspace
</blockquote>

This didn't quite work for me, and I couldn't figure out why. Then someone on IRC (I think it was my friend Boyzoid) suggested getting rid of the \b characters. I pointed out that this would result in a bad match - but then something occured to me. Read the docs again, this time notice the emphasis I added:

<blockquote>
Specifies a boundary defined by a transition from an alphanumeric character to a nonalphanumeric character, <i>or from a nonalphanumeric character to an alphanumeric character.</i>
</blockquote>

My regex was now "\bcreateUUID\(\)\b". Notice that my last character was a ). Therefore, the \b there was trying to go the other way - from nonalphanumeric to alphanumeric. I simply dropped the \b from the end of the regex and everything (so far) worked fine. 

Later on I'll write a blog entry about the replacement system and how you can add one to your site.