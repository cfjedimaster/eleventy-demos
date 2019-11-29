---
layout: post
title: "ColdFusion Bloggers migrated to Node.js"
date: "2015-01-26T11:02:53+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2015/01/26/coldfusion-bloggers-migrated-to-node-js
guid: 5583
---

Yes, I did it again. If Adobe ever kills ColdFusion you can blame me. ;) This is just an FYI to let folks know I've rewritten <a href="http://www.coldfusionbloggers.org">ColdFusion Bloggers</a> as a Node.js site running on the AppFog platform. To be clear, no, I'm not trying to kill ColdFusion! I'm migrated off my old ColdFusion server and setting up my old sites in a simpler form because - well - I want my life to be simpler. My only real "server" will be this blog, and as I'm still adjusting the settings a bit and tuning WordPress, I want every other thing I run to be as simple and low-maintenance as possible. Plus - I also kinda want to get better at Node.js! 

<!--more-->

As before, if folks are curious about the code, I've put it up on GitHub for you to look at and laugh at: <a href="https://github.com/cfjedimaster/nodecfbloggers">https://github.com/cfjedimaster/nodecfbloggers</a>. To be clear, this is <strong>not</strong> meant to be an example of good Node.js programming. It is just meant to be... well.. an example. (And let me publicly thank Derick Bailey. After I posted about the CFLib migration, he shared some online training he created with me. I haven't had a chance to check it out yet, but I definitely appreciate him sharing his knowledge with me.)

For the most part the conversion was simple. As with CFLib, I wrote a script in ColdFusion that used <a href="https://github.com/marcesher/cfmongodb">CFMongoDB</a> to insert the data into Mongo. For folks curious as to how that looked, here is the script. 

<pre><code class="language-javascript">
mongoConfig = createObject('component','cfmongodb.core.MongoConfig').init(dbName=&quot;cfbloggers&quot;);

mongo = createObject('component','cfmongodb.core.MongoClient').init(mongoConfig);

blogquery = queryExecute(&quot;select id, name, description, url, rssurl, status from blogs&quot;);
writedump(var=blogquery,top=3);	

blogs = mongo.getDBCollection(&quot;blogs&quot;);
blogs.remove({});

entries = mongo.getDBCollection(&quot;entries&quot;);
entries.remove({});

entriesAdded = 0;
blogsAdded = 0;

for(i=1; i&lt;=blogquery.recordCount;i++) {
	row = blogquery.getRow(i);
	doc = {
		&quot;name&quot;:row.name,
		&quot;description&quot;:row.description,
		&quot;url&quot;:row.url,
		&quot;rssurl&quot;:row.rssurl,
		&quot;status&quot;:row.status		
	};
	blogs.save(doc);
	blogsAdded++;

	entryquery = queryExecute(&quot;select id, blogidfk, title, url, posted, content, categories, created from entries where blogidfk=:blog&quot;, {% raw %}{blog:row.id}{% endraw %});
	if(i == 1) writedump(var=entryquery,top=4);	
		
	for(k=1; k&lt;=entryquery.recordCount;k++) {
		row = entryquery.getRow(k);
		entrydoc = {
			&quot;blog&quot;:doc._id,
			&quot;title&quot;:row.title,
			&quot;url&quot;:row.url,
			&quot;posted&quot;:row.posted,
			&quot;content&quot;:row.content,
			&quot;categories&quot;:row.categories,
			&quot;created&quot;:row.created		
		};
		entries.save(entrydoc);
		entriesAdded++;
	
	}

}

writeOutput(&quot;&lt;p&gt;Done. Blogs added: #blogsAdded#. Entries added: #entriesAdded#&lt;/p&gt;&quot;);
</code></pre>

I then went about rebuilding the functionality with Node. I removed quite a bit - including all user management. I didn't have many users and the main functionality (alerts for keywords) can easily be done with <a href="https://ifttt.com">IFTTT</a>. I had an alert for my name that I've already moved over there. If folks need help with it, let me know. I also ripped out the jQuery UI, removed the Ajax page loading, and just simplified as much as possible.

Total side note: The better I get at front end stuff and server stuff - the more I want to make things as simple as possible. Am I alone in that?

During the rewrite there were two really interesting parts I enjoyed writing. First, here is how I handled running the aggregation every hour:

<pre><code class="language-javascript">
var cron = require('cron');
var cronJob = cron.job('0 * * * *', function() {
	aggregator.process();
	console.log('cron job complete');
});
cronJob.start();
</code></pre>

Even though I find the cron format confusing as hell, I love how simple that is. For folks not aware, don't forget ColdFusion 11 also lets you define scheduled tasks for an application. (I'll blog an example of that later this week. I haven't tried it yet and I want to set up a good demo.) You can read more about this Node module here: <a href="https://github.com/ncb000gt/node-cron">https://github.com/ncb000gt/node-cron</a>

The next part I enjoyed was parsing RSS feeds. I used <a href="https://github.com/danmactough/node-feedparser">Node-Feedparser</a>, which worked <i>incredibly</i> well. I had assumed that part of the rewrite was going to take me a few hours, but I finished in less than one. To be fair, it isn't <i>exactly</i> like the ColdFusion version. I'm not doing the conditional HTTP get, but with far fewer blogs to parse nowadays I'm not as concerned about it. On the flip side, cffeed doesn't let you parse RSS from pure data so I had to use the file system in the ColdFusion version. That's not something I had to worry about here.

Oh, and once again, I used <a href="http://www.formkeep.com">FormKeep</a> to handle my form. It works. It's simple. And it's free.

<p></p>