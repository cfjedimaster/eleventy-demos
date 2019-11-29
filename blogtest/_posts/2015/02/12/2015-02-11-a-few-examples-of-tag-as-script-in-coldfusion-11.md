---
layout: post
title: "A few examples of \"tag as script\" in ColdFusion 11"
date: "2015-02-12T05:34:50+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2015/02/12/a-few-examples-of-tag-as-script-in-coldfusion-11
guid: 5669
---

Yesterday I <a href="http://www.raymondcamden.com/2015/02/11/reminder-stop-using-the-old-cfc-based-tags-in-coldfusion-11">posted</a> a reminder that ColdFusion 11 developers can stop using the old "CFCs for Tags" feature that provided support for certain things in script. I mentioned that <i>everything</i> could be used in cfscript now and that the old CFCs were (sometimes, not always) a bit buggy.

<!--more-->

Brad Wood suggested I actually provide an example of this and I thought it was a good idea. I wrote up two quick demos that demonstrate the new syntax. This isn't super deep or anything, but hopefully it gives you a basic idea of how this new syntax looks. First, an example of a few different tags:

<pre><code class="language-javascript">cfhttp(url="http://www.cnn.com",result="cnnReq");
writeDump(cnnReq.responseHeader);

cfhttp(url="http://www.cnn.com",result="cnnReq",method="post") {
	cfhttpparam(type="formfield",name="something",value=createUUID());	
}
writeDump(cnnReq.responseHeader);

cfsearch(collection="test1", criteria="cat", name="searchResults");
writeDump(searchResults);

cffeed(action="read", source="http://feeds.feedburner.com/raymondcamdensblog", query="feed");
writeDump(feed);</code></pre>

Make note of how you can't use a result (ie, foo = goo()) in any of these calls and instead use an argument. That could be easily fixed and should be. Second, note how child tags are handled in the second cfhttp call. I don't have anything to add to it, but as I said, just note the syntax.

For the heck of it, I then wrote a second demo. This one takes an array of RSS URLs and uses cfthread to fetch them in parallel. It then merges the resultant queries and sorts them. A mini-aggregator if you will. 

<pre><code class="language-javascript">feeds = ["http://feeds.feedburner.com/raymondcamdensblog","http://www.cflib.org/rss","http://feeds.feedburner.com/ColdfusionbloggersorgFeed"];
threads = [];

//for each feed, use a thread to fetch rss
feeds.each(function(f,x) {
	var name = "get_#x#";
	threads.append(name);
	cfthread(name=name,feed=f) {
		cffeed(action="read", source=attributes.feed, query="feed");
		thread.feed = feed;
	}
});	

cfthread(action="join",name=threads.toList());
//copy thread queries out and create sql merge statement
sql = "";
feeds.each(function(f,x) {
	variables["feed#x#"] = cfthread["get_#x#"].feed;
	if(x &gt; 1) {
		sql &= " union ";
	}
	sql &= "select * from feed#x#";
});
merged = queryExecute(sql,{% raw %}{},{dbtype:"query"}{% endraw %});
//credit Vince Collins: https://vincentcollins.wordpress.com/2008/02/22/cffeed-dont-forget-you-can-cast-the-resulting-query-column/
merged = queryExecute("select content, title, rsslink, cast(publisheddate as date) as publisheddate from merged order by publisheddate desc", {% raw %}{}, {dbtype:"query"}{% endraw %});
writedump(var=merged,top=20);</code></pre>

I hope this helps!