---
layout: post
title: "Ask a Jedi: ColdFusion's version of .Net's IsPostBack"
date: "2009-02-27T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/02/27/Ask-a-Jedi-ColdFusions-version-of-Nets-IsPostBack
guid: 3256
---

Andrew asks:

<blockquote>
<p>
I hope you can help me.  I come from an ASP.NET background and am moving across to ColdFusion.  In .net there is a function called isPostBack() which came in very useful.  I am now finding a need for this functionality within the Coldfusion environment so that certain blocks of code are only executed while the page is loading for the first time.
</p>
</blockquote>

First off, I'm happy to welcome you to the ColdFusion community. We are a rowdy, but generally fun, bunch of geeks. We are known for being passionate about our language and emptying the beer kegs at conferences. I think you will find life much more fun here!
<!--more-->
So I had to do a bit of digging, but I found that Andrew was a bit off on his description. isPostBack in .Net is run when a form is posted, not when a page is loaded. However in further emails with him he told me he was interested in both.

There is nothing inherit to ColdFusion that will, by itself, tell you if a form has been posted. You can check for a form post in a variety of ways though.

First, ColdFusion automatically populates a form field named fieldnames when a form is posted. This is a list of all form values. So one simple method to see if a form has been posted would be:

<code>
&lt;cfif isDefined("form.fieldNames") and len(form.fieldNames)&gt;
</code>

This will check to see if the value even exists and if it has something in it. I find that a bit long though. I think most people simply check for the existence of a particular form field. I will often check the name of the submit button. Given:

<code>
&lt;input type="submit" name="save" value="Engage!"&gt;
</code>

You can do this to look for the submission:

<code>
&lt;cfif isDefined("form.save")&gt;
</code>

You can also treat the Form as a structure and check for either an empty struct or a particular key:

<code>
&lt;cfif not isStructEmpty(form)&gt;
</code>

or...

<code>
&lt;cfif structKeyExists(form, "save")&gt;
</code>

Obviously each of these could be reversed to check for a form <i>not</i> being submitted. One example:

<code>
&lt;cfif not structKeyExists(form, "save")&gt;
</code>

You could get really technical and dig into the headers. If you run getHTTPRequestData when a form post is submitted, the method will return POST as opposed to GET. That is probably going a bit too far thought.