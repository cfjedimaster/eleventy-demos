---
layout: post
title: "Yet one more YQL demo - Term extraction from CFBloggers"
date: "2010-08-11T16:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/08/11/Yet-one-more-YQL-demo-Term-extraction-from-CFBloggers
guid: 3907
---

I continue to be amazed at just how kick ass YQL (<a href="http://developer.yahoo.com/yql/">Yahoo Query Language</a>) is for building mashups. I think it is one of the most innovative things I've seen on the Net in years. Earlier this week I was directed to the <a href="http://isithackday.com/rockyourdata/">Rock Your Data</a> YQL demos. Each shows a pretty darn cool example of what can be done with the technology.
<!--more-->
<p>

In my mind, the best example was the <a href="http://isithackday.com/rockyourdata/index.php?id=2">term extraction</a> example. At some point YQL added support for retrieving important terms from filtered data. Consider the author's example:

<p>

<code>
select * from search.termextract where context in (select content from html where url="http://cnn.com" and xpath="//a") | unique(field="Result")
</code>

<p>

That's about as simple as you can make it. I decided to quickly test this against <a href="http://www.cfbloggers.org">CFBloggers</a>. I modified the URL to point directly to the content and to pass along a request setting to get 100 items:

<p>

<code>
select * from search.termextract where context in (select content from html where url="http://coldfusionbloggers.org/content.cfm?perpage=50" and xpath="//a[starts-with(@href,'click.cfm')]")  | unique(field="Result")
</code>

<p>

Once I had that, I then simply wrote a quick parser. I decided to go full bore and turn the results into a tag cloud. (This <a href="http://twitter.com/donohoe/status/20898948304">tweet</a> was my inspiration.) Pete Freitag has a good blog post on this: <a href="http://www.petefreitag.com/item/396.cfm">How to make a tag cloud</a>. The final result can be found below. Before dumping all the code, here is the result:

<p>

<img src="https://static.raymondcamden.com/images/shot1.PNG" />

<p>

<i>Quick Note - I added some spaces to the URL in the first line so that it would wrap better on my blog. Remove before using.</i>

<p>

<code>
&lt;cfset yql = "http://query.yahooapis.com/v1/public/yql?q=select{% raw %}%20*%{% endraw %}20from{% raw %}%20search.termextract%{% endraw %}20 where{% raw %}%20context%{% endraw %}20in{% raw %}%20(select%{% endraw %}20content{% raw %}%20from%{% endraw %}20html{% raw %}%20 where%{% endraw %}20url{% raw %}%3D%{% endraw %}22http{% raw %}%3A%{% endraw %}2F{% raw %}%2Fcoldfusionbloggers.org%{% endraw %}2Fcontent.cfm{% raw %}%3Fperpage%{% endraw %}3D100{% raw %}%22%{% endraw %}20and{% raw %}%20xpath%{% endraw %}3D{% raw %}%22%{% endraw %}2F{% raw %}%2Fa%{% endraw %}5Bstarts-with ({% raw %}%40href%{% endraw %}2C'click.cfm'){% raw %}%5D%{% endraw %}22){% raw %}%20%{% endraw %}20{% raw %}%7C%{% endraw %}20unique(field{% raw %}%3D%{% endraw %}22Result{% raw %}%22)& diagnostics=true&env=store%{% endraw %}3A{% raw %}%2F%{% endraw %}2Fdatatables.org%2Falltableswithkeys"&gt;
&lt;cfhttp url="#yql#" result="yqlhttp"&gt;
&lt;cfset data = xmlParse(yqlhttp.filecontent)&gt;

&lt;cfset termData = queryNew("word,count")&gt;
&lt;cfloop index="result" array="#data.query.results.result#"&gt;
	&lt;cfset word = result.xmltext&gt;
	&lt;cfset count = result['yahoo:repeatcount'].xmlText&gt;
	&lt;cfset queryAddRow(termData)&gt;
	&lt;cfset querySetCell(termData, "word", word)&gt;
	&lt;cfset querySetCell(termData, "count", count)&gt;		
&lt;/cfloop&gt;

&lt;cfset tagValueArray = ListToArray(ValueList(termData.count))&gt;
&lt;cfset max = ArrayMax(tagValueArray)&gt;
&lt;cfset min = ArrayMin(tagValueArray)&gt;
&lt;cfset diff = max - min&gt;
&lt;cfset distribution = diff / 3&gt;

&lt;style&gt;
.smallestTag {% raw %}{ font-size: xx-small; }{% endraw %}
.smallTag {% raw %}{ font-size: small; }{% endraw %}
.mediumTag {% raw %}{ font-size: medium; }{% endraw %}
.largeTag {% raw %}{ font-size: large; }{% endraw %}
.largestTag {% raw %}{ font-size: xx-large; }{% endraw %} 
&lt;/style&gt;
&lt;cfoutput query="termData"&gt;
	&lt;cfif count EQ min&gt;
		&lt;cfset class="smallestTag"&gt;
	&lt;cfelseif count EQ max&gt;
		&lt;cfset class="largestTag"&gt;
	&lt;cfelseif count GT (min + (distribution*2))&gt;
		&lt;cfset class="largeTag"&gt;
	&lt;cfelseif count GT (min + distribution)&gt;
		&lt;cfset class="mediumTag"&gt;
	&lt;cfelse&gt;
		&lt;cfset class="smallTag"&gt;
	&lt;/cfif&gt;
	&lt;b class="#class#"&gt;#word#&lt;/b&gt;
&lt;/cfoutput&gt;
</code>