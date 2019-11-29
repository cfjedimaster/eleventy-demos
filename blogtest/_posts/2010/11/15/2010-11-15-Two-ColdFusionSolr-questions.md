---
layout: post
title: "Two ColdFusion/Solr questions"
date: "2010-11-15T19:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/11/15/Two-ColdFusionSolr-questions
guid: 4014
---

After my <a href="http://www.raymondcamden.com/index.cfm/2010/11/12/Slides-code-from-ColdFusionSolr-presentation">presentation</a> last week I had a few ColdFusion/Solr questions to follow up on. Here are two of them.
<!--more-->
<p>

1) Can you use Solr with content indexed on Amazon S3?

<p>

Yes and no. The main answer is no. The code below is what I used to test:

<p>

<code>
 &lt;cfset s3dir = "s3://myaccess:mysecret@s3.coldfusionjedi.com"&gt;
&lt;cfdirectory directory="#s3dir#" name="files"&gt;

&lt;cfdump var="#files#"&gt;

&lt;cfoutput&gt;Indexing #s3dir#&lt;p&gt;&lt;/cfoutput&gt;

&lt;cfindex action="update" collection="indextest1" type="path" key="#s3dir#"
		 recurse="true" status="result" extensions=".txt,.pdf"&gt;
		 
&lt;cfdump var="#result#" label="Result of update operation"&gt;
</code>

<p>

When run, you get: <b>The key specified is not a directory: s3://myaccess:mysecret@s3.coldfusionjedi.com. The path in the key attribute must be a directory when type="path".</b> Obviously "myaccess" and "mysecret" were real values, but nonetheless, this isn't supported. I'm not terribly surprised by this ColdFusion speaks to Solr and asks it to index a folder but in this case the folder is only 'reachable' via ColdFusion. However, you <i>can</i> make use of S3 and Solr indexing. Whenever you move a file to S3, simply run the index operation first. Let Solr index the file and then push it off to S3. 

<p>

2) Can you index a file and a db record together in the same search "row". I know SOLR can handle it if you roll the code manually, but can this be done with the CF tags?

<p>

Again - yes and no. The tag that indexes file based data and query based data (cfindex) can only do one type at a time. So with just one tag you couldn't do this. However - if you read and parse the file yourself (for example, using cfpdf to read in the text of a pdf) you can then merge that textual data with any other database data when you add it to the index. I'm not sure how useful this would be. I could see merging file data with database information being stored in the custom fields though.