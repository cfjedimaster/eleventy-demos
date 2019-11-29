---
layout: post
title: "Warning about cfgrid bug"
date: "2010-10-20T08:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/10/20/Warning-about-cfgrid-bug
guid: 3976
---

This week I was working on a cfgrid example for a reader. He needed some help understanding the FORM data on the server side when you've done multiple edits to a grid (and if folks want me to pass along what I told him, just say). It's a bit complex so I wrote up a quick demo and explained how the form data related to what was done on the client side.
<!--more-->
<p/>

During this work I discovered an unfortunate bug with cfgrid and editable grids. If your grid supports deletes along with edits (by using delete="true" in the cfgrid tag), you can run into an issue where <i>one</i> of your edits will not be passed to the server. What I noticed was that if I edited rows A and B, and then deleted some row C, my form data included the edits for A and the delete for C, but completely lost the edit for B. 
<p/>

I was able to reproduce this in two browsers, and Adam Tuttle was able to reproduce it as well. I've file a <a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=84683">bug report</a> for it and if you want to quickly test this yourself, just try the code below. 

<p/>

Unfortunately there isn't really a workaround for this. For now I simply do not recommend using an editable grid that supports delete as well.

<p/>

<code>
&lt;cfquery name="art" datasource="cfartgallery" maxrows="10"&gt;
select *
from art
&lt;/cfquery&gt;
&lt;cfform name="gridform1"&gt;

   &lt;cfgrid name ="test_data"
       format="html"
       font="Tahoma"
       fontsize="12"
       query = "art"
       selectmode="edit"
       striperows="yes"
		 delete="true"
                &gt;
&lt;cfgridcolumn name="artid" display="false" /&gt;

&lt;cfgridcolumn name="artname" display="true" header="Art" select="no" /&gt;
&lt;cfgridcolumn name="price" display="true" header="price" select="yes" /&gt;
&lt;cfgridcolumn name="issold" display="true" header="Sold" select="no" /&gt;
&lt;cfgridcolumn name="largeimage" display="true" header="largeimage" select="yes" /&gt;

   &lt;/cfgrid&gt;

   &lt;cfinput name="submit" type="Submit" value="Submit"&gt;

&lt;/cfform&gt;

&lt;cfdump var="#form#"&gt;
</code>