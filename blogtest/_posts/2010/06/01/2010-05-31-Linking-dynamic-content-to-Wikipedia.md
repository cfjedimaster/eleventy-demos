---
layout: post
title: "Linking dynamic content to Wikipedia"
date: "2010-06-01T09:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/06/01/Linking-dynamic-content-to-Wikipedia
guid: 3835
---

This morning while in the shower (don't ask - I don't know why these things come up when they do) I thought it might be interesting to write up a quick demo of hyperlinking dynamic content to Wikipedia pages. I've seen a few sites that will link certain keywords to Wikipedia so folks can get more information about a particular concept or idea. I'm not sure if this is going to be actual useful, but here is what I came up with.
<!--more-->
<p>
Let's begin by creating some simple static variables. So for example, here is our "article":
<p>

<code>
&lt;!--- This represents our database content. ---&gt;
&lt;cfsavecontent variable="body"&gt;
This is a body of text. It will mention keywords like moonpies and lava. It will
also include other things like beer, Belgium, and Klaus.
&lt;/cfsavecontent&gt;
</code>

<p>

Next, here are the keywords we will be looking for. Now you may ask - why not simply link <i>any</i> keyword in the text? Well, this would require Wikipedia having an API that can take a block of text and return "recognized" words. However, even if Wikipedia did have that, I probably wouldn't use it. You wouldn't want most of your content to turn into links. You really want to focus on the critical, important words in your text and not things that don't really relate to the concepts at hand. This is where your SMEs (subject matter experts) come in and tell you what words make sense to auto-link. Also - I'd probably imagine a system where you have a global list of keywords (things that are always linked) as well as article specific content. As an example, "Ewok" may not be globally linked on a Star Wars site, but would be linked on an article concerning Return of the Jedi. Obviously there are many different alternatives here. For now though, I just have a list:

<p>

<code>
&lt;!--- This represents our list of keywords. ---&gt;
&lt;cfset keywords = "moonpies,lava,beer,belgium"&gt;
</code>

<p>

Ok, finally, let's write a simple UDF to handle our links:

<p>

<code>
&lt;cffunction name="wikify" output="false" returnType="string"&gt;
	&lt;cfargument name="str" type="string" required="true"&gt;
	&lt;cfargument name="keywords" type="string" required="true"&gt;
	&lt;cfset var keyword = ""&gt;
	&lt;cfset var link = ""&gt;
		
	&lt;cfloop index="keyword" list="#arguments.keywords#"&gt;
		&lt;cfset link = '&lt;a href="http://wikipedia.org/wiki/#urlEncodedFormat(keyword)#"&gt;'&gt;
		&lt;cfset arguments.str = replacenocase(arguments.str, keyword, link & keyword & "&lt;/a&gt;", "all" )&gt;
	&lt;/cfloop&gt;
	
	&lt;cfreturn arguments.str&gt;	
&lt;/cffunction&gt;
</code>

<p>

This UDF isn't terribly complex. All it does is loop through the keywords and create a link to each one. I followed the "syntax" I saw on Wikipedia where /wiki/X always works, even if a term isn't found. So if we actually call and output our result...

<p>

<code>
&lt;!--- call our UDF to wifi-fy our keywords ---&gt;
&lt;cfset content = wikify(body, keywords)&gt;

&lt;cfoutput&gt;#content#&lt;/cfoutput&gt;
</code>

<p>

We get: 

<p>

<blockquote>
This is a body of text. It will mention keywords like <a href="http://wikipedia.org/wiki/moonpies">moonpies</a> and <a href="http://wikipedia.org/wiki/lava">lava</a>. It will
also include other things like <a href="http://wikipedia.org/wiki/beer">beer</a>, <a href="http://wikipedia.org/wiki/belgium">belgium</a>, and Klaus.
</blockquote>

<p>

Close, but notice how Belgium became belgium. I bet they won't like that. Let's update our UDF to version 2:

<p>

<code>
&lt;cffunction name="wikify2" output="false" returnType="string"&gt;
	&lt;cfargument name="str" type="string" required="true"&gt;
	&lt;cfargument name="keywords" type="string" required="true"&gt;
	&lt;cfset var keyword = ""&gt;
	&lt;cfset var link = ""&gt;
		
	&lt;cfloop index="keyword" list="#arguments.keywords#"&gt;
		&lt;cfset link = '&lt;a href="http://wikipedia.org/wiki/#urlEncodedFormat(keyword)#"&gt;'&gt;
		&lt;cfset arguments.str = reReplaceNoCase(arguments.str, "(" & keyword & ")", link & "\1" & "&lt;/a&gt;", "all" )&gt;
	&lt;/cfloop&gt;
	
	&lt;cfreturn arguments.str&gt;	
&lt;/cffunction&gt;
</code>

<p>

Version 2 makes one critical change. Instead of a simple replaceNoCase, I switched to <b>re</b>ReplaceNoCase, the regex version. This allows me to match the keyword and use it, case preserved, in the replacement. Woot. Here is the result.

<p>

<blockquote>
This is a body of text. It will mention keywords like <a href="http://wikipedia.org/wiki/moonpies">moonpies</a> and <a href="http://wikipedia.org/wiki/lava">lava</a>. It will
also include other things like <a href="http://wikipedia.org/wiki/beer">beer</a>, <a href="http://wikipedia.org/wiki/belgium">Belgium</a>, and Klaus.
</blockquote>

<p>

Nice - but I wanted to make it better. I noticed that if I included a term like St. Louis, the result didn't end up on the right St. Louis page. As I said earlier, Wikipedia won't throw an error, it just says it doesn't know about the content. While I could form the keyword in such a way that it worked, I decided to take a look at the search form, which seems to <i>always</i> work nicely. I did what any self-respecting web developer would do - I viewed source. I noticed their form was not using POST. That meant I could I could link to their search directly using a simple link. I copied over the hidden form field they had, and then simply updated my link like so.

<p>

<code>

&lt;cffunction name="wikify3" output="false" returnType="string"&gt;
	&lt;cfargument name="str" type="string" required="true"&gt;
	&lt;cfargument name="keywords" type="string" required="true"&gt;
	&lt;cfset var keyword = ""&gt;
	&lt;cfset var link = ""&gt;
		
	&lt;cfloop index="keyword" list="#arguments.keywords#"&gt;
		&lt;cfset link = '&lt;a href="http://wikipedia.org/w/index.php?title=Special:Search&search=#replace(keyword,' ','+','all')#"&gt;'&gt;
		&lt;cfset arguments.str = reReplaceNoCase(arguments.str, "(" & keyword & ")", link & "\1" & "&lt;/a&gt;", "all" )&gt;
	&lt;/cfloop&gt;
	
	&lt;cfreturn arguments.str&gt;	
&lt;/cffunction&gt;
</code>

<p>

In this version, the only thing new is the link. Notice the replace call there. I found that when I used urlEncodedFormat, it seemed to go a bit too far in escaping, specifically the "." in St. Louis. Simply replacing spaces seemed to work fine for me. The end result seems to work great:

<p>

<blockquote>
his is a body of text. It will mention keywords like <a href="http://wikipedia.org/w/index.php?title=Special:Search&search=moonpies">moonpies</a> and <a href="http://wikipedia.org/w/index.php?title=Special:Search&search=lava">lava</a>. It will
also include other things like <a href="http://wikipedia.org/w/index.php?title=Special:Search&search=beer">beer</a>, <a href="http://wikipedia.org/w/index.php?title=Special:Search&search=belgium">Belgium</a>, and <a href="http://wikipedia.org/w/index.php?title=Special:Search&search=st.+louis">St. Louis</a>. 
</blockquote>

<p>

Woot. Almost there. I figured I'd have a problem with "submatches" - in other words, using a keyword of "cat" and having something like catalog in my text. I was right. You can see this here:

<p>

<blockquote>
This is a body of text. It will mention <a href="http://wikipedia.org/w/index.php?title=Special:Search&search=cat">cat</a>s and <a href="http://wikipedia.org/w/index.php?title=Special:Search&search=cat">cat</a>alogs. 
</blockquote>

<p>

Luckily - regex can help us again. There is a way to tell regular expressions to look for a word boundary, ie, match X but as a word, not as part of generic text. This is done with the \b escape sequence. Here is version 4 of the UDF.

<p>

<code>
&lt;cffunction name="wikify4" output="false" returnType="string"&gt;
	&lt;cfargument name="str" type="string" required="true"&gt;
	&lt;cfargument name="keywords" type="string" required="true"&gt;
	&lt;cfset var keyword = ""&gt;
	&lt;cfset var link = ""&gt;
		
	&lt;cfloop index="keyword" list="#arguments.keywords#"&gt;
		&lt;cfset link = '&lt;a href="http://wikipedia.org/w/index.php?title=Special:Search&search=#replace(keyword,' ','+','all')#"&gt;'&gt;
		&lt;cfset arguments.str = reReplaceNoCase(arguments.str, "(\b" & keyword & "\b)", link & "\1" & "&lt;/a&gt;", "all" )&gt;
	&lt;/cfloop&gt;
	
	&lt;cfreturn arguments.str&gt;	
&lt;/cffunction&gt;
</code>

<p>

This correctly handles the issue. I've included the entire test script below (multiple UDFs, multiple calls, etc) if you want to download and play with it. While it runs fast enough, you probably want to consider caching the result of the update. Assuming you are using ColdFusion 9, that would be a quick cacheGet/cachePut set of calls. 

<p>

<code>

&lt;cffunction name="wikify" output="false" returnType="string"&gt;
	&lt;cfargument name="str" type="string" required="true"&gt;
	&lt;cfargument name="keywords" type="string" required="true"&gt;
	&lt;cfset var keyword = ""&gt;
	&lt;cfset var link = ""&gt;
		
	&lt;cfloop index="keyword" list="#arguments.keywords#"&gt;
		&lt;cfset link = '&lt;a href="http://wikipedia.org/wiki/#urlEncodedFormat(keyword)#"&gt;'&gt;
		&lt;cfset arguments.str = replacenocase(arguments.str, keyword, link & keyword & "&lt;/a&gt;", "all" )&gt;
	&lt;/cfloop&gt;
	
	&lt;cfreturn arguments.str&gt;	
&lt;/cffunction&gt;
&lt;cffunction name="wikify2" output="false" returnType="string"&gt;
	&lt;cfargument name="str" type="string" required="true"&gt;
	&lt;cfargument name="keywords" type="string" required="true"&gt;
	&lt;cfset var keyword = ""&gt;
	&lt;cfset var link = ""&gt;
		
	&lt;cfloop index="keyword" list="#arguments.keywords#"&gt;
		&lt;cfset link = '&lt;a href="http://wikipedia.org/wiki/#urlEncodedFormat(keyword)#"&gt;'&gt;
		&lt;cfset arguments.str = reReplaceNoCase(arguments.str, "(" & keyword & ")", link & "\1" & "&lt;/a&gt;", "all" )&gt;
	&lt;/cfloop&gt;
	
	&lt;cfreturn arguments.str&gt;	
&lt;/cffunction&gt;
&lt;cffunction name="wikify3" output="false" returnType="string"&gt;
	&lt;cfargument name="str" type="string" required="true"&gt;
	&lt;cfargument name="keywords" type="string" required="true"&gt;
	&lt;cfset var keyword = ""&gt;
	&lt;cfset var link = ""&gt;
		
	&lt;cfloop index="keyword" list="#arguments.keywords#"&gt;
		&lt;cfset link = '&lt;a href="http://wikipedia.org/w/index.php?title=Special:Search&search=#replace(keyword,' ','+','all')#"&gt;'&gt;
		&lt;cfset arguments.str = reReplaceNoCase(arguments.str, "(" & keyword & ")", link & "\1" & "&lt;/a&gt;", "all" )&gt;
	&lt;/cfloop&gt;
	
	&lt;cfreturn arguments.str&gt;	
&lt;/cffunction&gt;
&lt;cffunction name="wikify4" output="false" returnType="string"&gt;
	&lt;cfargument name="str" type="string" required="true"&gt;
	&lt;cfargument name="keywords" type="string" required="true"&gt;
	&lt;cfset var keyword = ""&gt;
	&lt;cfset var link = ""&gt;
		
	&lt;cfloop index="keyword" list="#arguments.keywords#"&gt;
		&lt;cfset link = '&lt;a href="http://wikipedia.org/w/index.php?title=Special:Search&search=#replace(keyword,' ','+','all')#"&gt;'&gt;
		&lt;cfset arguments.str = reReplaceNoCase(arguments.str, "(\b" & keyword & "\b)", link & "\1" & "&lt;/a&gt;", "all" )&gt;
	&lt;/cfloop&gt;
	
	&lt;cfreturn arguments.str&gt;	
&lt;/cffunction&gt;

&lt;!--- This represents our database content. ---&gt;
&lt;cfsavecontent variable="body"&gt;
This is a body of text. It will mention keywords like moonpies and lava. It will
also include other things like beer, Belgium, and Klaus.
&lt;/cfsavecontent&gt;

&lt;!--- This represents our lit of keywords. ---&gt;
&lt;cfset keywords = "moonpies,lava,beer,belgium"&gt;

&lt;!--- call our UDF to wifi-fy our keywords ---&gt;
&lt;cfset content = wikify2(body, keywords)&gt;

&lt;cfoutput&gt;#content#&lt;/cfoutput&gt;

&lt;hr/&gt;

&lt;cfsavecontent variable="body"&gt;
This is a body of text. It will mention keywords like moonpies and lava. It will
also include other things like beer, Belgium, and St. Louis. 
&lt;/cfsavecontent&gt;

&lt;!--- This represents our lit of keywords. ---&gt;
&lt;cfset keywords = "moonpies,lava,beer,belgium,st. louis"&gt;

&lt;!--- call our UDF to wifi-fy our keywords ---&gt;
&lt;cfset content = wikify3(body, keywords)&gt;

&lt;cfoutput&gt;#content#&lt;/cfoutput&gt;

&lt;hr/&gt;


&lt;cfsavecontent variable="body"&gt;
This is a body of text. It will mention cats and catalogs. 
&lt;/cfsavecontent&gt;

&lt;!--- This represents our lit of keywords. ---&gt;
&lt;cfset keywords = "cat"&gt;

&lt;!--- call our UDF to wifi-fy our keywords ---&gt;
&lt;cfset content = wikify4(body, keywords)&gt;

&lt;cfoutput&gt;#content#&lt;/cfoutput&gt;
</code>