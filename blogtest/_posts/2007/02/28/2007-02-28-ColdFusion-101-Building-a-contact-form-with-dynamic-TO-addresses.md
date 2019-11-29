---
layout: post
title: "ColdFusion 101: Building a contact form with dynamic TO addresses"
date: "2007-02-28T15:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/02/28/ColdFusion-101-Building-a-contact-form-with-dynamic-TO-addresses
guid: 1870
---

This question came in to me today, and as a former library worker (well, I was a shelver in high school - one of the best jobs I ever had), I wanted to give her a hand and thought I'd share the question/solution.
<!--more-->
Susan wrote:

<blockquote>
Programming challenged librarian needs a contact form that includes radio buttons for different departments. Depending on which radio button is selected, the completed form is sent to a different email address.  

(ex: I want to ask about my overdues (email to overdues@mylibrary... I want to ask about children's programs (email to kids@mylibrary)...)

I can get a basic contact/feedback form to work for one email  but I'm clueless on how to have it select different options. If you have any suggestions/directions for me I would really appreciate it. THANKS!
</blockquote>

So a basic contact form will ask for your name, email address, and comments. It will then verify the form fields, and if all is well, mail the results:

<code>
&lt;cfmail to="admin@mysite.com" from="#form.email#" subject="Site Comments" wrap="80"&gt;
#form.comments#
&lt;/cfmail&gt;
</code>

So to properly route the email, our librarian had added radio controls to her form. Most likely something like this:

<code>
Your question concerns...

&lt;input type="radio" name="department" value="overdue"&gt;Overdue Fines

&lt;input type="radio" name="department" value="kids"&gt;Children Programs

&lt;input type="radio" name="department" value="dhamra"&gt;Life Extension
</code>

First - you need to remember that a radio field will not exist in the form scope if the user doesn't select anything. You need to use isDefined or structKeyExists to ensure the user picked something. If you have, then routing the email is easy. Here is one possible way to handle it:

<code>
&lt;cfif form.department is "overdue"&gt;
  &lt;cfset to="overdue@mysite.com"&gt;
&lt;cfelseif form.department is "children"&gt;
  &lt;cfset to="children@mysite.com"&gt;
&lt;cfelseif form.department is "dharma"&gt;
  &lt;cfset to="dharmainiative@mysite.com"&gt;
&lt;cfelse&gt;
  &lt;cfset to="root@mysite.com"&gt;
&lt;/cfif&gt;
</code>

I check for the possible values of the form field (and note I have a last ditch check in case the form value is not recognized). I set a value to a variable named to. Once I have it, I can change my cfmail tag rather easily:

<code>
&lt;cfmail to="#to#" from="#form.email#" subject="Site Comments" wrap="80"&gt;
#form.comments#
&lt;/cfmail&gt;
</code>

You could also make the subject dynamic as well. Anyway - I hope this is helpful.