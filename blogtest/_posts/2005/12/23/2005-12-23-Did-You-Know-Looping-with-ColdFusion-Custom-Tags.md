---
layout: post
title: "Did You Know: Looping with ColdFusion Custom Tags"
date: "2005-12-23T15:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/23/Did-You-Know-Looping-with-ColdFusion-Custom-Tags
guid: 993
---

A user on the CF irc channel had an interesting problem. She was trying to use a custom tag to iterate over some data. What most folks don't realize is that custom tags can act as iterators, looping over their body as many times as you want. Consider this first code sample:

<code>
&lt;cf_looper from="1" to="10" index="x"&gt;

	&lt;cfoutput&gt;#x#&lt;/cfoutput&gt;&lt;br&gt;
	
&lt;/cf_looper&gt;
</code>

Now, obviously, you wouldn't do this. You would just use the loop tag. But what if you did? Let's take a look at how looper.cfm would work:

<code>
&lt;cfparam name="attributes.from" type="numeric"&gt;
&lt;cfparam name="attributes.to" type="numeric"&gt;
&lt;cfparam name="attributes.index" type="variableName"&gt;

&lt;cfif not isDefined("counter")&gt;
	&lt;cfset counter = attributes.from&gt;
&lt;/cfif&gt;

&lt;cfif thisTag.executionMode is "start"&gt;

	&lt;cfset caller[attributes.index] = counter&gt;
	
&lt;cfelse&gt;

	&lt;cfset counter = counter + 1&gt;
	&lt;cfset caller[attributes.index] = counter&gt;
	
	&lt;cfif counter lte attributes.to&gt;
		&lt;cfexit method="loop"&gt;
	&lt;/cfif&gt;
	
&lt;/cfif&gt;
</code>

The first three lines simply validate my arguments. We then create a variable to serve as our counter. We start it at our FROM value. We then branch between the start and end execution of our custom tag. When ColdFusion sees &lt;cf_looper&gt;, it runs the tag with thisTag.executionMode equal to start. When ColdFusion sees &lt;/cf_looper&gt;, executionMode is end. Now pay attention to what I do in there. First I increase counter. I copy the value again. (This is so that my calling document can output the value.) Then I check to see if I'm at the end of my loop. If I'm not, I use cfexit with method="loop". What that tells ColdFusion is - return to right after &lt;cf_foo&gt;, basically the inside of my tag, execute the code there, than run &lt;cf_foo&gt; in end mode again.

To be honest, I haven't seen many people use the tag like this. The last time I saw it in production mode was in Spectra. Spectra would wrap a content handler with a tag so it could be executed N times. You can imagine code that would print the "Teaser" for an article. You would write the display (Name, a line break, and a portion of the body), wrap it in the tag, and it would work correctly for one content object, or twenty. You could even tell it to use a hr tag, or some other html tag, between each item. Handy! (Not that many of my readers even remember Spectra. -sigh-)