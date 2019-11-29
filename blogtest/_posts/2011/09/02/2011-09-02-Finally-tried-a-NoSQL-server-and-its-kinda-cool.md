---
layout: post
title: "Finally tried a NoSQL server... and it's kinda cool"
date: "2011-09-02T12:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/09/02/Finally-tried-a-NoSQL-server-and-its-kinda-cool
guid: 4351
---

About a year or so ago I was lucky enough to catch a presentation from Marc Esher where he discussed NoSQL and <a href="http://www.mongodb.org/">MongoDB</a> in particular. I found it interesting - but I filed it away as one of those cool technologies that I probably wouldn't ever have a good reason to actually use. Fast forward a year or so and I found myself thinking more about <a href="http://www.openamplify.com/">OpenAmplify</a> and their API. Readers here know I've done a few blog posts on their text analysis API. One of the things I normally mention in my posts is that their API could be critical for a site that contains a lot of user generated content. It occurred to me that I know a site like that... this one.

<p/>

Now - my blog does not get a lot of traffic in the grand scheme of things. But I have been running it for over 9 years. So while I don't get a lot of content every day (I average 12 or so comments per day), I do have a large set of data to look at (44000+ comments). As an experiment, I thought it would be interesting to run OpenAmplify against <b>all 44000+</b> comments and see what kind of text analysis I could get from it. This quest involved two main aspects:

<p/>

<ol>
<li>Getting the analysis. OpenAmplify has an <i>incredibly</i> simple API. Basically send it text and get stuff back. This part I wasn't worried about.
<li>Report on stats. So that would be easy - once I have my data stored. Right?
</ol>
<!--more-->
<p>

Turned out the second item was a bit difficult. When you send your text to OpenAmplify, you get a lot of data back. I mean a <b>lot</b> of data. How big? Check out this screen shot. It's a portion of the result. If you click it, it will take you to a 1 meg picture of the entire cfdump.

<p>


<a href="http://www.raymondcamden.com/images/biggestdumpever.png"><img src="https://static.raymondcamden.com/images/cfjedi/biggestdumpever_small.png" title="Click me for the largest struct ever."></a>

<p>

So the immediate issue I had was... how do I store this? Storing a structure into a database isn't impossible. You can simply flatten it. So a struct like so:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip171.png" />

<p>

Could be stored into a database table with these columns: age, gender, name_firstname, and name_lastname. But that struct was simple. What happens when you deeply nested structs? Arrays? Or the monster you see above. You get the idea. We've got a storage problem. Enter MongoDB.

<p>

One of the most interesting aspects of the NoSQL space is that they allow you to arbitrarily store complex data. That's what I was told anyway. I thought I'd take a look at how real that claim was. I began by downloading MongoDB and setting it up. Their <a href="http://www.mongodb.org/display/DOCS/Home">docs</a> are really well done and they have specific instructions for each operating system. I was up and running in about five minutes. Next is the ColdFusion aspect. For a while now Marc Esher has worked on a wrapper for MongoDB called <a href="https://github.com/marcesher/cfmongodb">CFMongoDB</a>. (He really should come up with some kind of a neater name. Maybe something with Cold in it!) I downloaded his code as well and took it for a spin. I had his sample code up and running rather quickly so installation of the bits was no longer a problem.

<p>

Ok - so let's back up a bit and talk about the process. I began by creating a CFM script that I could schedule. It would take a few hundred blog comments that had not yet been processed, run OpenAmplify on them, and store the result as a JSON string to the database. Here is that script:

<p>

<code>
&lt;cfsetting requesttimeout="999"&gt;
&lt;cfset dsn = "myblog"&gt;
&lt;cfset oakey = "moo"&gt;

&lt;!--- get total count ---&gt;
&lt;cfquery name="getCommentCount" datasource="#dsn#"&gt;
select count(id) as total
from	tblblogcomments
&lt;/cfquery&gt;

&lt;cfoutput&gt;
There are #numberFormat(getCommentCount.total)# comments.&lt;br/&gt;
&lt;/cfoutput&gt;

&lt;!--- get what we need to analyze ---&gt;
&lt;cfquery name="getCommentCount" datasource="#dsn#"&gt;
select count(id) as total
from	tblblogcomments
where	analysis is null
&lt;/cfquery&gt;

&lt;cfoutput&gt;
There are #numberFormat(getCommentCount.total)# comments to be analyzed.&lt;br/&gt;
&lt;/cfoutput&gt;
&lt;cfflush&gt;

&lt;!--- get a sub set ---&gt;
&lt;cfquery name="getComments" datasource="#dsn#"&gt;
select	id, comment
from	tblblogcomments
where	analysis is null
and		comment is not null and comment != ''
limit 0,600
&lt;/cfquery&gt;
&lt;cfset oa = new openamplify(oakey)&gt;

&lt;cfloop query="getComments"&gt;
	&lt;cftry&gt;
		&lt;cfset analysis = oa.parse(text=comment,analysis="all")&gt;
		&lt;cfset json = serializeJSON(analysis)&gt;
		&lt;cfquery datasource="#dsn#"&gt;
		update tblblogcomments
		set analysis = &lt;cfqueryparam cfsqltype="cf_sql_longvarchar" value="#json#"&gt;
		where id = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#id#"&gt;
		&lt;/cfquery&gt;
		&lt;cfif currentRow mod 10 is 0&gt;
			&lt;cfoutput&gt;Processed row #currentRow#&lt;br/&gt;&lt;cfflush&gt;&lt;/cfoutput&gt;
		&lt;/cfif&gt;
		&lt;cfcatch&gt;
			&lt;cfoutput&gt;Skipped #id# because: #cfcatch.message#&lt;br/&gt;&lt;/cfoutput&gt;
			&lt;!--- todo - save as {}? ----&gt;
		&lt;/cfcatch&gt;
	&lt;/cftry&gt;
&lt;/cfloop&gt;

&lt;cfoutput&gt;
&lt;p&gt;
Done. Processed #getComments.recordCount# items.
&lt;/cfoutput&gt;
</code>

<p>

So why did I store the string in the database? I wanted a temporary solution while I was still learning MongoDB. I also knew it would take a few days to process all 44K entries. The OpenAmplify folks were kind enough to give me an increase in my usage, but I still planned for this to run over a week. (I believe it only took 3 days though.) Essentially I used the database here as a simple storage place for large JSON strings. 

<p>

The flip side then was to take that JSON and store it into MongoDB. MongoDB takes any data, right?

<p>

<code>
&lt;cfsetting requesttimeout="999"&gt;
&lt;cfscript&gt;
	dbName = "deepcomment";
	javaloaderFactory = createObject('component','cfmongodb.core.JavaloaderFactory').init();
	mongoConfig = createObject('component','cfmongodb.core.MongoConfig').init(dbName=dbName, mongoFactory=javaloaderFactory);
	mongo = createObject('component','cfmongodb.core.Mongo').init(mongoConfig);

	collectionName = "comments";
	comments = mongo.getDBCollection( collectionName );

	//wipe out and start over
	comments.remove({});

	numComments = comments.count();

	//get comments with analysis
	q = new com.adobe.coldfusion.query();    
    q.setDatasource("myblog");    
    q.setSQL("select id, entryidfk, name, email, comment, analysis, posted from tblblogcomments where analysis is not null");    
    commentQuery = q.execute().getResult();

	writeOutput("Found #numberFormat(numComments)# comments&lt;br&gt;");
	writeOutput("Found #numberFormat(commentQuery.recordCount)# comments in the database&lt;br&gt;");

    
	//populate the articles collection if we need to
	if( commentQuery.recordCount gt 0 ){
		all = [];

		for( i = 1; i LTE commentQuery.recordCount; i++){

			comment = {
				id=commentQuery.id[i], 
				entryidfk=commentQuery.entryidfk[i],
				name=commentQuery.name[i],
				email=commentQuery.email[i],
				posted=commentQuery.posted[i],
				analysis=deserializeJSON(commentQuery.analysis[i])
				};
			arrayAppend( all, comment );

			if(i mod 1000 == 0) {
				comments.saveAll( all );
				all = [];
				writelog(file="application",text="inserted #i#, #arrayLen(all)#");
			}

		}

		comments.saveAll( all );
		writeOutput("inserted #i-1# comments&lt;br&gt;");
	}

	//get an idea of what the data look like
	first = comments.find(sort={% raw %}{"ID"=-1}{% endraw %},limit=5);
	writeDump( var=first.asArray(), label="first 5 comments", expand="false" );

	mongo.close();

&lt;/cfscript&gt;
</code>

<p>

If you've never seen any MongoDB (or CFMongoDB) code before, let me explain it. (And let me be very clear here. I'm new to this whole area. If I screw anything up here terminology wise, I apologize in advance!) I begin by initializing the CFMongoDB wrappers. That would normally be within an Application.cfc (and in fact, I moved it a bit later). But you can think of that as simply the setup of the connection between ColdFusion and MongoDB. By the way, MongoDB suffers from the same serious fault as ColdFusion. It doesn't work well if you forget to run it. Yes - I did that a lot. 

<p>

I created an arbitrary collection to store my data and called it comments. The remove function there was used because my code was nuking and recreating while I tested. You do not have to do this in production. (And should not I assume.) 

<p>

Next I ran a query to get my comments (the one with analysis). I loop over the results and for each one, I create a structure that contains information about the comment as well as the deserialized analysis structure from OpenAmplify. This struct is added to an array which then gets passed to MongoDB. 

<p>

And it worked. Just like that. That ginourmous set of data just... got stored. I didn't have to translate it to a table at all. The only real issue I ran into was memory management. You can see I nuke the array every 1000 items. That was ColdFusion/RAM related, not MongoDB's fault.

<p>

Finally at the end there you can see me getting a set of data just to look at and ensure things are kosher. "Getting" stuff is where things get interesting.

<p>

So - MongoDB supports a few interesting ways to fetch your data. You can do a find command based on a key. So for example, here is one example of that:

<p>

<code>
 var cursor=db.comments.find({% raw %}{"ANALYSIS.Topics.TopTopics.Topic.Name":"grid"}{% endraw %})
</code>

<p>

That long key name there is straight from OpenAmplify. MongoDB knows then to search for this particular key in the data and also handles the fact that not every instance will have that key. You can do distinct counts. You can do counts. You can get and sort. There's an interesting <a href="http://www.mongodb.org/display/DOCS/SQL+to+Mongo+Mapping+Chart">SQL to Mongo</a> chart that gives a lot of examples of this. Once you wrap your head around it, it almost feels a bit more natural than SQL. Here is an example that allows me to enter a keyword and get a report on how many times it showed up in comments:

<p>

<code>
&lt;cfparam name="form.keyword" default=""&gt;

&lt;cfoutput&gt;
&lt;form method="post"&gt;
	Keyword: &lt;input type="text" name="keyword" value="#form.keyword#"&gt; &lt;input type="submit" value="Look Up" /&gt;
&lt;/form&gt;
&lt;/cfoutput&gt;

&lt;cfif len(trim(form.keyword))&gt;
	&lt;cfset comments = application.mongo.getDBCollection(application.collectionName)&gt;
	&lt;cfset criteria = {% raw %}{ "ANALYSIS.Topics.TopTopics.Topic.Name"=form.keyword}{% endraw %}&gt;
	
	&lt;!--- case sensitive ---&gt;
	&lt;!---
	&lt;cfset res = comments.count(criteria=criteria)&gt;
	---&gt;
	&lt;cfset res = comments.query().regex("ANALYSIS.Topics.TopTopics.Topic.Name","(?i)#form.keyword#").count()&gt;
	&lt;cfoutput&gt;The keyword #form.keyword# comes up #res# time(s).&lt;/cfoutput&gt;
	
&lt;/cfif&gt;
</code>

<p>

Note how I point to the key - that's actually an array. But MongoDB handles that just fine. The only issue I ran into was case sensitivity. You can see my original example was a bit simpler. To make it case insensitive I had to switch to a regex. 

<p>

So that's all fine and good - but for deeper work you need to use what's called <a href="http://www.mongodb.org/display/DOCS/MapReduce">MapReduce</a>. This is... I don't know. It's insane Ninja Voodoo to me. My gut feeling is that it's something along the lines of...

<p>

<ul>
<li>Here is an arbitrary function to run on each object...
<li>It outputs a basic stat
<li>And then I store those stats
<li>And then I query against that stat
</ul>

<p>

That's a pretty poor explanation. Essentially it is a two step process. My understanding is that the "reduce" part is normally done behind the scenes on a schedule since it involves the most work. The reporting then is done against the reduced data so that it runs a lot quicker. Here is a example. (And thanks again to Marc Esher for producing an example for me.)

<p>

<code>

&lt;cfscript&gt;
	
	comments = application.mongo.getDBCollection( application.collectionName );

	map = "
		function() {
			if(""ANALYSIS"" in this && ""Topics"" in this.ANALYSIS) {
				for(var i=0; i&lt;this.ANALYSIS.Topics.TopTopics.length;i++) {
					var topicOb = this.ANALYSIS.Topics.TopTopics[i];
					if(topicOb.Topic != null) {
						emit(topicOb.Topic.Name, {% raw %}{count:1}{% endraw %});
					}
					
				}
			}
		}	
	";
	
	reduce = "
		function(key, emits){
			var total = 0;

			for( var i in emits ){
				total += emits[i].count;
			}
			return {% raw %}{count: total}{% endraw %};
		}
	";


	result = comments.mapReduce( map=map, reduce=reduce, outputTarget="comment_topic_rank", options={} );

	ranks = application.mongo.getDBCollection("comment_topic_rank");
	sorted = ranks.find(sort={% raw %}{"value.count"=-1}{% endraw %},limit=20);

&lt;/cfscript&gt;

&lt;h2&gt;Keyword Report&lt;/h2&gt;
&lt;table border="1"&gt;
	&lt;tr&gt;
		&lt;th&gt;Keyword&lt;/th&gt;
		&lt;th&gt;Count&lt;/th&gt;
	&lt;/tr&gt;
	
&lt;cfloop index="item" array="#sorted.asArray()#"&gt;
	&lt;cfoutput&gt;
	&lt;tr&gt;
		&lt;td&gt;#item._id#&lt;/td&gt;
		&lt;td&gt;#numberFormat(item.value["count"])#&lt;/td&gt;
	&lt;/tr&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;

&lt;/table&gt;		
</code>

<p>

This template reports on all the topics in my database. While I had 44K comments, each comment had 1-N topics. This one will loop over each item, loop over each topic, and store the count. This gets stored into comment_topic_rank (the reduced data?) and once I have that, it's trivial to sort against. For folks curious about my stats, here is the report:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip172.png" />

<p>

This takes about 8 seconds to generate - but again - I'm regenerating the reduced data when I don't need to. And frankly - considering the amount of data it's parsing - that still seems rather fast. Here is another example that looks at the Mood data (how happy/sad are my comments):

<p>

<code>
&lt;cfscript&gt;
	
	comments = application.mongo.getDBCollection( application.collectionName );

	map = "
		function() {
			if(""ANALYSIS"" in this && ""Styles"" in this.ANALYSIS) {
				emit(this.ANALYSIS.Styles.Polarity.Mean.Name, {% raw %}{count:1}{% endraw %});
			}
		}	
	";
	
	reduce = "
		function(key, emits){
			var total = 0;

			for( var i in emits ){
				total += emits[i].count;
			}
			return {% raw %}{count: total}{% endraw %};
		}
	";


	result = comments.mapReduce( map=map, reduce=reduce, outputTarget="comment_mood_rank", options={} );

	ranks = application.mongo.getDBCollection("comment_mood_rank");
	sorted = ranks.find(sort={% raw %}{"value.count"=-1}{% endraw %},limit=20);

&lt;/cfscript&gt;

&lt;h2&gt;Mood Report&lt;/h2&gt;
&lt;table border="1"&gt;
	&lt;tr&gt;
		&lt;th&gt;Keyword&lt;/th&gt;
		&lt;th&gt;Count&lt;/th&gt;
	&lt;/tr&gt;
	
&lt;cfloop index="item" array="#sorted.asArray()#"&gt;
	&lt;cfoutput&gt;
	&lt;tr&gt;
		&lt;td&gt;#item._id#&lt;/td&gt;
		&lt;td&gt;#numberFormat(item.value["count"])#&lt;/td&gt;
	&lt;/tr&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;

&lt;/table&gt;		
</code>

<p>

Which results in...

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip173.png" />

<p>

All in all - pretty fascinating I think. Imagine how useful that would be to a company like Sony? Using OpenAmplify to parse comments as they come in real time, store them in MongoDB, and provide a live report of the mood on their forums. Even if a bit delayed, it could very well be a critical way to notice when something swings the mood. If customer service reps see a big drop, it could mean some breaking story (oh, like a security issue) that they need to address. 

<p>

Anyway - I'm pretty darn impressed by MongoDB and the CFMongoDB wrapper. Do I think I'll be using it soon in production? I don't know. I think in this use case it was incredibly well suited. I would have shot myself before attempting to convert that large structure into a set of tables. It's nice to know that when such an issue does rise again, I'll have a good tool to make use of.

<h2>Some Final Notes</h2>

<ul>
<li>Stalk <a href="http://blog.mxunit.org/">Marc Esher</a>. No, seriously, do it. I've seen him present 3 times now. The first one was on continuous integration and Hudson. It changed my life. Seriously. The second time was this crap. Epic. Last time it was on ORM (and the issues you encounter). Not new to me, but his presentation did a damn good job of summarizing the issues. I've yet to see him give a bad presentation. Of course, now that I've said this I've probably created unrealistic expectations. ;)
<li>Run MongoDB at the command line and pay attention to it. You can actually output debug messages to the console while working and I found that to be very helpful to my testing.
<li>I've already linked to the MongoDB docs - but also check out their excellent <a href="http://cookbook.mongodb.org/">cookbook</a>. 
<li>Don't forget the report any issues you have with CFMongoDB. I found a few small bugs while running it so I made sure to actually report them on the Github site. It's amazing how few people actually bother to do so. As an open source developer, let me make it clear. <b>We can't fix bugs we don't know about.</b> 
</ul>