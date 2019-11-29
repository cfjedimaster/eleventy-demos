---
layout: post
title: "Searching multiple ColdFusion SOLR Collections at once"
date: "2011-01-04T14:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/01/04/Searching-multiple-ColdFusion-SOLR-Collections-at-once
guid: 4072
---

Did you know that cfsearch allows you to search against multiple collections? As long as you aren't searching against categories you can search against as many collections you want. You simply add them to the COLLECTION attribute and go for it. However, a reader noticed something odd. His results were sorted by collection, not be score. So all the results for the first collection were returned in the results first followed by results in the second query. To test this myself I created two collections. The first contained all the HTML files from the ColdFusion docs. I called this collection cfref. I then created another collection of the Word docs from CFWACK. These are my own copies and are just a small part of the book but I thought it would give me nicely similar content to search against. I then tried the following code:
<!--more-->
<p>
<code>
&lt;cfsearch collection="cfref,cfwack" criteria="cflog" name="results" maxrows=20&gt;
&lt;cfdump var="#results#" show="score,title"&gt;
</code>

<p>

Which game me...

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip8.png" title="Something ain't quite kosher about these results..." />

<p>

As you can see, the Score resets back up for the second collection. Not good. So I suggested a simple query of query. That should work, right?

<p>

<code>
&lt;cfquery name="newresults" dbtype="query"&gt;
select title, score
from results
order by score desc
&lt;/cfquery&gt;
</code>

<p>

Nope. Didn't work at all. On a whim I looked at the metadata for the query and saw this:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip9.png" title="Crap - that's REALLY not right!" />

<p>

See the issue? The score is being returned as varchar. Heck, all the columns are, even recordssearched and size. That's definitely a bug. (I'll file a report for that in a minute.) Luckily the fix is easy enough - just cast your result.

<p>

<code>

&lt;cfquery name="newresults" dbtype="query"&gt;
select title, cast(score as decimal) as realscore
from results
order by realscore desc
&lt;/cfquery&gt;

&lt;cfdump var="#newresults#"&gt;
</code>

<p>

Which gives us...

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip10.png" title="Everything is now perfect. Sweeeeeet."  />

<p>

<b>P.S.</b> So this is interesting. Notice my use of maxrows? What happens if I use maxrows=5 against the data I mentioned above? I get <b>6</b> rows. Apparently the max applies <b>per collection</b>. On one had this is good - you are guaranteed to get the best results back. On the other hand if you just want N rows total, you are kind of screwed. Once again though a query of query will help.