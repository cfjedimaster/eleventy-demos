---
layout: post
title: "This works... but don't do it."
date: "2009-10-01T18:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/10/01/This-works-but-dont-do-it
guid: 3549
---

I just ran across this little gem in some code I'm looking at. It works, but... I'm not sure I'd ever recommend actually doing it. I'll show the code first, explain how it works, and then how I'd rewrite it.
<!--more-->
The following code was in a component, but I can demonstrate it with a simple CFM as well.

<code>
&lt;cffunction name="test" output="true"&gt;
  #test2()#
&lt;/cffunction&gt;
&lt;cffunction name="test2"&gt;
  &lt;cfset variables.iran="sofaraway"&gt;
&lt;/cffunction&gt;

&lt;cfset test()&gt;
&lt;cfdump var="#variables#"&gt;
</code>

Looks a bit odd, right? If you run this, you will actually see IRAN as one of the Variables. The output="true" on test() evaluates the CFML inside the method. It would be the same as if I had done:

<code>
&lt;cfoutput&gt;#test2()#&lt;/cfoutput&gt;
</code>

So that <i>works</i>, but, again, it's a bit odd. I'd rewrite the method like so:

<code>
&lt;cffunction name="test" output="false"&gt;
  &lt;cfset test2()&gt;
&lt;/cffunction&gt;
</code>

It has the exact same effect, but, is a bit more direct. You can toggle output back on again and it won't change a thing.