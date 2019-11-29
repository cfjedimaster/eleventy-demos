---
layout: post
title: "Revealing ColdFusion exceptions hidden by try/catch"
date: "2012-03-29T10:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/03/29/Revealing-ColdFusion-exceptions-hidden-by-trycatch
guid: 4574
---

Yesterday <a href="http://henke.ws/">Mike Henke</a> asked an interesting question on Twitter. (And I should thank him as this is the second time now one of his tweets has led to an interesting discussion.) He wished there was a way to make a try/catch be disabled when testing. Obviously you wouldn't do this in production, but I think most folks could imagine needing to temporarily disable a try/catch so that you can see full details of an error. I decided to take a quick look into this and found something I thought was interesting.

<p>

First off - if you are willing to edit code, then you could just remove the try/catch. Another quick hack would be to use a conditional rethrow as in the pseudo-code below:

<p>

<code>
&lt;cftry&gt;
  &lt;cf_dosomethingnaughty&gt;
  &lt;cfcatch&gt;
    &lt;cfif is notProduction&gt;
      &lt;cfrethrow&gt;
    &lt;/cfif&gt;
    &lt;p&gt;I'm so sorry you got an error. I really do care. Really.&lt;/p&gt;
  &lt;/cfcatch&gt;
&lt;/cftry&gt;
</code>

<p>

That's a manual approach and would work, but I had a hunch about an alternative that could possibly work as well. I remembered that exceptions show up when ColdFusion debugging is turned on. So I whipped up a CFM with an error in it wrapped in try/catch then loaded it. As expected, my error was hidden in the main display, and down in my debug area I could clearly see the exception:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip59.png" />

<p>

So that may be good enough. But there isn't a lot of detail in there. I opened up the debug template and looked at how we gather the exception info:

<p>

<code>
&lt;cfquery dbType="query" name="cfdebug_ex" debug="false"&gt;
	SELECT *
	FROM qEvents
	WHERE type = 'Exception'
&lt;/cfquery&gt;
</code>

<p>

For the hell of it, I quickly added a cfdump and looked at the data. Guess what? The entire stack trace is there. The debug template simply doesn't use it. To be fair, they are kinda big, but I went ahead and modified the display code:

<p>

<code>
&lt;!--- Exceptions ---&gt;
&lt;cfif bFoundExceptions&gt;
&lt;cftry&gt;
&lt;cfoutput&gt;
	&lt;p class="cfdebug"&gt;&lt;hr/&gt;&lt;b class="cfdebuglge"&gt;&lt;a name="cfdebug_exceptions"&gt;Exceptions&lt;/a&gt;&lt;/b&gt;&lt;/p&gt;
	&lt;cfloop query="cfdebug_ex"&gt;
	    &lt;div class="cfdebug"&gt;#TimeFormat(cfdebug_ex.timestamp, "HH:mm:ss.SSS")# - #cfdebug_ex.name# &lt;cfif FindNoCase("Exception", cfdebug_ex.name) EQ 0&gt;Exception&lt;/cfif&gt; - in #encodeForErrorSmart(cfdebug_ex.template)# : line #encodeForErrorSmart(cfdebug_ex.line)#&lt;/div&gt;
	    &lt;cfif IsDefined("cfdebug_ex.message") AND Len(Trim(cfdebug_ex.message)) GT 0&gt;
	    &lt;pre&gt;
	    #encodeForErrorSmart(cfdebug_ex.message)#
	    &lt;/pre&gt;
		&lt;cfdump var="#cfdebug_ex.stacktrace#"&gt;
	    &lt;/cfif&gt;
	&lt;/cfloop&gt;
&lt;/cfoutput&gt;
	&lt;cfcatch type="Any"&gt;
		&lt;!--- Error reporting an exception event entry. ---&gt;	
	&lt;/cfcatch&gt;
&lt;/cftry&gt;
&lt;/cfif&gt;
</code>

<p>

Just to be sure it's clear - my modification is the cfdump. Here's a screen shot:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip60.png" />

<p>

What do folks think about this approach? I know I've said it many times before, but do not forget that both the debug and exception templates are open source. You can hack them up - as I and others have done over the years. If you want to try this mod, just save the attached file to your WEB-INF/debug folder and select the filename "ray" in your ColdFusion Administrator settings.