---
layout: post
title: "CF901 CFGRID's new multirowselect feature"
date: "2010-08-28T09:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/08/28/CF901-CFGRIDs-new-multirowselect-feature
guid: 3926
---

Earlier this week a user asked me to look into something odd with CF901's new multirowselect feature for cfgrid. If you haven't played with this yet, it is a way to enable multiple row selections in a grid. Unfortunately it doesn't quite work as advertised, but in this blog entry I'll tell you how to <i>make</i> it work.
<!--more-->
<p>
First, let's start with a simple example so you can see what the attribute does when enabled. 

<p>

<code>
&lt;cfset q = queryNew("id,name")&gt;
&lt;cfloop index="x" from="1" to="10"&gt;
       &lt;cfset queryAddRow(q)&gt;
       &lt;cfset querySetCell(q, "id", x)&gt;
       &lt;cfset querySetCell(q, "name", "Name #x#")&gt;
&lt;/cfloop&gt;

&lt;cfform name="mytest" method="post"&gt;
	&lt;cfgrid name="SelectStuff" query="q" format="html" width="400" height="250" multirowselect="true"&gt;&lt;/cfgrid&gt;
	&lt;cfinput type="submit" name="submit" value="Submit"&gt;
&lt;/cfform&gt;

&lt;cfdump var="#form#"&gt;
</code>

<p>

My code begins with a quick fake query on top. Next I've got a cfform with my grid inside. The only thing really interesting there is the multirowselect. I also added a quick dump of the form scope to the bottom. Let's take a look at how the grid is changed. I'll first show a picture with the option turned <b>off</b>, this is the default:

<p>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-08-28 at 7.59.52 AM.png" />

<p>

Now let's turn the option back on, as in the code above.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-08-28 at 8.00.31 AM.png" />

<p>

As you can see, there is a new column now with checkboxes. There is also a checkbox on top. Clicking that works as a Select All/Deselect All feature. So in theory, that should be it, right? Unfortunately, it completely doesn't work as shown above. If I click a few checkboxes and hit submit, I get this in the form scope. 

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-08-28 at 8.02.32 AM.png" />

<p>

Nothing. Ugh. So I pinged Adobe on this. Turns out - the real expectation for this feature was within Ajax-based applications. You <i>can</i> get the value just fine via JavaScript, but if you don't do this, nothing will be sent to the server. I've already filed a bug report on this. 

<p>

So how can you make this work? The simplest solution is to use the getSelectedRows API:

<p>

<code>
obj = ColdFusion.Grid.getSelectedRows('SelectStuff');
</code>

<p>

This returns a struct of objects. How do you send that to the server? One option would be to turn into JSON:

<p>

<code>
jsonbj = ColdFusion.JSON.encode(obj);
</code>

<p>

However, this will give you a JSON representation of the entire row. You probably only want the ID values, right? Here is the code I came up:

<p>

<code>
var selected = "";
for(var i=0; i&lt;obj.length; i++) {
	if(selected == "") selected = obj[i].ID;
	else selected += "," + obj[i].ID;
}
document.getElementById('selected').value = selected;
</code>

<p>

Basically - create a list of IDs from the object and assign it to a new form field, in this case, a hidden one. You can try this yourself via the demo link below, and I've pasted the entire completed template below.

<p>

<a href="http://www.coldfusionjedi.com/demos/aug282010/test.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

<code>

&lt;cfset q = queryNew("id,name")&gt;
&lt;cfloop index="x" from="1" to="10"&gt;
       &lt;cfset queryAddRow(q)&gt;
       &lt;cfset querySetCell(q, "id", x)&gt;
       &lt;cfset querySetCell(q, "name", "Name #x#")&gt;
&lt;/cfloop&gt;

&lt;script&gt;
function fixMe() {
	obj = ColdFusion.Grid.getSelectedRows('SelectStuff');
	var selected = "";
	for(var i=0; i&lt;obj.length; i++) {
		if(selected == "") selected = obj[i].ID;
		else selected += "," + obj[i].ID;
	}
	document.getElementById('selected').value = selected;
	return true;
}
&lt;/script&gt;

&lt;cfform name="mytest" method="post" onSubmit="return fixMe()"&gt;
	&lt;cfgrid name="SelectStuff" query="q" format="html" width="400" height="250" multirowselect="true"&gt;&lt;/cfgrid&gt;
	&lt;input type="hidden" name="selected" id="selected"&gt;
	&lt;cfinput type="submit" name="submit" value="Submit"&gt;
&lt;/cfform&gt;

&lt;cfdump var="#form#"&gt;
</code>