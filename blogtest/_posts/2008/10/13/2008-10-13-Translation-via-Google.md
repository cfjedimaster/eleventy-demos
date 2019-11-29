---
layout: post
title: "Translation via Google"
date: "2008-10-13T22:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/10/13/Translation-via-Google
guid: 3051
---

Sorry for the lack of postings lately. Things are <i>very</i> busy at work lately so it will most likely be a quiet week. I did run into an interesting article via <a href="http://www.dzone.com">DZone</a> today: <a href="http://www.plentyofcode.com/2008/10/google-translation-api-translate-on.html">Google Translation API: Translate on server side using PHP</a> The author shows an example of hitting the Google Translation service with PHP. This is very unofficial as the service was meant for AJAX, but it does actually work via server side code. Anything written in PHP can be done in ColdFusion of course. Here is my version:
<!--more-->
<code>
&lt;cffunction name="translate" output="false" returnType="string"&gt;
	&lt;cfargument name="str" type="string" required="true" hint="Text to translate."&gt;
	&lt;cfargument name="langfrom" type="string" required="true" hint="Language code of the original text."&gt;
	&lt;cfargument name="langTo" type="string" required="true" hint="Language code to translate the text to..."&gt;
	
	&lt;cfset var langPair = arguments.langFrom & "|" & arguments.langTo&gt;
	&lt;cfset var theURL = "http://ajax.googleapis.com/ajax/services/language/translate?v=1.0&q=" & urlEncodedFormat(arguments.str) & "&langpair=" & urlEncodedFormat(langPair)&gt;
	&lt;cfset var result = ""&gt;
	&lt;cfset var data = ""&gt;
	
	&lt;cfhttp url="#theURL#" result="result"&gt;
	
	&lt;cfset data = deserializeJSON(result.fileContent)&gt;

	&lt;cfif data.responseStatus neq 200&gt;
		&lt;cfreturn ""&gt;
	&lt;/cfif&gt;
	
	&lt;cfreturn data.responseData.translatedText&gt;	

&lt;/cffunction&gt;
</code>

To call it, you just supply the string and the language from and to arguments:

<code>
&lt;cfoutput&gt;#translate("Pardon me, but do you have any expensive, pretentious yellow mustard?", "en", "fr")#&lt;/cfoutput&gt;
</code>

This returns: 

<blockquote>
<p>
Excusez-moi, mais avez-vous cher, prétentieux jaune moutarde? 
</p>
</blockquote>

I don't know French, but that certainly looks right to me. Again, as this is unofficial, I wouldn't expect it to always work, and for this reason I won't submit the code to <a href="http://www.cflib.org">CFLib</a>. Hopefully though it will be use to someone.