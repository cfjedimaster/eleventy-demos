---
layout: post
title: "Google Docs CFC"
date: "2007-12-08T09:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/08/Google-Docs-CFC
guid: 2524
---

Yesterday I posted a <a href="http://www.raymondcamden.com/index.cfm/2007/12/7/Quick-example-of-the-Google-Docs-API">quick example</a> of integrating Google's Docs API with ColdFusion. I went ahead and wrapped up the code in a simple set of CFCs. There is a base CFC that handles authentication along with a docs CFC that handles the real interaction. Here is some sample code:

<code>
&lt;cfset docs = createObject("component", "docs")&gt;
&lt;cfset docs.authenticate("rcamden@gmail.com","foo")&gt;
</code>

This creates an instance of the CFC and logs the user on. If authentication fails, a CF error is thrown, so normally this would probably be wrapped in cfry/cfcatch.

To get all your documents, you would run:

<code>
&lt;cfset mydocs = docs.getDocumentList()&gt;
</code>

This returns a query. One of the columns contains the sourceurl, which can be used to grab the source:

<code>
&lt;cfset content = docs.download(mydocs.sourceurl[1])&gt;
&lt;cfoutput&gt;result is #content#&lt;/cfoutput&gt;
</code>

The getDocumentList() supports 2 filters (Google supports more). You can use max to limit the number of results:

<code>
&lt;cfset mydocs = docs.getDocumentList(max=9)&gt;
</code>

You can also apply a title filter:

<code>
&lt;cfset mydocs = docs.getDocumentList(title="Blog")&gt;
</code>

The title filter is a search, not a direct match.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FArchive14%{% endraw %}2Ezip'>Download attached file.</a></p>