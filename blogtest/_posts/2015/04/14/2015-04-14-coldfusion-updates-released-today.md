---
layout: post
title: "ColdFusion Updates Released Today"
date: "2015-04-14T17:14:53+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2015/04/14/coldfusion-updates-released-today
guid: 6009
---

As the title says, multiple updates were released for ColdFusion today. One is an update to ColdFusion 10 (details may be found <a href="https://helpx.adobe.com/coldfusion/kb/coldfusion-10-update-16.html">here</a>) and the other is a rather big update to ColdFusion 11, <a href="https://helpx.adobe.com/coldfusion/kb/coldfusion-11-update-5.html">Update 5</a>. 

<!--more-->

You can see the complete list of bug fixes here: <a href="https://helpx.adobe.com/coldfusion/kb/bugs-fixed-in-coldfusion-11-update-5.html">Bugs fixed in ColdFusion 11 Update 5</a>. I want to call out one bug in particular that I'm happy is fixed: <a href="https://bugbase.adobe.com/index.cfm?event=bug&id=3818767">3818767: Serialization of query does not respect case</a>. 

ColdFusion 11 added a new way to serialize queries - "struct". You could pass this to the serializeJSON function or simply specify it as a default in Application.cfc. I discussed this in detail here: <a href="http://www.raymondcamden.com/2014/05/08/ColdFusion-11s-new-Struct-format-for-JSON-and-how-to-use-it-in-ColdFusion-10">ColdFusion 11’s new Struct format for JSON (and how to use it in ColdFusion 10)</a>. While this was cool, the columns were all uppercased when the JSON string was generated. So for example:

<code>[{% raw %}{"NAME":"ray","AGE":30}{% endraw %}]</code>

While still a better format, most people prefer lowercase. Now ColdFusion let's you specify a setting to tell ColdFusion to use the same case you used in the query. To enable this feature, add <code>this.serialization.preserveCaseForQueryColumn="true"</code> to your Application.cfc file. Here is a complete example.

<pre><code class="language-javascript">component {
	this.name="root";
	this.serialization.serializequeryas="struct";
	this.serialization.preserveCaseForQueryColumn="true";	
}</code></pre>

Now your query will serialize and respect the case you used when writing your SQL. 

Adobe forgot to update the docs for this, but luckily I still have edit access to the wiki. You can see this, and the other Application.cfc variables, here at the reference: <a href="https://wikidocs.adobe.com/wiki/display/coldfusionen/Application+variables">Application variables</a>