---
layout: post
title: "Followup to CFGRID MultiRow Post"
date: "2010-09-16T22:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/09/16/Followup-to-CFGRID-MultiRow-Post
guid: 3944
---

A few weeks back I <a href="http://www.raymondcamden.com/index.cfm/2010/8/28/CF901-CFGRIDs-new-multirowselect-feature">blogged</a> about how you would make use of ColdFusion 901's new ability to have a multi-select cfgrid. As described in that post you need to make use of JavaScript to get the values selected. A reader asked me if I could "complete" the demo a bit and show actually performing database updates. Here is what I came up with.
<!--more-->
<p/>

To begin, we are going to make use of the cfartgallery database and the art table. It contains records for each piece of art. One of the columns is an isSold column that is a simple boolean. Let's make use of that:

<p/>

<code>
&lt;cfquery name="getArt" datasource="cfartgallery"&gt;
select artid, artname, issold
from art
&lt;/cfquery&gt;

&lt;script&gt;
function fixMe() {
	obj = ColdFusion.Grid.getSelectedRows('SelectStuff');
	var selected = "";
	for(var i=0; i&lt;obj.length; i++) {
		if(selected == "") selected = obj[i].ARTID;
		else selected += "," + obj[i].ARTID;
	}
	document.getElementById('selected').value = selected;
	return true;
}
&lt;/script&gt;

&lt;cfform name="mytest" method="post" onSubmit="return fixMe()"&gt;
	&lt;cfgrid name="SelectStuff" query="getart" format="html" width="400" height="250" multirowselect="true"&gt;
		&lt;cfgridcolumn name="artid" display="false"&gt;
		&lt;cfgridcolumn name="artname" header="Name"&gt;
		&lt;cfgridcolumn name="issold" header="Sold" type="boolean"&gt;
	&lt;/cfgrid&gt;
	&lt;input type="hidden" name="selected" id="selected"&gt;
	&lt;cfinput type="submit" name="submit" value="Mark Sold"&gt;
&lt;/cfform&gt;
</code>

<p/>

Compared to the last example, this one uses a real database query and also makes use of cfgridcolumn to nicely format the data. Make special note of the boolean type for issold. Here is the result.

<p/>


<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-09-16 at 8.17.28 PM.png" />

<p/>

Ok, so for the most part, that's the exact same code as the previous entry, now let's look at the processing of the data.

<p/>

<code>
&lt;cfif structKeyExists(form, "selected") and len(form.selected)&gt;
	&lt;cfquery datasource="cfartgallery"&gt;
	update art
	set issold = 1
	where artid in (&lt;cfqueryparam cfsqltype="cf_sql_integer" value="#form.selected#" list="true"&gt;)
	&lt;/cfquery&gt;
&lt;/cfif&gt;
</code>

<p/>

Pretty simple, right? Because our data is a list, and because cfqueryparam works well with lits, we can easily toggle the issold property based on the values selected in the grid. Here is the complete demo.

<p/>

<code>
&lt;cfif structKeyExists(form, "selected") and len(form.selected)&gt;
	&lt;cfquery datasource="cfartgallery"&gt;
	update art
	set issold = 1
	where artid in (&lt;cfqueryparam cfsqltype="cf_sql_integer" value="#form.selected#" list="true"&gt;)
	&lt;/cfquery&gt;
&lt;/cfif&gt;

&lt;cfquery name="getArt" datasource="cfartgallery"&gt;
select artid, artname, issold
from art
&lt;/cfquery&gt;

&lt;script&gt;
function fixMe() {
	obj = ColdFusion.Grid.getSelectedRows('SelectStuff');
	var selected = "";
	for(var i=0; i&lt;obj.length; i++) {
		if(selected == "") selected = obj[i].ARTID;
		else selected += "," + obj[i].ARTID;
	}
	document.getElementById('selected').value = selected;
	return true;
}
&lt;/script&gt;

&lt;cfform name="mytest" method="post" onSubmit="return fixMe()"&gt;
	&lt;cfgrid name="SelectStuff" query="getart" format="html" width="400" height="250" multirowselect="true"&gt;
		&lt;cfgridcolumn name="artid" display="false"&gt;
		&lt;cfgridcolumn name="artname" header="Name"&gt;
		&lt;cfgridcolumn name="issold" header="Sold" type="boolean"&gt;
	&lt;/cfgrid&gt;
	&lt;input type="hidden" name="selected" id="selected"&gt;
	&lt;cfinput type="submit" name="submit" value="Mark Sold"&gt;
&lt;/cfform&gt;

&lt;cfdump var="#form#"&gt;
</code>