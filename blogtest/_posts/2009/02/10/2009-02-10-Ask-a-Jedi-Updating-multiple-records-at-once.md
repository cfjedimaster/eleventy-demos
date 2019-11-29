---
layout: post
title: "Ask a Jedi: Updating multiple records at once"
date: "2009-02-10T21:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/02/10/Ask-a-Jedi-Updating-multiple-records-at-once
guid: 3232
---

Pema asks:

<blockquote>
<p>
How can I update multiple records with single click of a button
in ColdFusion?
</p>
</blockquote>

I had to double check with Pema to grok exactly what he meant, but basically, instead of the normal form where you edit one row of data, he had multiple rows of data and wanted to update them when the form was processed. This is pretty simple (advanced readers can skip ahead to the comments and make fun of my code) but he needed an example so I whipped something up.
<!--more-->
First, I wrote a template with a simple query and list of dynamic form fields:

<pre><code class="language-markup">
&lt;cfquery name="getArt" datasource="cfartgallery" maxrows="10"&gt;
select	artid, artname
from	art
&lt;/cfquery&gt;

&lt;form action="test.cfm" method="post"&gt;
&lt;table&gt;
&lt;cfloop query="getArt"&gt;
	&lt;tr&gt;
		&lt;cfoutput&gt;&lt;td&gt;&lt;input type="text" name="art_#artid#" value="#artname#" /&gt;&lt;/td&gt;&lt;/cfoutput&gt;
	&lt;/tr&gt;
&lt;/cfloop&gt;
&lt;/table&gt;
&lt;input type="submit" name="save" value="Save" /&gt;
&lt;/form&gt;
</code></pre>

My query grabbed the primary key and artname from the ColdFusion sample database cfartgallery. I create one text field for each row and pass the primary key value in the name of the form field.

Processing is rather simple as well:

<pre><code class="language-markup">
&lt;cfif structKeyExists(form, "save")&gt;
	&lt;cfloop item="field" collection="#form#"&gt;
		&lt;cfif findNoCase("art_", field)&gt;
			&lt;cfset artid = listLast(field, "_")&gt;
			&lt;cfquery datasource="cfartgallery"&gt;
			update	art
			set		artname = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#form[field]#"&gt;
			where	artid = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#artid#"&gt;
			&lt;/cfquery&gt;
 		&lt;/cfif&gt;
	&lt;/cfloop&gt;
&lt;/cfif&gt;
</code></pre>

If the save button was clicked, I loop over the form. If the form field begins with art_, I can grab the primary key using a list function. Then I do an update. 

That's it. Pretty simple, but hopefully it helps Pema and others who may be new to ColdFusion. I've included the complete template below.

<pre><code class="language-markup">
&lt;cfif structKeyExists(form, "save")&gt;
	&lt;cfloop item="field" collection="#form#"&gt;
		&lt;cfif findNoCase("art_", field)&gt;
			&lt;cfset artid = listLast(field, "_")&gt;
			&lt;cfquery datasource="cfartgallery"&gt;
			update	art
			set		artname = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#form[field]#"&gt;
			where	artid = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#artid#"&gt;
			&lt;/cfquery&gt;
 		&lt;/cfif&gt;
	&lt;/cfloop&gt;
&lt;/cfif&gt;

&lt;cfquery name="getArt" datasource="cfartgallery" maxrows="10"&gt;
select	artid, artname
from	art
&lt;/cfquery&gt;

&lt;form action="test.cfm" method="post"&gt;
&lt;table&gt;
&lt;cfloop query="getArt"&gt;
	&lt;tr&gt;
		&lt;cfoutput&gt;&lt;td&gt;&lt;input type="text" name="art_#artid#" value="#artname#" /&gt;&lt;/td&gt;&lt;/cfoutput&gt;
	&lt;/tr&gt;
&lt;/cfloop&gt;
&lt;/table&gt;
&lt;input type="submit" name="save" value="Save" /&gt;
&lt;/form&gt;
</code></pre>