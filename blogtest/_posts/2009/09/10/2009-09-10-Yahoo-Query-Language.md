---
layout: post
title: "Yahoo Query Language"
date: "2009-09-10T19:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/10/Yahoo-Query-Language
guid: 3520
---

Ok, so I'm a bit tiffed at Yahoo right now (I'll put my rant at the end) but I can't not be excited about this. Luke S. emailed me a week or two and suggested I take a look at this blog entry: <a href="http://www.wait-till-i.com/2009/08/25/tutorial-scraping-and-turning-a-web-site-into-a-widget-with-yql/">Tutorial: Scraping and tuning a web site into a widget with YQL</a>. This blog entry discusses how you can use YQL (Yahoo Query Language) as a way to arbitrarily parse random HTML pages. He discusses how he uses XPATH against the HTML to parse up the data and reuse it. I thought this was cool - but then I began looking at the <a href="http://developer.yahoo.com/yql/guide/index.html">YQL</a> docs more closely and found that this was just the tip of the iceberg.
<!--more-->
Yahoo's built what amounts to a SQL interface to both the web and it's own data services. So along with doing XPATH parses on HTML pages, you can also search against flickr:

<code>
SELECT * FROM flickr.photos.search WHERE text="cat"
</code>

And their search engine as well:

<code>
select title,abstract,url from search.web(0,10) where query='coldfusion'
</code>

This is - to be sure - some slick stuff! Yahoo always does a real good job with their API, so I encourage you to check out their docs for more detailed information. They support JSON, XML, and JSONP for responses. At lunch I looked into how difficult it would be to parse their results into native ColdFusion data. I came up with the YQL custom tag. Here are a few examples:

<code>
&lt;cf_yql name="results"&gt;
select * from html(0,10) where url='http://www.dcs.gla.ac.uk/~joy/fun/jokes/TV.html' and xpath='//ul/li/p'
&lt;/cf_yql&gt;

&lt;cfdump var="#results#"&gt;

&lt;cf_yql name="results2"&gt;
SELECT * FROM flickr.photos.search WHERE text='coldfusion'
&lt;/cf_yql&gt;
&lt;cfdump var="#results2#"&gt;

&lt;cf_yql name="results3"&gt;
select title,abstract,url from search.web(0,10) where query='coldfusion'
&lt;/cf_yql&gt;
&lt;cfdump var="#results3#"&gt;
</code>

The first query simply mimics the results of the blog entry. The second two perform searches. All three though return query objects just like the built in cfquery tag. Here is a quick screen shot from the first query:

<img src="https://static.raymondcamden.com/images/Screen shot 2009-09-10 at 5.19.05 PM.png" />

The actual custom tag isn't too complex. Remember ColdFusion makes it simple to get content between tags:

<code>
&lt;cfif thisTag.executionMode is "end"&gt;
	
	&lt;!--- get the yql ---&gt;
	&lt;cfset yql = thisTag.generatedContent&gt;
	&lt;!--- remove it ---&gt;
	&lt;cfset thisTag.generatedContent = ""&gt;
	
	&lt;cfset yql = trim(urlEncodedFormat(yql))&gt;
</code>

This grabs the content, trims it, and urlEncodedFormats the string so I can pass it in a url.

<code>
&lt;cfhttp url="http://query.yahooapis.com/v1/public/yql?q=#yql#&format=json" result="result" getasbinary="no"&gt;
</code>

For some reason, the fileContent result wasn't plain text so I had to run toString() on it:

<code>
&lt;!--- convert bin data to string ---&gt;
&lt;cfset data = result.fileContent.toString()&gt;
&lt;!--- convert json to CF ---&gt;
&lt;cfset data = deserializeJSON(data)&gt;
</code>

After that it was just a matter of parsing the results into a query. You can download the attached code if you want to see all the details. This hasn't been heavily tested, but it's certainly fun. I'll look into adding it to <a href="http://cfyahoo.riaforge.org/">CFYahoo Package</a> if folks actually think this is useful.

p.s. Rant time. Some time ago I worked with the Yahoo Developer Network to get ColdFusion included in their Search API kit and to write up a ColdFusion Developer Center. Unfortunately, Yahoo has decided to drop the ColdFusion Developer Center. This is what I got on Twitter:

<blockquote>
ydn @cfjedimaster  we didn't get a renewed interest in #coldfusion from our community and we've been trying to streamline our site/offerings
</blockquote>

I protested this (well, on Twitter) but have yet to get a response. I also posted my <a href="http://developer.yahoo.net/forum/index.php?showtopic=2692&hl=coldfusion">query to their forums</a>. I'd <i>really</i> appreciate it folks ping them - either via Twitter or their forums, and let them know that you want to see ColdFusion represented. Crap - the content was written. They didn't have to pay anything for it (and I'd gladly keep it updated) so this <i>should</i> be a no brainer for them. Shoot - they have a <i>Silverlight</i> developer center. You can't tell me there are more SL devs then ColdFusion.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fyql1%{% endraw %}2Ezip'>Download attached file.</a></p>