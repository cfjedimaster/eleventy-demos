---
layout: post
title: "Automatically storing changes in a form"
date: "2011-02-01T13:02:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2011/02/01/Automatically-storing-changes-in-a-form
guid: 4103
---

Ok, earlier today I complained on Twitter (shocking I know) about a particular web site that I can't mention by name that has a particular 'feature' that drives me bonkers. The site has a list of forums you can subscribe to. When you click the checkbox to confirm you want to subscribe it automatically stores your preference. What bugs me is <i>how</i> it does this. As soon as you click the checkbox (either on or off) the entire form is posted to the server. To make matters worse, this is not the most "zippy" site out there (it's not ColdFusion by the way) so just updating your preferences can take a while and cause issues if you are trying to change something while the page is reloading. It's frustrating and it's ticked me off enough times that I decided to quickly rewrite the UX. Let's start with a mockup of how the site currently works. (I didn't view source on the page but rather built it as I imagined it is built.)
<!--more-->
<p/>

<code>
&lt;cfparam name="session.subscribed" default=""&gt;

&lt;cfset data = queryNew("name,id","cf_sql_varchar,cf_sql_integer")&gt;
&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data, "name", "Alpha")&gt;		 
&lt;cfset querySetCell(data, "id", 1)&gt;		 
&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data, "name", "Beta")&gt;		 
&lt;cfset querySetCell(data, "id", 2)&gt;		 
&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data, "name", "Gamma")&gt;		 
&lt;cfset querySetCell(data, "id", 3)&gt;		 
&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data, "name", "Delta")&gt;		 
&lt;cfset querySetCell(data, "id", 4)&gt;		 
&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data, "name", "Enterprise")&gt;		 
&lt;cfset querySetCell(data, "id", 5)&gt;		 

&lt;cfif structKeyExists(form, "subscribe")&gt;
	&lt;cfset sleep(3000)&gt;
	&lt;cfset session.subscribed = form.subscribe&gt;
&lt;/cfif&gt;


&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$(".sublist").change(function() {
		$("#selForm").submit();
	});

})
&lt;/script&gt;

&lt;form method="post" id="selForm"&gt;
&lt;table border="1" width="500"&gt;
	&lt;tr&gt;
		&lt;td&gt;Name&lt;/td&gt;
		&lt;td width="50"&gt;Subscribe&lt;/td&gt;
	&lt;/tr&gt;
	&lt;cfoutput query="data"&gt;
	&lt;tr&gt;
		&lt;td&gt;#name#&lt;/td&gt;
		&lt;td&gt;&lt;input type="checkbox" class="sublist" name="subscribe" value="#id#" &lt;cfif listFindNoCase(session.subscribed, id)&gt;checked&lt;/cfif&gt;&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;/cfoutput&gt;
&lt;/table&gt;
&lt;/form&gt;
</code>

<p>

So from the top, I begin by initializing a simple Session variable. This variable represents the preferences I want to store. Normally it would be loaded via the database, or perhaps a cookie, but you get the idea. The next set of code simply creates some fake data for us to render. Skip past the JavaScript and look at the table. It renders the fake data with checkboxes to allow for subscriptions. If you go back up to the JavaScript you can see that on each and every change we submit the form. That's the part I dislike. In the form processing I intentionally added a sleep() in there to mimic the slowness of the current site. (Next time I'll just write it in PHP.) 

<p>

You can view this page here: <a href="http://www.raymondcamden.com/demos/feb1b2011/test3.cfm">http://www.coldfusionjedi.com/demos/feb1b2011/test3.cfm</a> Clicking around, especially quickly, causes a lot of page reloads. In some testing I've seen it actually get confused and check things I had just unchecked. Now let's look at a better version.

<p>

<code>
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$(".sublist").change(function() {
		var thisid = $(this).val();
		var sel = $(this).attr("checked");
		$.post("test.cfc?method=storesubscription", {% raw %}{"id":thisid, "subscribe":sel}{% endraw %});
	});

})
&lt;/script&gt;
</code>

<p>

I've modified the code to grab the ID and checked status from the form field. Now when you click it will fire off an Ajax request to store the update. My CFC just wraps the session update (and I'll post that if folks want but it's just a few List functions) and returns no value. You can play with this here: <a href="http://www.coldfusionjedi.com/demos/feb1b2011/test4.cfm">http://www.coldfusionjedi.com/demos/feb1b2011/test4.cfm</a>. Hopefully you can see that this version feels a lot more fluid. I wrote this in like 5 minutes so if it fails in IE or if it is still 'fragile' then I wouldn't be surprised, but hopefully the <i>concept</i> makes sense and hopefully I'm not alone in thinking this is <b>much</b> improved.

<p>

As another version of this - I believe Google's Blogger.com service does something similar when posting comments. So this particular site is not alone in having this UX issue.