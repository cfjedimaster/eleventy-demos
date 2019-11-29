---
layout: post
title: "Calling a function... did you really call it?"
date: "2009-06-25T14:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/06/25/Calling-a-function-did-you-really-call-it
guid: 3407
---

Just ran across an interesting bug in some code I'm reviewing. I've done this myself a few times so I certainly don't blame the original developer. Read this real quick and tell me what the output is:
<!--more-->
<code>
&lt;cffunction name="returnNothing" output="false" returnType="string" hint="Ask Paris Hilton about WW2."&gt;
	&lt;cfreturn ""&gt;
&lt;/cffunction&gt;

&lt;cfif len(returnNothing)&gt;
	Yes, this ran, and it never should!
&lt;cfelse&gt;
	Perfect - I got nothing back. As I expected.
&lt;/cfif&gt;
</code>

If you said "Perfect...", then you are incorrect. Notice the cfif. We called the UDF, and it should have returned a blank string, right? Well, we didn't actually <i>call</i> the UDF. See the missing ()?

So why did len() return true? You can see this for yourself. Running:

<code>
&lt;cfoutput&gt;#returnNothing#&lt;/cfoutput&gt;
</code>

outputs:

cftest22ecfm1623321220$funcRETURNNOTHING@76e45ffe

Which I believe is simply a toString version of the UDF. (Actually I compared it to #toString(returnNothing)# and I got the same thing.) 

So - raise your hand if you've made this mistake as well!