---
layout: post
title: "Bug with Ajax HTML Grid and File Upload Forms"
date: "2008-08-25T14:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/08/25/Bug-with-Ajax-HTML-Grid-and-File-Upload-Forms
guid: 2987
---

Dave sent me an interesting bug this weekend. Turns out if you use an HTML grid, and if you use enctype="multipart/form-data" in your form (required for file upload forms), you get a bug when posting to the server. If you want to try this right now, skip to the end of this post and run the CFM there. (By the way, a <b>huge</b> thank you to David for sending me a question along with a script I could just save and run. That makes it a thousand times easier to help!) David's script simply has a grid and a submit button. If you select a row in the grid and submit the form, you get:
<!--more-->
<b>The submitted cfgrid form field is corrupt (name: __CFGRID__MYTEST__MYGRID value: ,__CFGRID__COLUMN__=DESCRIPTION; __CFGRID__DATA__=myTest2)</b>

This doesn't occur on any particular line per se, it happens as soon as you submit the data. That means that - unfortunately - there is no fix for this. (I reminded David to file a bug report on this.) As soon as you remove the enctype, the bug goes away. (And to be clear, in the real script, there is an actual file upload going on as well. Again, David provided a very slim, easy to test script.)

Now part of me thinks there may be a way around this. My assumption is that when you select a row in the grid, CF's client side code is updating some hidden form fields before the post continues. I think we can use more client side code to possibly fix this. If you use a tool like Firebug, we should be able to dig into the DOM, find where CF is writing the data, and then manipulate that such that the POST doesn't break the submission. 

Consider this an open call. I don't have the time right now to dig very deeply into this, but I know a workaround could be found by my oh so smart, very handsome readers out there. (A little flattery goes a long way...) Any takers?

<code>
&lt;cfscript&gt;
variables.myQuery = queryNew("ID,Description","integer,varchar");
queryAddRow(variables.myQuery,1);
querySetCell(variables.myQuery,"ID",1);
querySetCell(variables.myQuery,"Description","my Test 1");
queryAddRow(variables.myQuery,1);
querySetCell(variables.myQuery,"ID",2);
querySetCell(variables.myQuery,"Description","myTest2"); 
&lt;/cfscript&gt;

&lt;cfform name="myTest" format="html" action="test.cfm" method="post" enctype="multipart/form-data"&gt;
&lt;cfgrid name="myGrid" format="html" selectmode="row" pagesize="20" autowidth="true" preservepageonsort="true" selectonload="false" striperows="yes" query="myQuery" width="360"&gt;
	&lt;cfgridcolumn name="Description"&gt;
&lt;/cfgrid&gt;
&lt;cfinput type="submit" name="btn_submit" value="Go"&gt; 
&lt;/cfform&gt;

&lt;cfdump var="#form#"&gt;
</code>