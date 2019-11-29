---
layout: post
title: "Reminder about forms and ColdFusion 8 Ajax Containers"
date: "2007-08-05T20:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/05/Reminder-about-forms-and-ColdFusion-8-Ajax-Containers
guid: 2252
---

While this is covered in the docs, it can be a bit surprising. When working with ColdFusion 8 Ajax-based containers (cfdiv, cflayoutarea, cfpod, and cfwindow), any form inside the area will be posted to the area itself. What that means is - the entire page won't reload, just the container. However - this is only true for cfform, not form. Consider this code example:
<!--more-->
<code>
&lt;cfoutput&gt;loaded #timeFormat(now(), "long")#&lt;/cfoutput&gt;
&lt;p&gt;
&lt;hr&gt;
&lt;p&gt;
&lt;cflayout type="tab"&gt;

	&lt;cflayoutarea title="Tab 1"&gt;
	&lt;form&gt;
	&lt;input type="text" name="name"&gt;
	&lt;input type="submit" name="submit"&gt;
	&lt;/form&gt;
	&lt;cfdump var="#form#"&gt;
	&lt;/cflayoutarea&gt;
	
	&lt;cflayoutarea title="Tab 2"&gt;
	&lt;cfform&gt;
	&lt;cfinput type="text" name="name"&gt;
	&lt;cfinput type="submit" name="submit"&gt;
	&lt;/cfform&gt;
	&lt;cfdump var="#form#"&gt;
	&lt;/cflayoutarea&gt;
	
&lt;/cflayout&gt;
</code>

I have a simple page with a time stamp on top. Then I have 2 tabs. The first tab has a FORM based form, and the second tab has a CFFORM based form. If you post the first tab, the entire page reloads. If you post the second form, the content of the second form is replaced.

And here is where things get freaky. Notice I didn't do an action for the cfform. That means the action is the same as the current page. The current page defines tabs. So guess what I get inside? Yep, tabs within tabs. Consider this screen shot:

<img src="https://static.raymondcamden.com/images//Picture 21.png">

Most likely this isn't what you want. You want to be sure you specify an action and that the action isn't the same as the page that hosts the form itself. So here is an example from an upcoming update to <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers</a>:

<code>
&lt;cflayout type="tab" style="margin-left: 10px;"&gt;

	&lt;cflayoutarea title="Login" source="login.cfm" /&gt;


	&lt;cflayoutarea title="Register" source="register.cfm" /&gt;

&lt;/cflayout&gt;
</code>

The contents of register.cfm contain just the form itself. (This page is in development right now, so pardon the half-completed error checking.)

<code>
&lt;cfset errors = ""&gt;

&lt;cfif structKeyExists(form, "selected") and form.selected is "register"&gt;
	&lt;cfif not len(trim(form.username))&gt;
		&lt;cfset errors = errors & "You must enter a username.&lt;br /&gt;"&gt;
	&lt;cfelseif reFind("[^a-z0-9]", form.username)&gt;
		&lt;cfset errors = errors & "Usernames can contain only numbers and letters.&lt;br /&gt;"&gt;
	&lt;/cfif&gt;	
&lt;/cfif&gt;

&lt;cfoutput&gt;
&lt;p&gt;
Note that all form fields are required.
&lt;/p&gt;

&lt;cfform action="register.cfm" method="post"&gt;		
&lt;p&gt;				
&lt;label&gt;Username&lt;/label&gt;
&lt;input name="username" value="" type="text" size="30" /&gt;
&lt;label&gt;Password&lt;/label&gt;
&lt;input name="password" value="" type="password" size="30" /&gt;
&lt;label&gt;Name&lt;/label&gt;
&lt;input name="name" value="" type="text" size="30" /&gt;
&lt;label&gt;Email Address&lt;/label&gt;
&lt;input name="email" value="" type="text" size="30" /&gt;
&lt;br /&gt;&lt;br /&gt;
&lt;input class="button" type="submit" value="Login"/&gt;		
&lt;input type="hidden" name="selected" value="register"&gt;	
&lt;/p&gt;		
&lt;/cfform&gt;		
&lt;/cfoutput&gt;
</code>

So all in all a pretty cool feature. I'll be able to reload inside my tab without reloading the entire page - but it is definitely something you have to watch out.