---
layout: post
title: "Generate a tag cloud from an RSS feed with ColdFusion"
date: "2012-02-01T16:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/02/01/Generate-a-tag-cloud-from-an-RSS-feed-with-ColdFusion
guid: 4515
---

Earlier today <a href="http://henke.ws/">Mike Henke</a> asked if there was a way to generate a tag cloud from an RSS feed. While he was able to find a solution quick enough (<a href="http://www.wordle.net">Wordle</a>), I thought it would be kind of fun to try this myself. I knew that Pete Freitag had already blogged on <a href="http://www.petefreitag.com/item/396.cfm">tag clouds and ColdFusion</a>, so all I had to do was generate my word data and pass it to his code. Here's what I came up with.
<!--more-->
<p>

I began with a simple call to my RSS URL to generate a query of data. For my testing, this was the only thing I cached. Obviously <i>all</i> of my "crunching" could have been cached. 

<p>

<code>
&lt;cfset rss = cacheGet("rss")&gt;
&lt;cfif isNull(rss)&gt;
	&lt;cfset feedUrl = "http://feedproxy.google.com/RaymondCamdensColdfusionBlog"&gt;
	&lt;cffeed source="#feedUrl#" query="rss"&gt;
	&lt;cfset cacheput("rss", rss,createTimespan(0,1,0,0))&gt;
&lt;/cfif&gt;
</code>

<p>

Now for the fun part. In order to use Pete's code, I need to know each word and the number of times it appears. I began with an empty struct:

<p>

<code>
&lt;cfset allwords = {}&gt;
</code>

<p>

Next, I created a list of "stop" words, words I'd always ignore. (Note, this list was kind of arbitrary. Also note I added some spaces in the blog entry just so it would wrap better.)

<p>

<code>
&lt;cfset stopwords = "and,this,the,a,it,as,was,to,don't,has,you, you're,you've,with,why,which,when,were,we've,we're, then,than,i,i'll,i'm,i've,i'd,it's,for,of,is,if,in,that,but,my,not,can,are,',done, off,their,isn't,yes,what's,them,they,'',be,being,all, only,does,here,an,by,would,like,at,do,want,or,could, out,our,while,what,had,each,into,where,That's,will,else, let's,about,got,using,before,over,actually,going,some,well"&gt;
</code>

<p>

I then split by word boundary and added them to the struct. Note that this word boundary also includes ' so I can match "don't". This is <i>not</i> perfect, but good enough.

<p>

<code>
&lt;cfloop query="rss"&gt;
	&lt;cfset words = reMatch("[\w']+",bigstring)&gt;
	&lt;cfloop index="w" array="#words#"&gt;
		&lt;cfif len(w) gt 1 and not listFindNoCase(stopwords, w)&gt;
			&lt;cfif not structKeyExists(allwords, w)&gt;
				&lt;cfset allwords[w] = 0&gt;
			&lt;/cfif&gt;
			&lt;cfset allwords[w]++&gt;
		&lt;/cfif&gt;
	&lt;/cfloop&gt;
&lt;/cfloop&gt;	
</code>

<p>

I had quite a few words, so I decided to remove all words with less than 5 instances.

<p>

<code>
&lt;cfloop item="k" collection="#allwords#"&gt;
	&lt;cfif allwords[k] lte 5&gt;
		&lt;cfset structDelete(allwords,k)&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

<p>

Now comes Pete's code to generate high/low values.

<p>

<code>
&lt;cfset minval = 999999&gt;
&lt;cfset maxval = 0&gt;
&lt;cfloop item="k" collection="#allwords#"&gt;
	&lt;cfif allwords[k] lt minval&gt;
		&lt;cfset minval = allwords[k]&gt;
	&lt;cfelseif allwords[k] gt maxval&gt;
		&lt;cfset maxval = allwords[k]&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;

&lt;cfset diff = maxval - minval&gt;
&lt;cfset distribution = diff / 3&gt;
</code>

<p>

And finally, the output:

<p>

<code>
&lt;h2&gt;Word Cloud&lt;/h2&gt;
&lt;cfloop item="w" collection="#allWords#"&gt;
	&lt;cfif allWords[w] EQ minval&gt;
		&lt;cfset class="smallestTag"&gt;
	&lt;cfelseif allWords[w] EQ maxval&gt;
		&lt;cfset class="largestTag"&gt;
	&lt;cfelseif allWords[w] GT (minval + (distribution*2))&gt;
		&lt;cfset class="largeTag"&gt;
	&lt;cfelseif allWords[w] GT (minval + distribution)&gt;
		&lt;cfset class="mediumTag"&gt;
	&lt;cfelse&gt;
		&lt;cfset class="smallTag"&gt;
	&lt;/cfif&gt;
	&lt;cfoutput&gt;&lt;span class="#class#"&gt;#w#&lt;/a&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
&lt;/p&gt;
</code>

<p>

Sexy, eh? Here is the output from my blog:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip23.png" />

<p>

I then pointed it at the RSS feed from <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers</a>:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip24.png" />

<p>

I probably could have shortened that a lot more with my minimum filter. Anyway, I then did one more tweak. Instead of counting words, I simply took the category list:

<p>

<code>
&lt;cfloop query="rss"&gt;
	&lt;cfset words = listToArray(categorylabel)&gt;
</code>

<p>

This tag cloud then represents categories from the RSS feed:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip25.png" />

<p>

And that's it. Totally and completely stupid, but fun. Here's the current script, although it's a bit messy. As I said, normally you would want to cache <b>all</b> of the crunching.

<p>

p.s. Words a bit hard to read in the pictures? Right click and open in new tab. Sorry about that!

<p>

<code>
&lt;cfset rss = cacheGet("rss")&gt;
&lt;cfif isNull(rss)&gt;
	&lt;cfset feedUrl = "http://www.coldfusionbloggers.org/rss.cfm"&gt;
	&lt;cffeed source="#feedUrl#" query="rss"&gt;
	&lt;cfset cacheput("rss", rss,createTimespan(0,1,0,0))&gt;
&lt;/cfif&gt;

&lt;!--- create a count of words ---&gt;
&lt;cfset allwords = {}&gt;
&lt;cfset stopwords = "and,this,the,a,it,as,was,to,don't,has,you,you're,you've,with,why,which,when,were,we've,we're,then,than,i,i'll,i'm,i've,i'd,it's,for,of,is,if,in,that,but,my,not,can,are,',done,off,their,isn't,yes,what's,them,they,'',be,being,all,only,does,here,an,by,would,like,at,do,want,or,could,out,our,while,what,had,each,into,where,That's,will,else,let's,about,got,using,before,over,actually,going,some,well"&gt;

&lt;cfloop query="rss"&gt;
	&lt;!---
	&lt;cfset words = reMatch("[\w']+",bigstring)&gt;
	---&gt;
	&lt;cfset words = listToArray(categorylabel)&gt;
	&lt;cfloop index="w" array="#words#"&gt;
		&lt;cfif len(w) gt 1 and not listFindNoCase(stopwords, w)&gt;
			&lt;cfif not structKeyExists(allwords, w)&gt;
				&lt;cfset allwords[w] = 0&gt;
			&lt;/cfif&gt;
			&lt;cfset allwords[w]++&gt;
		&lt;/cfif&gt;
	&lt;/cfloop&gt;
&lt;/cfloop&gt;	

&lt;!--- remove where val &lt; 5, 5 being a bit arbitrary ---&gt;
&lt;!---
&lt;cfloop item="k" collection="#allwords#"&gt;
	&lt;cfif allwords[k] lte 0&gt;
		&lt;cfset structDelete(allwords,k)&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
---&gt;

&lt;!--- get min, max ---&gt;
&lt;cfset minval = 999999&gt;
&lt;cfset maxval = 0&gt;
&lt;cfloop item="k" collection="#allwords#"&gt;
	&lt;cfif allwords[k] lt minval&gt;
		&lt;cfset minval = allwords[k]&gt;
	&lt;cfelseif allwords[k] gt maxval&gt;
		&lt;cfset maxval = allwords[k]&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;

&lt;cfset diff = maxval - minval&gt;
&lt;cfset distribution = diff / 3&gt;

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;&lt;/title&gt;
	&lt;meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-1" /&gt;	
	&lt;meta name="description" content="" /&gt;
	&lt;meta name="keywords" content="" /&gt;

	&lt;link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.4.0/bootstrap.min.css"&gt;
	&lt;!--[if lt IE 9]&gt;&lt;script src="http://html5shim.googlecode.com/svn/trunk/html5.js"&gt;&lt;/script&gt;&lt;![endif]--&gt;
	&lt;script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"&gt;&lt;/script&gt;
	&lt;script type="text/javascript"&gt;
		$(function() {
			
		});	
	&lt;/script&gt;
	&lt;style&gt;
	.smallestTag {% raw %}{ font-size: xx-small; }{% endraw %}
	.smallTag {% raw %}{ font-size: small; }{% endraw %}
	.mediumTag {% raw %}{ font-size: medium; }{% endraw %}
	.largeTag {% raw %}{ font-size: large; }{% endraw %}
	.largestTag {% raw %}{ font-size: xx-large; }{% endraw %} 
	&lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;

	&lt;div class="container"&gt;
		&lt;h2&gt;Word Cloud&lt;/h2&gt;
		&lt;cfloop item="w" collection="#allWords#"&gt;
			&lt;cfif allWords[w] EQ minval&gt;
				&lt;cfset class="smallestTag"&gt;
			&lt;cfelseif allWords[w] EQ maxval&gt;
				&lt;cfset class="largestTag"&gt;
			&lt;cfelseif allWords[w] GT (minval + (distribution*2))&gt;
				&lt;cfset class="largeTag"&gt;
			&lt;cfelseif allWords[w] GT (minval + distribution)&gt;
				&lt;cfset class="mediumTag"&gt;
			&lt;cfelse&gt;
				&lt;cfset class="smallTag"&gt;
			&lt;/cfif&gt;
			&lt;cfoutput&gt;&lt;span class="#class#"&gt;#w#&lt;/a&gt;&lt;/cfoutput&gt;
		&lt;/cfloop&gt;
		&lt;/p&gt;

	&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>