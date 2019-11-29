---
layout: post
title: "Ask a Jedi: ColdFusion datefield/change question"
date: "2008-10-01T15:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/10/01/Ask-a-Jedi-ColdFusion-datefieldchange-question
guid: 3038
---

Curt Danceswithformfields asked:

<blockquote>
<p>
I am trying to get a form to submit onchange with cfinput type="datefield" and it won't fire my onchange event if the change is made using the popup calendar.
</p>

<p>
Consider the following...<br />
&lt;cfinput type="datefield" id="duedate" name="duedate" value="#NOW()#" onchange="javascript: ItemsDueForm.submit();"&gt;
</p>

<p>
Have you ever run into anything like this before.  Do you know of a quick workaround?
</p>
</blockquote>

As much as I've played around with ColdFusion 8, I really haven't done much with the date controls. What's interesting is that the onchange runs just fine if you manually change the value, but the little calendar icon won't fire onchange when you change the value. So what can we do?
<!--more-->
My first thought was - let's try a bind command with cfajaxproxy:

<code>
&lt;cfajaxproxy bind="javaScript:doSubmit({% raw %}{duedate}{% endraw %})"&gt;
</code>

Unfortunately this fired the second you clicked the calendar. Even though - visibly - nothing changed the doSubmit function was firing immediately for me. When I switched from a form submit to just a console.log('twinkies'), I noticed quite a few log messages when using the control. I figured the only way to make this work would be to store the original value, and compare that in my JavaScript. This is what I ended up with:

<code>

&lt;head&gt;		
&lt;script&gt;
var origDate;

function setOrig() {
	origDate = document.getElementById('duedate').value;
}

function doSubmit(duedate) {
	//submit if we really changed
	if(duedate != origDate) document.getElementById('ItemsDueForm').submit();
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt; 
&lt;cfif isDefined("form.duedate")&gt;

      &lt;cfdump var="#form#"&gt;

&lt;cfelse&gt;

      &lt;cfform id="ItemsDueForm" action="#cgi.SCRIPT_NAME#" method="post"&gt;

            &lt;cfinput type="datefield" id="duedate" name="duedate" value="#NOW()#"&gt;

      &lt;/cfform&gt;

	&lt;cfajaxproxy bind="javaScript:doSubmit({% raw %}{duedate}{% endraw %})"&gt;
	&lt;cfset ajaxOnLoad('setOrig')&gt;

&lt;/cfif&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

As you can see, I added an ajaxOnLoad. This will fetch the current value of the field and store it. Now when doSubmit is fired, it will only do the form submission when the value is changed.