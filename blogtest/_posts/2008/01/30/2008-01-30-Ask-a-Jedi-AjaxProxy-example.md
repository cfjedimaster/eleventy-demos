---
layout: post
title: "Ask a Jedi: AjaxProxy example"
date: "2008-01-30T16:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/30/Ask-a-Jedi-AjaxProxy-example
guid: 2624
---

Mike asks:

<blockquote>
<p>
I'm trying to do someting i think may be simple, but its method is eluding me. I want to get to grips with using the cfajaxproxy tag to allow me to have a cfselect that when selecting values will auto populate some information into
other fields, having pulled the info from the db.
</p>
</blockquote>

I've blogged about cfajaxproxy before and it's truly one of the most amazing tags ever added to the language. I quickly built up an example of what I think Mike was talking about. I first started with related selects that spoke to the cfartgallery demo datasource. I started with this since Forta had already written the code. ;)
<!--more-->
Here is what I began with:

<code>
&lt;cfform name="main"&gt;
	&lt;b&gt;Media:&lt;/b&gt; &lt;cfselect bind="cfc:art.getMedia()" bindonload="true" value="mediaid" display="mediatype" name="media"  /&gt;
	&lt;b&gt;Art:&lt;/b&gt; &lt;cfselect bind="cfc:art.getArt({% raw %}{media}{% endraw %})" bindonload="true" value="artid" display="artname" name="art"  /&gt;
</code>

Nothing too complex here. You select media and you get art populated in the second drop down. Now this is where I want to demonstrate the use of cfajaxproxy. I added a few form fields and other content:

<code>
	&lt;p&gt;
	&lt;b&gt;Description:&lt;/b&gt; &lt;cftextarea name="desc" id="desc" /&gt;&lt;br&gt;
	&lt;b&gt;Price:&lt;/b&gt; &lt;cfinput name="price" id="price" /&gt;&lt;br&gt;
	&lt;span id="img"&gt;&lt;/span&gt;
&lt;/cfform&gt;
</code>

I have 3 areas now. The first two, description and price, I want to populate with the description and price of the art. The span, img, will be populated with the art image. 

The first thing I want to do is bind to the art drop down. This will let me say, "When the art drop down changes, do something."

<code>
&lt;cfajaxproxy bind="cfc:art.getArtDetail({% raw %}{art.value}{% endraw %})" onSuccess="showDetail"&gt;
</code>

In this example, I've bound to the Art drop down, and I've called a CFC (the same CFC as before) to get more information about the art piece. I've then told the tag to run showDetail when done. That JavaScript function is rather trivial:

<code>
&lt;script&gt;
function showDetail(r) {
	document.getElementById("desc").value = r.DESCRIPTION;
	document.getElementById("price").value = r.PRICE;	
	var newbod = "&lt;img src='http://localhost/cfdocs/images/artgallery/" + r.LARGEIMAGE + "'&gt;";
	document.getElementById("img").innerHTML = newbod;
}
&lt;/script&gt;
</code>

Since my CFC method returns a struct, I can treat it in JavaScript pretty much the same way I treat it in ColdFusion. 

Here is the complete CFC code:

<code>
&lt;cfcomponent output="false"&gt;

  &lt;cfset variables.dsn="cfartgallery"&gt;

  &lt;!--- Get array of media types ---&gt;
  &lt;cffunction name="getMedia" access="remote" returnType="query"&gt;
     &lt;!--- Define variables ---&gt;
     &lt;cfset var data=""&gt;

     &lt;!--- Get data ---&gt;
     &lt;cfquery name="data" datasource="#variables.dsn#"&gt;
     SELECT mediaid, mediatype
     FROM media
     ORDER BY mediatype
     &lt;/cfquery&gt;

     &lt;!--- And return it ---&gt;
     &lt;cfreturn data&gt;
  &lt;/cffunction&gt;

  &lt;!--- Get art by media type ---&gt;
  &lt;cffunction name="getArt" access="remote" returnType="query"&gt;
     &lt;cfargument name="mediaid" type="numeric" required="true"&gt;

     &lt;!--- Define variables ---&gt;
     &lt;cfset var data=""&gt;

     &lt;!--- Get data ---&gt;
     &lt;cfquery name="data" datasource="#variables.dsn#"&gt;
     SELECT artid, artname
     FROM art
     WHERE mediaid = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#arguments.mediaid#"&gt;
     ORDER BY artname
     &lt;/cfquery&gt;

     &lt;!--- And return it ---&gt;
     &lt;cfreturn data&gt;
  &lt;/cffunction&gt;

  &lt;cffunction name="getArtDetail" access="remote" returnType="struct"&gt;
     &lt;cfargument name="artid" type="numeric" required="true"&gt;
     &lt;cfset var data=""&gt;
	 &lt;cfset var c = ""&gt;
	 &lt;cfset var s = structNew()&gt;
	 
     &lt;!--- Get data ---&gt;
     &lt;cfquery name="data" datasource="#variables.dsn#"&gt;
     SELECT *
     FROM art
     WHERE artid = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#arguments.artid#"&gt;
     &lt;/cfquery&gt;
	
	 &lt;cfloop list="#data.columnlist#" index="c"&gt;
		 &lt;cfset s[c] = data[c][1]&gt;
	 &lt;/cfloop&gt;
	 
     &lt;!--- And return it ---&gt;
     &lt;cfreturn s&gt;
  &lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

There isn't anything really complex here. Now here is the complete test document I used:

<code>
&lt;cfajaxproxy bind="cfc:art.getArtDetail({% raw %}{art.value}{% endraw %})" onSuccess="showDetail"&gt;

&lt;script&gt;
function showDetail(r) {
	document.getElementById("desc").value = r.DESCRIPTION;
	document.getElementById("price").value = r.PRICE;	
	var newbod = "&lt;img src='http://localhost/cfdocs/images/artgallery/" + r.LARGEIMAGE + "'&gt;";
	document.getElementById("img").innerHTML = newbod;
}
&lt;/script&gt;
 
&lt;cfform name="main"&gt;
	&lt;b&gt;Media:&lt;/b&gt; &lt;cfselect bind="cfc:art.getMedia()" bindonload="true" value="mediaid" display="mediatype" name="media"  /&gt;
	&lt;b&gt;Art:&lt;/b&gt; &lt;cfselect bind="cfc:art.getArt({% raw %}{media}{% endraw %})" bindonload="true" value="artid" display="artname" name="art"  /&gt;
	&lt;p&gt;
	&lt;b&gt;Description:&lt;/b&gt; &lt;cftextarea name="desc" id="desc" /&gt;&lt;br&gt;
	&lt;b&gt;Price:&lt;/b&gt; &lt;cfinput name="price" id="price" /&gt;&lt;br&gt;
	&lt;span id="img"&gt;&lt;/span&gt;
	
&lt;/cfform&gt;
</code>

Pay special attention to how simple the code is here. The only JavaScript isn't really that complex.

I hope this example helps.