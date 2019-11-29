---
layout: post
title: "Ask a Jedi: Loading a Page with CFCALENDAR"
date: "2007-10-19T10:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/19/Ask-a-Jedi-Loading-a-Page-with-CFCALENDAR
guid: 2424
---

Anthony asks a question about the CFCALENDAR tag:

<blockquote>
I have a simple one... I think.
I need to find out how to goto a URL when a date is selected using CFCalendar.

For instance, I choose Oct 17, I want to goto a page a date page with url.date eq "2007-10-17"

I don't know flash, and have no idea how to accomplish what appears to be a simple operation.
</blockquote>

Now technically I don't answer questions involving Flash Form stuff anymore. It was a fun feature, but in my opinion I'd use Flex 2 instead. But the calendar tag works in HTML forms as well so I thought I'd take a stab at this.

The docs for <a href="http://www.cfquickdocs.com/cf8/?getDoc=cfcalendar">cfcalendar</a> mention that it does indeed have an onChange event. However - you have to use ActionScript for this event. Now in theory - the calendar tag is just a Flex control. However - I had no idea what the control was, nor how to extra the current selected date. So I cheated. I know there is a getURL ActionScript function. This will fire off any URL, including a JavaScript one. So I began with this:

<code>
&lt;cfform name="myform" action="test3.cfm"&gt;
&lt;cfcalendar name="cal" onChange="getURL('javascript:test()')"&gt;
&lt;/cfform&gt;
</code>

All this says is - when the date is selected, run the JavaScript function test (poorly named, I know). My test function then just does this:

<code>
&lt;script&gt;
function test() {
	document.myform.submit();
}
&lt;/script&gt;
</code>

As you can see - it submits the form. You would then write code to say if form.cal exists, cflocation and pass along the value.