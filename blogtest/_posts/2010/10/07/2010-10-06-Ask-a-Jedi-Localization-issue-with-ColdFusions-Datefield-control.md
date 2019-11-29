---
layout: post
title: "Ask a Jedi: Localization issue with ColdFusion's Datefield control"
date: "2010-10-07T10:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/10/07/Ask-a-Jedi-Localization-issue-with-ColdFusions-Datefield-control
guid: 3965
---

Anthony wrote in with the following problem:

<p/>

<blockquote>
Im designing a simple page that allows the user to pick a date and save it in the DB.
My DB is SQL express 2005 and below is the code im using for the field:<br/>
&lt;cfinput type="DateField" name="SUBMISSION_DATE" message="- You must enter a valid date." validateat="onSubmit" class="field_small" id="SUBMISSION_DATE" value="#DateFormat(DETAIL1.SUBMISSION_DATE,'dd/mm/yyyy')#" enabled="Yes"&gt;
<br/><br/>
I'm just using a cfupdate to store the details back to the db.
<br/><br/>
My problem is it keeps changing the date back to us format. ie mm/dd/yyyy.
<br/><br/>
I have looked at the CF date picker and it seems to be displaying the date in us format after being picked so is there some other setting that i need to include to have it store the date as UK.
<br/><br/>
i have set the locale to English(UK) and tested it so it showing the correct locale.
<br/><br/>
Im just at a loss as to where i can change the format back to UK or see whats happening.
<br/><br/>
</blockquote>
<!--more-->
<p/>

Ok, so before going any further, the first thing I recommended was getting rid of cfupdate. It's nice for folks who may know nothing about SQL but in general you want to use a cfquery when performing updates. However, that wasn't his issue. I was able to replicate what he saw rather quickly with this code.

<p/>

<code>

&lt;cfset setLocale("English (UK)" )&gt;
&lt;cfset theDate = createDate(2010,10,2)&gt;
&lt;cfoutput&gt;#dateFormat(theDate)#&lt;/cfoutput&gt;

&lt;cfform name="form"&gt;
	&lt;cfinput name="theDate" type="datefield" &gt;
&lt;/cfform&gt;
</code>

<p>

Ok, if we look at this, we can see the date is being rendered correctly in that weird European day first format:

<p/>

<img src="https://static.raymondcamden.com/images/screen13.png" />

<p/>

But if you pass the date into the field:

<p/>

<code>
&lt;cfinput name="theDate" type="datefield" value="#theDate#"&gt;
</code>

<p/>

You end up something that isn't quite right: 10/02/2010. It displays in American format, but the date <i>is</i> right. Clicking on the calendar will bring you to the right day. Ok, so how to fix? I raised the question on a private listserv and specifically called out to <a href="http://cfg11n.blogspot.com/">Paul Hastings</a>. In our entire community I don't think anyone else knows as much about localization and internationalization than Paul. Not surprisingly he came up with the answer. It was kind of obvious once I saw it, but it never would have occurred to me. Just make use of the <b>mask</b> attribute!

<p/>

<code>
&lt;cfset setLocale("English (UK)" )&gt;
&lt;cfset theDate = createDate(2010,10,2)&gt;
&lt;cfoutput&gt;#dateFormat(theDate)#&lt;/cfoutput&gt;

&lt;cfform name="form"&gt;
	&lt;cfinput name="theDate" type="datefield" value="#theDate#" mask="dd/mm/yyyy"&gt;
&lt;/cfform&gt;
</code>

<p/>

Now when you run this you get a properly formatted result both immediately on display and when changing the value:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/screen14.png" />

<p/>

Paul actually went a step further and demonstrated how you can even make the mask dynamic. This would be useful on a site that supports multiple locales, not just the UK one:

<p/>

<code>
&lt;cfscript&gt;
thisLocale=createObject("java","java.util.Locale").init("en","GB");     
format=3; //0==FULL --&gt; 3==SHORT
dF=createObject("java","java.text.DateFormat").getDateInstance(format,thisLocale);
pattern=dF.toLocalizedPattern();        
&lt;/cfscript&gt;
</code>

<p/>

Anyway, I hope this helps. This is the first time I've ever seen any of ColdFusion's Ajax controls in a non-American locale so this was all new to me. (I'll also use this opportunity to point out that jQuery UI's date picker supports <a href="http://jqueryui.com/demos/datepicker/#localization">localization</a> as well.)