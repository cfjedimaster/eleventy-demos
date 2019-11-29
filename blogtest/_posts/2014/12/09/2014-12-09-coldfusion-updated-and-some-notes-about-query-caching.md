---
layout: post
title: "ColdFusion updated, and some notes about query caching"
date: "2014-12-09T14:45:31+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/12/09/coldfusion-updated-and-some-notes-about-query-caching
guid: 5421
---

Earlier today the ColdFusion team released a big update for ColdFusion 11 and 10. You can read the juicy details here: <a href="http://blogs.coldfusion.com/post.cfm/coldfusion-11-update-3-and-coldfusion-10-update-15-are-available-now">ColdFusion 11 Update 3 and ColdFusion 10 Update 15 are available now</a>. While looking over the release notes for ColdFusion 11, I saw this odd little gem:
<!--more-->

<blockquote>
Below caching functions now accept object instead of String parameter for CacheId attribute: 
1) cacheGet<br/>
2) cacheRemove<br/>
3) cacheGetMetadata<br/> 
4) cacheIdExists<br/>
</blockquote>

That seemed.... weird. So I went over to the ColdFusion docs for <a href="https://wikidocs.adobe.com/wiki/display/coldfusionen/CacheGet">cacheGet</a> and was disappointed to find that no one had updated this. When you make a change to the language, you need to update the docs as well. Release notes in an update are <i>not</i> enough. I'll raise this internally so hopefully it won't happen again. There is also the corresponding need of an update for ColdFusion Builder. I'd have to assume (and I can <strong>definitely</strong> be wrong!) that this language tweak would require a minor update to CFB, so that should have been released as well. Again, I'll raise this internally.

So what is this change about? I looked at the "Issues Fixed" document (<a href="https://cfdownload.adobe.com/pub/adobe/coldfusion/11/docs/ColdFusion_11_Update3_IssuesFixed.pdf">PDF link</a>) and discovered <a href="https://bugbase.adobe.com/index.cfm?event=bug&id=3741588">bug 3741588</a>. Oh, if you click that link and end up back the bug tracker home page... yeah that's a bug. Click it again. (sigh) 

From what I can read in the bug report by itisdesign, at some point there was a change for queries that were cached using cachedWithin/cachedAfter. If you do <strong>not</strong> specify a specific cache ID for the query, then a Java object is used for the ID instead. Here is an example.

<pre><code class="language-javascript">
q = queryNew("id", "cf_sql_varchar", [{% raw %}{id:"a"}{% endraw %}, {% raw %}{id:"b"}{% endraw %}]);
q2 = queryExecute("select * from q", {% raw %}{}, {dbtype:"query",cachedwithin:createTimeSpan(0,0,1,0)}{% endraw %});

q3 = queryExecute("select * from q", {% raw %}{}, {dbtype:"query",cachedwithin:createTimeSpan(0,0,1,0),cacheId:"mystuff"}{% endraw %});

ids = cacheGetAllIds("QUERY");
writeDump(ids);
</code></pre>

In the code above, I'm caching two queries, but I only specify a specific ID in the second one. Notice the result when I dump the IDs:

<a href="http://www.raymondcamden.com/wp-content/uploads/2014/12/localhost_8501_test_cfm.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2014/12/localhost_8501_test_cfm.png" alt="localhost_8501_test_cfm" width="592" height="384" class="alignnone size-full wp-image-5422" /></a>

Yep, a complex object. So the change is to allow this object to be passed as an ID value to various caching functions. Makes sense I suppose but wasn't obvious to me. While investigating this I came across this document (<a href="http://help.adobe.com/en_US/ColdFusion/10.0/Developing/WSe61e35da8d3185187f5cb36b135869d3836-7ffe.html">Enhanced query caching using Ehcache</a>) that talks about how queries may now be stored in fancy Ehcache versus ugly old school cache. This happened back in ColdFusion 10 and I knew it, but while reading it I discovered two new Application.cfc variables I had not heard of: cache.useInternalQueryCache and cache.querysize. These are <strong>not</strong> listed on the wiki so I fixed that: <a href="https://wikidocs.adobe.com/wiki/display/coldfusionen/Application+variables">Application variables</a>