---
layout: post
title: "Ask a Jedi: Validating a set of form fields as a date"
date: "2008-08-08T08:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/08/08/Ask-a-Jedi-Validating-a-set-of-form-fields-as-a-date
guid: 2964
---

Cody asks:

<blockquote>
<p>
I have a date field that consists of three drop down menus.  (1) Month; (2) Day; (3) Year.  I assemble these by using CreateDate(yyyy,mm,dd), which works great.  My question involves checking to make sure the values the user selects from the dropdowns are valid before the CreateDate() function is called.  For example, if a user selects 2/31/2008 (which is wrong, only 28 days in Feb), I haven't been able to figure out how to validate the date with IsDate() or IsValid("date",value) before it tries to assemble it which inevitably fails with the error: MONTH.  Do you have any ideas, suggestions, or a maybe giant Internet finger pointing me in the right direction?
</p>
</blockquote>

Ah yes, the giant Internet finger. I do have that. Thanks for asking. Seriously though, how can we solve this? While the best option would be client side, let me demonstrate a server side solution first.
<!--more-->
Let's begin with a real simple form, set up as you desribed:

<code>
&lt;form action="test.cfm" method="post"&gt;

Month: &lt;select name="month"&gt;
&lt;cfloop index="x" from="1" to="12"&gt;
	&lt;cfoutput&gt;&lt;option value="#x#"&gt;#monthAsString(x)#&lt;/option&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
&lt;/select&gt;&lt;br /&gt;

Day: &lt;input type="text" name="day" maxlength="2" size="2"&gt;&lt;br /&gt;

Year: &lt;input type="text" name="year" maxlength="4" size="4"&gt;&lt;br /&gt;

&lt;input type="submit"&gt;
&lt;/form&gt;
</code>

Nothing too fancy here. I didn't even bother doing the code to remember the values in case you have an error. Months are a drop down and the day and year values are both free form. (Don't think that months are safe though. A user could easily use a Firefox plugin to manipulate the DOM, or just even save the form to the desktop and edit it.)

Cody mentioned he had issues with isDate, but it really isn't that hard to use. Just treat the form values like a string. Consider:

<code>
&lt;cfif not structIsEmpty(form)&gt;
	&lt;cfif isDate("#form.month#/#form.day#/#form.year#")&gt;
		&lt;cfset dVal = createDate(form.year,form.month,form.day)&gt;
		&lt;cfoutput&gt;&lt;p&gt;Your date: #dateFormat(dVal, "long")#&lt;/p&gt;&lt;/cfoutput&gt;
	&lt;/cfif&gt;
&lt;/cfif&gt;
</code>

All I do here is create a date string in the form month/day/year. This will handle everything. It will handle my putting "Ray" for a year and it will handle February 31 not being a valid date. Note that isDate will only check for American dates, because America rocks and the rest of the world doesn't. If you dare to live in one of those other countries (where you probably have that stupid sensible metric system) you can use lsIsDate.

What about client side? I did a bit of searching at the jQuery side. I found a plugin to do validation, but from what I can see, it just worked on one text field (Ie, check field X to see if it is a valid date). I also saw a date picker UI thingy. I did not see a function that would let me pass in the values for M, D, and Y and see if together they created a valid date.

The last time I did this in JavaScript was close to 5 years ago, and I remember it being a royal pain in the butt. If I remember right, you <i>could</i> make a date with February 31, but the date object would simply change it to March 2.

So if anyone has any suggestions, speak up. Of course, you still want the server side code anyway, since we all back up our client side validation with server side validation. Right?