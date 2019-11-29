---
layout: post
title: "Minor BlogCFC Update"
date: "2005-08-22T10:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/22/Minor-BlogCFC-Update
guid: 717
---

One more small bug fix for BlogCFC. A while ago I added logic to make the Application name dynamic based on the physical folder. This helps folks who want to run N blogs on one box without modifying the blog name. So - I went through the trouble of creating the dynamic name using this logic:

<div class="code"><FONT COLOR=MAROON>&lt;cfset prefix = getCurrentTemplatePath()&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfset prefix = reReplace(prefix, <FONT COLOR=BLUE>"[^a-zA-Z]"</FONT>,<FONT COLOR=BLUE>""</FONT>,<FONT COLOR=BLUE>"all"</FONT>)&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfset prefix = right(prefix,<FONT COLOR=BLUE> 64</FONT> - len(<FONT COLOR=BLUE>"_blog_#blogname#"</FONT>))&gt;</FONT></div>

The only thing interesting here is line 3. ColdFusion requires your application names to be less than 64 characters long. So I take the default name's length and subtract that from 64, and use the right most remainder of the prefix name. 

So I did all of that - and forgot to actually add it to my application name:

<div class="code"><FONT COLOR=MAROON>&lt;cfapplication name=<FONT COLOR=BLUE>"#prefix#_blog_#blogname#"</FONT> sessionManagement=true loginStorage=<FONT COLOR=BLUE>"session"</FONT>&gt;</FONT></div>

The <a href="http://ray.camdenfamily.com/blog.zip">download zip</a> has been updated.