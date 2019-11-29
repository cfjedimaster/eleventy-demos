---
layout: post
title: "Ask a Jedi: Issue with datefield and mask"
date: "2008-07-02T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/07/02/Ask-a-Jedi-Issue-with-datefield-and-mask
guid: 2909
---

Mathew asks:

<blockquote>
<p>
i know you havent used cfform much but im attempting to use the
datefield in 8, to display an inline datepicker etc. the datepicker works fine on first load, but then when I submit the
, i get an error saying 1-Jul-2008 is an invalid date or time string.
</p>
</blockquote>
<!--more-->
Mathew is right. I haven't played much at all with some of the newer form controls, but let's take a quick look at what he is seeing. First, the code:

<code>
&lt;cfparam name="form.etic" default="#now()#"&gt;
	

&lt;cfform action="#cgi.SCRIPT_NAME#" preservedata="yes" method="post"&gt;
	&lt;cfinput type="dateField" name="etic" mask="DD-MMM-YY" style="font-size:12px;text-align:center" width="75" &gt;
	&lt;input type="submit" name="btnSubmit" value="PRESS ME"&gt;
&lt;/cfform&gt;
</code>

There isn't anything too special in there. When run, you see a simple form with the datefield. You see a form field with 02-Jul-08. It doesn't matter if you change the date. As soon as you hit submit you get:

02-Jul-08 is an invalid date or time string. 

So what's going wrong here? As always, it helps if you examine the 'flow' of the script. We begin by defaulting form.etic to the current date and time. If you output that value you would see: 

{% raw %}{ts '2008-07-02 08:37:22'}{% endraw %} 

We then create a form. In the cfinput/type=datefield control, we pass in the date/time and use a mask to format it. 

When we submit the form, here is where things get wonky. I added a cfdump on form to help figure this out. On submitting the form, the value of the form.etic is now:

02-Jul-08 

When ColdFusion tries to treat this as a date for the datefield, it barfs. Why? I don't know. This is especially odd when you consider the solution. I changed his cfparam to this:

<code>
&lt;cfif not structKeyExists(form, "etic")&gt;
	&lt;cfset form.etic = now()&gt;
&lt;cfelse&gt;
	&lt;cfset form.etic = parseDateTime(form.etic)&gt;
&lt;/cfif&gt;
</code>

ColdFusion has no problems parsing the masked date. This returns a value that works just fine within the datefield. Something to watch out. I'd also assume that you would want to use this before saving the data - although I bet a cfqueryparam with the sql type set to date would handle it fine. (If not, we know what function to use!)