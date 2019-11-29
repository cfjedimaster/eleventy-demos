---
layout: post
title: "Support for Collection, Index, and Search operations in Script-Based CFCs"
date: "2011-08-13T12:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/08/13/Support-for-Collection-Index-and-Search-operations-in-ScriptBased-CFCs
guid: 4326
---

Attached to this blog entry you will find support for adding Solr support to your script based CFCs. These CFCs act like the other tag wrappers in ColdFusion 9 and should be saved to your &lt;cfintall&gt;/customtags/com/adobe/coldfusion folder. <b>Please back up your base.cfc file first!</b> The other files are new. Here's an example of how your code may look.

<p/>

<code>
&lt;cfscript&gt;
c = new com.adobe.coldfusion.collection();
c.create(collection="test2",path=server.coldfusion.rootdir & "/collections");

idx = new com.adobe.coldfusion.index();
//q is a query I made earlier
r = idx.refresh(collection="test2",key="id",body="body",query=q,status=true);
writeDump(var=r,label="refresh");

mysearch = new com.adobe.coldfusion.search();
res = mysearch.search(criteria="cfabort",collection="cfdocs",maxrows=5,status="true");
&lt;/cfscript&gt;
</code>

<p/>

This code has been submitted to the CF engineering team for a future update, but it had not yet been heavily QAed. Use with caution.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fforblog1%{% endraw %}2Ezip'>Download attached file.</a></p>