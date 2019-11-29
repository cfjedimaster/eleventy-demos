---
layout: post
title: "Correction to earlier ColdFusionBloggers.org post and a warning about removing HTML"
date: "2007-08-01T19:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/01/Correction-to-earlier-ColdFusionBloggersorg-post-and-a-warning-about-removing-HTML
guid: 2244
---

You know that old joke where the person says something to the affect of, "I don't make mistakes. I thought I made a mistake once, but I was wrong." That's what happened to me today. Earlier I <a href="http://www.raymondcamden.com/index.cfm/2007/8/1/Quick--look-at-the-dumb-mistake-on-ColdFusionBloggersorg">posted</a> about how I had forgotten a HTMLEditFormat in my display. Turns out there was a reason I had forgotten it. I had made the decision not to <i>escape</i> HTML, but to simply remove it. I was using this code:

<code>
&lt;cfset portion = reReplace(content, "&lt;.*?&gt;", "", "all")&gt;
</code>

This line uses regular expressions to remove HTML from a string. And it works fine too. Accept when the string contains invalid, or partial HTML. Consider this string:

<blockquote>
I really wish I could meet Paris Hilton. She is the most intelligent person in the world. Maybe Lindsey is close though. If I met them, I'd show them my web page at &lt;a href=
</blockquote>

Notice how the HTML ends there at the end? Some RSS feeds provide only a portion of their feeds, and sometimes these portions end in the middle of an HTML tag. (<a href="http://blogcfc.riaforge.org">BlogCFC</a> doesn't have this bug. :) So I added one more line of code:

<code>
&lt;cfset portion = reReplace(portion, "&lt;.*$", "")&gt;
</code>

This looks for an incomplete HTML tag at the end of the string. Once added my display issue on <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers</a> was fixed. 

I've updated the zip. Also, Lola Beno fixed up some issues I had with my SQL script. By "fix" I mean completely rewrote, so thanks Lola!