---
layout: post
title: "ColdFusion Zeus POTW - Extra edition again..."
date: "2011-12-22T10:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/12/22/ColdFusion-Zeus-POTW-Extra-edition-again
guid: 4469
---

Hey, it's the holidays, so why not share one more quick ColdFusion Zeus update? This is another little feature that literally became available two days ago. If you've ever needed to dynamically invoke a CFC method, you know that's simply enough using cfinvoke. So for example:
<!--more-->
<p/>

<code>
&lt;cfset s = new some()&gt;

&lt;cfset dynmeth = "test"&gt;
&lt;cfinvoke component="#s#" method="#dynmeth#" returnVariable="res"&gt;
&lt;cfdump var="#res#"&gt;
</code>

<p>

But of course, that's tag based. How do you do this in script? Unfortunately, the only way to do it was with evaluate, and while evaluate isn't as slow as it used to be, it can get messy to use.

<p>

ColdFusion Zeus corrects this by adding an invoke function. 

<p>

<code>
&lt;cfset s = new some()&gt;

&lt;cfset dynmeth = "test"&gt;

&lt;cfset res = invoke(s, dynmeth)&gt;
&lt;cfdump var="#res#"&gt;
</code>

<p>

The first argument is either an instance of a CFC or the name of a CFC. The second argument is the method to call. If you need to pass arguments, then you can simply add a third argument - a struct.

<p>

<code>
&lt;cfset res = invoke(s, "sum", {% raw %}{x:4, y:9}{% endraw %})&gt;
&lt;cfoutput&gt;#res#&lt;p/&gt;&lt;/cfoutput&gt;
</code>

<p>

By the way - take note of the fix to implicit struct notation. You can still use an equals sign ({% raw %}{x=4}{% endraw %}), but colons work now too.

<p>

As a final quick aside - a certain person decided to take my words out of context regarding these Zeus previews I've been doing. That person also hasn't bothered to approve the comment I added 24 hours or so ago. I'm not going to bother linking to troll bait, but to be clear - these Zeus previews have <i>intentionally</i> focused on small things. It's easier for me to write, and secondly, it lets me ramp up slowly to the larger things we've announced already, like REST, closures, and web sockets. (Also, some of our larger features are still being hashed out.) For folks who attended my MAX preso, you already know this. Personally I'm really enjoying sharing these small, but useful, improvements, but I want folks to know that - obviously - we have bigger things in the works.