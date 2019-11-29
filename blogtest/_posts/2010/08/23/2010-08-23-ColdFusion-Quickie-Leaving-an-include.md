---
layout: post
title: "ColdFusion Quickie - Leaving an include"
date: "2010-08-23T13:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/08/23/ColdFusion-Quickie-Leaving-an-include
guid: 3919
---

Did you know that you can "leave" a cfinclude and return to a calling template? This may be useful in cases where you realize you no longer need to run the rest of the cfinclude and simply with ColdFusion to carry on back in the calling document. Consider the following simple example:
<!--more-->
<p>

<code>
&lt;h1&gt;Pre cfinclude&lt;/h1&gt;

&lt;cfinclude template="cfa_test.cfm"&gt;

&lt;p&gt;
I'm past my include.
&lt;/p&gt;
</code>

<p>

My initial template has 2 blocks of text that surround a call to a cfinclude. Here is the cfinclude:

<p>

<code>
&lt;!--- Should I leave early? ---&gt;
&lt;cfif randRange(1,2) is 1&gt;
	&lt;cfexit method="exittemplate"&gt;
&lt;/cfif&gt;

&lt;p&gt;
Hello from the include.
&lt;/p&gt;
</code>

<p>

Now obviously this is a <i>very</i> contrived example, but basically if we 'fail' a 50/50 test we use the cfexit tag to leave the template. If we pass, we keep going on. I've used cfexit many times before, but only inside a custom tag. It never really occurred to me that it could possibly be used within templates as well. The idea came up in a meeting last week and I tested to confirm it works as advertised.

<p>

To be clear, the example above is kinda dumb. If you really were going to leave immediately it would perhaps make sense to move the check to the calling template so you don't bother even including it. But hopefully you can get the idea. cfexit is one those tags that doesn't get a lot of usage in most applications, but it can definitely be useful.