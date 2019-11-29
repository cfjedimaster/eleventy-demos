---
layout: post
title: "Some criticisms on Solr in ColdFusion 9"
date: "2010-01-26T13:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/01/26/Some-criticisms-on-Solr-in-ColdFusion-9
guid: 3696
---

Recently Ryan Stille (one of the new ColdFusion ACPs) posted a <a href="http://www.raymondcamden.com/index.cfm/2009/10/30/Some-basic-SolrVerity-Differences#c9324ABC1-E28B-2975-6C4DBC3334AB2905">comment</a> on my blog entry, <a href="http://www.coldfusionjedi.com/index.cfm/2009/10/30/Some-basic-SolrVerity-Differences">Some Basic Solr/Verity Differences</a>. In that comment he pointed out that he was noticing differences in results returned by Verity and Solr. No big surprise there - but what was surprising was the <i>lack</i> of data returned by Solr. Spurred on by his comment I did some testing of mine and I have to say - I'm pretty disappointed. What follows are some findings in regards to testing <b>file based</b> collections in Solr and Verity. I'll point out that all of this has been brought to Adobe, so I'm not just complaining but actively trying to improve the problem for ColdFusion 9.X.X (i.e., whatever comes next).
<!--more-->
Before going further, please be sure you note the qualification I made above. These issues refer to <b>file based</b> collections of data. In other words, cases where you ask Verity/Solr to index files, like Word Docs, PDFs, and other binary formats. It does <b>not</b> refer to a collection that is built from your database.

For my testing I used Windows XP and a folder of 8 documents. This folder included 1 MP3, 4 PDFs, 2 Word docs, and one text file. I indexed both using the ColdFusion Administrator. My tests were done using <a href="http://cfadminsearcher.riaforge.org/">CF Admin Searcher</a>, a ColdFusion Admin extension that lets you perform ad hoc queries against Verity and Solr collections. I basically opened the tool up in two tabs and performed the same search in both to do my comparisons. Here is what I found:

1) The Summary field in results for Solr contained binary "junk". Verity cleaned this up. Example:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-01-26 at 12.18.33 PM.png" />

That result came from a MP3, which you expect to be 'dirty', but Verity correctly clears this from the summary. I also see these chars in PDF files as well. Word docs seemed fine though.

2) Solr failed to pick up the TITLE value for any binary file. Verity got them all. I also saw this in other metadata fields. Solr also missed the author field for example.

3) Solr failed to return any context values for results while Verity had no trouble. You should note that you have to perform a file edit to enable context with Solr (details here: <a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WSe9cbe5cf462523a0-5bf1c839123792503fa-8000.html">http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WSe9cbe5cf462523a0-5bf1c839123792503fa-8000.html</a>) but even with this change there was no additional text in my context.

4) While I wouldn't classify this as serious testing in any way, in every test, Verity searches were about twice as fast. Now we are talking about 15 versus 30 ms, which is not something to be concerned about, but Solr was supposed to be quite a bit fasting. (To be fair, my test suites are so small as to not really be relevant.)

5) The TYPE value for results is correct for Verity, but comes back as application/octet-stream for Solr. You don't <i>need</i> this column of course, you can sniff the extension, but still...

All in all, this is disappointing. I don't think I can recommend Solr (specifically, Solr as bundled in ColdFusion 9) for production use... at least for a collection that is heavily file based. You can, of course, do post-processing of search results to get metadata. ColdFusion 9 supports getting metadata from Word docs now, but you have to convert it to PDF first. That's something you would <i>definitely</i> want to cache though. 

As I said, both Ryan and I shared our findings with Adobe so I'm sure it will get corrected in the future. People making a decision about search support should consider carefully though. I don't think anyone thinks Verity will last much longer. Solr is definitely the future. But we've got a few bumps in the road to get past first.