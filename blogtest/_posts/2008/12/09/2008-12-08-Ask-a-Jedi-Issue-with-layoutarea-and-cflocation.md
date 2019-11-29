---
layout: post
title: "Ask a Jedi: Issue with layoutarea and cflocation"
date: "2008-12-09T07:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/12/09/Ask-a-Jedi-Issue-with-layoutarea-and-cflocation
guid: 3140
---

Miles asks:

<blockquote>
<p>
I was trying to use a cfform inside a cflayoutarea. What I wanted to do was have the page that processes the submitted
form redirect back to the original form  (using ajax, still inside of the cflayoutarea) if the user entered something invalid.
</p>

<p>
It seemed strange to me that I couldn't use cflocation to display the original form within the ajax request. If I did, i'd get a form full of bind errors, saying that various form
objects couldn't be found.
</p>

<p>
Instead, I had to cfinclude the page with the form on it, followed by a cfabort, on the processign page, to achieve the same thing. Does that seem strange to you or do you think there's a valid reason for that kind of behaviour?
</p>
</blockquote>
<!--more-->
So there are a few things in play here. First, let's forget about AJAX for a second. In general, when I do form validation as you describe above, I generally do not cflocate back to the form. Outside of MVC style applications, my form will post to itself. The validation is done on top, and if anything is wrong, I simply create a list of problems. The problem with cflocating back to the form is that you lose the FORM values the user had entered. If a form had 10 items and only 1 was wrong, you are going to really tick off users if they lose the rest of their form values. In pseudo-code, my form (again, outside of a MVC framework) will work like so:

<code>
if a form was submitted:
  check each field and make a list of errors
  if no errors, save the data and send the user to a listing page
end if

if an error occurred, display it

display form with a post to self
</code>

So that being said, you said you used cfform inside of a layoutarea with a cflocation on error. I made a quick demo like so:

<code>
&lt;cflayout type="tab"&gt;

&lt;cflayoutarea title="foo"&gt;

&lt;cfif structKeyExists(form, "submit")&gt;
	&lt;cfif not len(trim(form.name))&gt;
    	&lt;cflocation url="test.cfm?bad=1"&gt;
    &lt;/cfif&gt;
&lt;/cfif&gt;
&lt;cfif structKeyExists(url, "bad")&gt;
&lt;p&gt;Bad!&lt;/p&gt;
&lt;/cfif&gt;
&lt;cfform name="test"&gt;
&lt;cfinput name="name" type="text"&gt;
&lt;cfinput name="submit" type="submit"&gt;
&lt;/cfform&gt;

&lt;/cflayoutarea&gt;

&lt;cflayoutarea title="goo"&gt;

&lt;/cflayoutarea&gt;

&lt;/cflayout&gt;
</code>

If you run this and hit submit without filling a value, you will indeed get an error. Removing the cflocation doesn't help much either:

<code>
&lt;cflayoutarea title="foo"&gt;

&lt;cfif structKeyExists(form, "submit")&gt;
	&lt;cfif not len(trim(form.name))&gt;
		&lt;p&gt;Bad!&lt;/p&gt;
    &lt;/cfif&gt;
&lt;/cfif&gt;
&lt;cfform name="test"&gt;
&lt;cfinput name="name" type="text"&gt;
&lt;cfinput name="submit" type="submit"&gt;
&lt;/cfform&gt;

&lt;/cflayoutarea&gt;
</code>

Which results in, after a few clicks:

<img src="https://static.raymondcamden.com/images//Picture 127.png">

What I'd recommend is a simpler approach. Move the form itself into a new file and switch your tab to:

<code>
&lt;cflayoutarea title="foo" source="test.cfm"&gt;
</code>

In the form you can keep things nice and simple:

<code>
&lt;cfif structKeyExists(form, "submit")&gt;
    &lt;cfset variables.bad = 1&gt;
&lt;/cfif&gt;
&lt;cfif structKeyExists(variables, "bad")&gt;
&lt;p&gt;Bad!&lt;/p&gt;
&lt;/cfif&gt;
&lt;cfform name="test"&gt;
&lt;cfinput name="name" type="text"&gt;
&lt;cfinput name="submit" type="submit"&gt;
&lt;/cfform&gt;
</code>

If you do this, though, you have to modify the original page with the tags to include an ajaximport call:

<code>
&lt;cfajaximport tags="cfform"&gt;
</code>

Altogether now - the form now will automatically do an AJAX post to itself (this just happens automatically with cfform in CF8 when used inside an ajax-based container) and correctly handle the error. (Note, you can also consider using ColdFusion.Ajax.submitForm, I have a <a href="http://www.coldfusionjedi.com/search.cfm/ajax.submitform">few blog entries</a> on that.)