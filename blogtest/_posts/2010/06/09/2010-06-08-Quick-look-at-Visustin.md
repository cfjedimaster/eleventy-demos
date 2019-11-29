---
layout: post
title: "Quick look at Visustin"
date: "2010-06-09T10:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/06/09/Quick-look-at-Visustin
guid: 3841
---

Earlier this week Michael Gillespie pointed me to an interesting program, <a href="http://www.aivosto.com/visustin.html">Visustin</a>. This program creates flow charts from source code. It supports 36 different languages with ColdFusion being one of them. It is primarily supported on Windows only, but apparently can also run on the Mac. (I didn't get a chance to test that.) I have to say that I didn't put much faith in this. I can't remember the last time I used a flow chart nor can I remember ever actually <i>creating</i> one, but I gave Visustin a quick try and here is what I saw.
<!--more-->
<p>
To start off with - I took a fairly simply program.
<p>
<code>
&lt;cffunction name="doubleit" returnType="numeric" hint="Doubles values"&gt;
	&lt;cfargument name="x" type="numeric" required="true" hint="Value to double"&gt;
	&lt;cfreturn arguments.x * 2&gt;
&lt;/cffunction&gt;

&lt;cfloop index="x" from="1" to="10"&gt;
	&lt;cfoutput&gt;#x# doubled is #doubleit(x)#&lt;br/&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>
<p>
As you can see, I've got a UDF and a loop that calls it 10 times. Here is what Visustin produced:
<p> 
<img src="https://static.raymondcamden.com/images/v12.png" />
<p>
Not too bad. But changing the UDF to script produced a less useful chart:
<p>
<img src="https://static.raymondcamden.com/images/cfjedi/v22.png" />
<p>
I questioned them on it (and let me say - the company, Aivosoto, was pretty darn responsive) and they said they don't currently support cfscript. That's a downer - but on the flip side - those of making heavy use of cfscript in our CFML are probably in the minority still. Here is another example, taken from the CFM I built for <a href="http://www.coldfusionjedi.com/index.cfm/2010/6/4/Automating-watermarking-of-images-with-ColdFusion">automating watermarking</a> in ColdFusion:
<p>

<img src="https://static.raymondcamden.com/images/cfjedi/automarker.png" />

<p>

Interesting. So would I use this? I don't know. I've worked with some pretty gnarly code before. If this could create a nice reference, it would certainly be useful. Thoughts?

<p>

Quick PS: I mentioned how responsive Aivosoto was - I noticed on their contact form that they asked about languages you use. I also noticed they didn't list ColdFusion. They promised to fix that soon. :)