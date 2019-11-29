---
layout: post
title: "Ask a Jedi followup - updating multiple records at once"
date: "2009-09-28T14:09:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/09/28/Ask-a-Jedi-followup-updating-multiple-records-at-once
guid: 3544
---

Here is a quick follow up to a blog entry I did back in February: <a href="http://www.raymondcamden.com/index.cfm/2009/2/10/Ask-a-Jedi-Updating-multiple-records-at-once">Ask a Jedi: Updating multiple records at once</a>. I had more than one person ask me to modify the code from that example to handle multiple fields per record. The template I had created only allowed you to edit the name. Here is a simple example that builds upon the first version and allows you to edit the description and price as well.
<!--more-->
First, let's modify the display a bit to show the additional fields:

<code>
&lt;cfquery name="getArt" datasource="cfartgallery" maxrows="10"&gt;
select    artid, artname, description, price
from    art
&lt;/cfquery&gt;

&lt;form action="test2.cfm" method="post"&gt;
&lt;table&gt;
	&lt;tr&gt;
		&lt;th&gt;Name&lt;/th&gt;
		&lt;th&gt;Description&lt;/th&gt;
		&lt;th&gt;Price&lt;/th&gt;
	&lt;/tr&gt;
&lt;cfloop query="getArt"&gt;
    &lt;tr valign="top"&gt;
        &lt;cfoutput&gt;
			&lt;td&gt;&lt;input type="text" name="art_#artid#" value="#artname#" /&gt;&lt;/td&gt;
			&lt;td&gt;&lt;textarea name="desc_#artid#"&gt;#description#&lt;/textarea&gt;&lt;/td&gt;
			&lt;td&gt;&lt;input type="text" name="price_#artid#" value="#price#"&gt;&lt;/td&gt;
		&lt;/cfoutput&gt;
    &lt;/tr&gt;
&lt;/cfloop&gt;
&lt;/table&gt;
&lt;input type="submit" name="save" value="Save" /&gt;
&lt;/form&gt;
</code>

Compared to the first version, this one gets additional columns in the query and displays them in the table. Notice that I used a similar naming scheme for my two new columns: desc_X and price_X. X represents the ID (primary key) of the art record.

Saving these new columns just requires a bit more code:

<code>
&lt;cfif structKeyExists(form, "save")&gt;
    &lt;cfloop item="field" collection="#form#"&gt;
        &lt;cfif findNoCase("art_", field)&gt;
            &lt;cfset artid = listLast(field, "_")&gt;
            &lt;cfset desc = form["desc_" & artid]&gt;
            &lt;cfset price = form["price_" & artid]&gt;
            &lt;cfquery datasource="cfartgallery"&gt;
            update	art
            set		artname = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#form[field]#"&gt;,
					description = &lt;cfqueryparam cfsqltype="cf_sql_longvar" value="#desc#"&gt;,
					price = &lt;cfqueryparam cfsqltype="cf_sql_numeric" value="#price#" scale="2"&gt;
            where    artid = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#artid#"&gt;
            &lt;/cfquery&gt;
        &lt;/cfif&gt;
    &lt;/cfloop&gt;
&lt;/cfif&gt;
</code>

Since I already grabbed the ID record from the art_X field, I could then use that to grab both the description and price values. I then just added those two fields to the query. The code could use a bit of validation. In the past when I've done something like this I've used an array of results. So for each update I could display which saved ok and which did not, or perhaps just output the rows that didn't update properly. You could also add jQuery validation to the form in about five minutes as well. 

Shoot - I just tried and it took me 6 minutes. Dang. Here is the full version with jQuery validation added.

<code>
&lt;cfif structKeyExists(form, "save")&gt;
    &lt;cfloop item="field" collection="#form#"&gt;
        &lt;cfif findNoCase("art_", field)&gt;
            &lt;cfset artid = listLast(field, "_")&gt;
            &lt;cfset desc = form["desc_" & artid]&gt;
            &lt;cfset price = form["price_" & artid]&gt;
            &lt;cfquery datasource="cfartgallery"&gt;
            update	art
            set		artname = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#form[field]#"&gt;,
					description = &lt;cfqueryparam cfsqltype="cf_sql_longvar" value="#desc#"&gt;,
					price = &lt;cfqueryparam cfsqltype="cf_sql_numeric" value="#price#" scale="2"&gt;
            where    artid = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#artid#"&gt;
            &lt;/cfquery&gt;
        &lt;/cfif&gt;
    &lt;/cfloop&gt;
&lt;/cfif&gt;

&lt;cfquery name="getArt" datasource="cfartgallery" maxrows="10"&gt;
select    artid, artname, description, price
from    art
&lt;/cfquery&gt;

&lt;html&gt;

&lt;head&gt;
&lt;script src="/jquery/jquery.js"&gt;&lt;/script&gt;
&lt;script src="/jquery/jquery.validate.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function(){
	$("#myForm").validate({
		rules: {
		&lt;cfoutput query="getArt"&gt;
			art_#artid#:"required",
			desc_#artid#:"required",
			price_#artid#: {
				required:true,
				number:true,
				min:0
			},
		&lt;/cfoutput&gt;
		}
	});
});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;form action="test2.cfm" method="post" id="myForm"&gt;
&lt;table&gt;
	&lt;tr&gt;
		&lt;th&gt;Name&lt;/th&gt;
		&lt;th&gt;Description&lt;/th&gt;
		&lt;th&gt;Price&lt;/th&gt;
	&lt;/tr&gt;
&lt;cfloop query="getArt"&gt;
    &lt;tr valign="top"&gt;
        &lt;cfoutput&gt;
			&lt;td&gt;&lt;input type="text" id="art_#artid#" name="art_#artid#" value="#artname#" /&gt;&lt;/td&gt;
			&lt;td&gt;&lt;textarea id="desc_#artid#" name="desc_#artid#"&gt;#description#&lt;/textarea&gt;&lt;/td&gt;
			&lt;td&gt;&lt;input type="text" id="price_#artid#" name="price_#artid#" value="#price#"&gt;&lt;/td&gt;
		&lt;/cfoutput&gt;
    &lt;/tr&gt;
&lt;/cfloop&gt;
&lt;/table&gt;
&lt;input type="submit" name="save" value="Save" /&gt;
&lt;/form&gt;
</code>