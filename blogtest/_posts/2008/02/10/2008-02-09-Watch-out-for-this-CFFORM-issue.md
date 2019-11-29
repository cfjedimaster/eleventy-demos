---
layout: post
title: "Watch out for this CFFORM issue"
date: "2008-02-10T08:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/10/Watch-out-for-this-CFFORM-issue
guid: 2643
---

I'm working on converting a site to Model-Glue. During the conversion I was copying over a page that had two forms on it. One made use of CFFORM, the other was really just a button to let you link to another page. 

For some reason - whenever I hit the button on the second form, the validation for the CFFORM would fire. That didn't make sense. The validation should only apply to the first form. 

Here is a subset of the code. See if you can spot something odd before I reveal what the problem was:

<code>
&lt;cfform name="Volunteer" action="http://www.cnn.com" method="post"&gt;
&lt;table cellspacing="0" &gt; 
&lt;tr class="odd"&gt;
	&lt;td&gt;&lt;cfinput name="FirstName" type="text" size="10" tabindex="1"
			maxlength="24"
			required="yes"
			message="Please enter a valid First Name."
			validate="regular_expression" 
			pattern="^[a-z A-Z-]+$"&gt;&lt;/td&gt;
	&lt;td&gt;&lt;input name="Action" type="submit" value="Add" tabindex="4"&gt;&lt;/td&gt;
&lt;/tr&gt;

&lt;/cfform&gt;

&lt;cfoutput&gt;
&lt;/table&gt;

&lt;form name="Finished" action="http://www.yahoo.com" method="post"&gt;
&lt;div class="submit"&gt;
&lt;input name="Action" type="submit" value="Yahoo"&gt;
&lt;/div&gt;
&lt;/form&gt;
&lt;/cfoutput&gt;
</code>

See it yet? Notice the placement of the closing HTML table tab versus the closing CFFORM tag. When rendered out, this resulted in something like so:

<code>
&lt;form ...&gt;
&lt;table&gt;
&lt;/form&gt;
&lt;/table&gt;
</code>

Now while I can't imagine why that would mess with validation, when I fixed the order of the tags the validation worked correctly. Form one did it's thing, and form two simply let me load up a new URL.