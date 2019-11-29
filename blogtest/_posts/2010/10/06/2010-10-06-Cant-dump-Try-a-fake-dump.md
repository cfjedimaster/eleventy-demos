---
layout: post
title: "Can't dump? Try a fake dump."
date: "2010-10-06T18:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/10/06/Cant-dump-Try-a-fake-dump
guid: 3964
---

Earlier today on Twitter @samhamilton and I shared a few messages about finding a replacement for cfdump. Apparently, some ColdFusion hosts lock down access to internal Java components which unfortunately breaks cfdump. He linked to <a href="http://forum.hostek.com/showthread.php?77-Do-you-support-the-CFDUMP-tag&highlight=">this forum posting</a> as an example. I wasn't able to replicate that on my ColdFusion 901 server so it may be an issue with 8 only. Either way I thought it would be fun to see if I could recreate cfdump quickly. I wrote the following tag in about 20 minutes (10 minutes for the initial version, then about 10 more minutes later on for small changes). It works best with arrays, structs, and queries, but will try to display a component as well. It also sniffs for JSON strings and will automatically deserialize them. The layout is - of course - not optimal. But it gets the job done. Here is a sample screen shot:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/screen12.png" />

<p/>

I've attached a zip of the custom tag to the bottom of this entry. But for those who just want to see the code, I've pasted it below. Basically it just does a few type checks and iterates through the data, recursively calling itself where it makes sense. Definitely not rocket science but maybe it will be useful. Of course, normally you don't want to ever use cfdump in production. But I've often used it for error emails and other logging/reporting needs. 

<p/>

<b>Edit on October 7:</b> I added basic XML support.

<p/>

<code>
&lt;cfparam name="attributes.var"&gt;
&lt;cfparam name="attributes.top" default=""&gt;

&lt;cfif len(attributes.top) and not isNumeric(attributes.top)&gt;
	&lt;cfset attributes.top = ""&gt;
&lt;cfelseif isNumeric(attributes.top) and (attributes.top lte 0 or round(attributes.top) neq attributes.top)&gt;
	&lt;cfset attributes.top = ""&gt;
&lt;/cfif&gt;

&lt;cfif not structKeyExists(request, "_cffakedump")&gt;
	&lt;cfoutput&gt;
	&lt;style&gt;
	table, th, td {
		border: 1px solid black;	
	}
	td {
		padding: 5px;
	}
	th, .key {
		background-color: ##e3e392;
	}
	&lt;/style&gt;
	&lt;/cfoutput&gt;
	&lt;cfset request["_cffakedump"] = 0&gt;
&lt;cfelse&gt;
	&lt;!--- quick sanity check for pointers ---&gt;
	&lt;cfset request["_cffakedump"]++&gt;
	&lt;cfif request["_cffakedump"] gt 1000&gt;
		&lt;cfabort/&gt;
	&lt;/cfif&gt;
&lt;/cfif&gt;

&lt;cfif isSimpleValue(attributes.var)&gt;
	&lt;cfif attributes.var is ""&gt;
		&lt;cfoutput&gt;[empty string]&lt;/cfoutput&gt;
	&lt;cfelseif isJSON(attributes.var)&gt;
		&lt;cfset newVar = deserializeJSON(attributes.var)&gt;
		&lt;cfoutput&gt;&lt;table&gt;&lt;tr&gt;&lt;th&gt;JSON&lt;/th&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;&lt;/cfoutput&gt;
		&lt;cf_fakedump var="#newVar#" top="#attributes.top#"&gt;
		&lt;cfoutput&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;&lt;/cfoutput&gt;
	&lt;cfelse&gt;
		&lt;cfoutput&gt;#attributes.var#&lt;/cfoutput&gt;
	&lt;/cfif&gt;
&lt;cfelseif isArray(attributes.var)&gt;
	&lt;cfoutput&gt;
	&lt;table&gt;
		&lt;tr&gt;
			&lt;th colspan="2"&gt;array (#arraylen(attributes.var)# items)&lt;/th&gt;
		&lt;/tr&gt;
		&lt;cfif not len(attributes.top)&gt;
			&lt;cfset attributes.top = arrayLen(attributes.var)&gt;
		&lt;/cfif&gt;
		&lt;cfloop index="x" from="1" to="#min(arrayLen(attributes.var), attributes.top)#"&gt;
			&lt;tr valign="top"&gt;
				&lt;td class="key"&gt;#x#&lt;/td&gt;
				&lt;td&gt;
				&lt;cfif isSimpleValue(attributes.var[x])&gt;
					#attributes.var[x]#
				&lt;cfelse&gt;
					&lt;cf_fakedump var="#attributes.var[x]#" top="#attributes.top#"&gt;
				&lt;/cfif&gt;
				&lt;/td&gt;
			&lt;/tr&gt;
		&lt;/cfloop&gt;
	&lt;/table&gt;
	&lt;/cfoutput&gt;
&lt;cfelseif isObject(attributes.var)&gt;
	&lt;cfset data = getMetadata(attributes.var)&gt;
	&lt;cfoutput&gt;&lt;table&gt;&lt;tr&gt;&lt;th&gt;Component: #data.fullname#&lt;/th&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;&lt;/cfoutput&gt;
	&lt;cf_fakedump var="#data#"&gt;
	&lt;cfoutput&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;&lt;/cfoutput&gt;
&lt;cfelseif isStruct(attributes.var)&gt;
	&lt;cfoutput&gt;
	&lt;table&gt;
		&lt;tr&gt;
			&lt;th colspan="2"&gt;struct&lt;/th&gt;
		&lt;/tr&gt;
		&lt;cfloop item="key" collection="#attributes.var#"&gt;
			&lt;tr valign="top"&gt;
				&lt;td class="key"&gt;#key#&lt;/td&gt;
				&lt;td&gt;
				&lt;cfif isSimpleValue(attributes.var[key])&gt;
					#attributes.var[key]#
				&lt;cfelse&gt;
					&lt;cf_fakedump var="#attributes.var[key]#" top="#attributes.top#"&gt;
				&lt;/cfif&gt;
				&lt;/td&gt;
			&lt;/tr&gt;
		&lt;/cfloop&gt;
	&lt;/table&gt;
	&lt;/cfoutput&gt;
&lt;cfelseif isQuery(attributes.var)&gt;
	&lt;cfset cols = attributes.var.columnlist&gt;
	&lt;cfif not len(attributes.top)&gt;
		&lt;cfset attributes.top = attributes.var.recordCount&gt;
	&lt;/cfif&gt;

	&lt;cfoutput&gt;
	&lt;table&gt;
		&lt;tr&gt;
			&lt;th colspan="#listLen(cols)+1#"&gt;query (#attributes.var.recordcount# rows)&lt;/th&gt;
		&lt;/tr&gt;
		&lt;tr&gt;
			&lt;td&gt;&nbsp;&lt;/td&gt;
			&lt;cfloop index="c" list="#cols#"&gt;
			&lt;th&gt;#c#&lt;/th&gt;
			&lt;/cfloop&gt;
		&lt;/tr&gt;
		&lt;cfloop query="attributes.var" endrow="#min(attributes.var.recordCount,attributes.top)#"&gt;
			&lt;tr&gt;
				&lt;td class="key"&gt;#currentRow#&lt;/td&gt;
				&lt;cfloop index="c" list="#cols#"&gt;
				&lt;td&gt;
					&lt;!--- could be complex ---&gt;
					&lt;cfset theVal = attributes.var[c][currentRow]&gt;
					&lt;cfif isSimpleValue(theVal)&gt;
						#theVal#
					&lt;cfelse&gt;
						&lt;cf_fakedump var="#theVal#" top="#attributes.top#"&gt;
					&lt;/cfif&gt;
				&lt;/td&gt;
				&lt;/cfloop&gt;
			&lt;/tr&gt;
		&lt;/cfloop&gt;
	&lt;/table&gt;
	&lt;/cfoutput&gt;
&lt;cfelseif isXMLDoc(attributes.var) or isXMLNode(attributes.var)&gt;
	&lt;cfoutput&gt;
	&lt;table&gt;
		&lt;tr&gt;
			&lt;th colspan="2"&gt;&lt;cfif isXMLDoc(attributes.var)&gt;xml&lt;cfelseif isXmLNode(attributes.var)&gt;xml element&lt;/cfif&gt;&lt;/th&gt;
		&lt;/tr&gt;
		&lt;cfif isXMLDoc(attributes.var)&gt;
			&lt;cfset child = attributes.var.xmlRoot&gt;
			&lt;tr&gt;
				&lt;td&gt;#child.xmlName#&lt;/td&gt;
				&lt;td&gt;&lt;cf_fakedump var="#child#"&gt;&lt;/td&gt;
			&lt;/tr&gt;
		&lt;cfelseif isXMLNode(attributes.var)&gt;
			&lt;tr&gt;
				&lt;td&gt;xmlText&lt;/td&gt;
				&lt;td&gt;#attributes.var.xmlText#&lt;/td&gt;
			&lt;/tr&gt;
			&lt;cfset kids = attributes.var.xmlChildren&gt;
			&lt;cfloop index="x" from="1" to="#arrayLen(kids)#"&gt;
				&lt;tr&gt;
					&lt;td&gt;#kids[x].xmlname#&lt;/td&gt;
					&lt;td&gt;&lt;cf_fakedump var="#kids[x]#"&gt;&lt;/td&gt;
				&lt;/tr&gt;
			&lt;/cfloop&gt;
		&lt;/cfif&gt;
	&lt;/table&gt;
	&lt;/cfoutput&gt;
&lt;cfelse&gt;
	&lt;cfoutput&gt;[FakeDump] Sorry, I couldn't handle this data.&lt;/cfoutput&gt;
&lt;/cfif&gt;
</code><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Ffakedump1%{% endraw %}2Ezip'>Download attached file.</a></p>