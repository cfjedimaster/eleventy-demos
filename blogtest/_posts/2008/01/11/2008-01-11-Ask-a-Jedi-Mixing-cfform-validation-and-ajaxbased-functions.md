---
layout: post
title: "Ask a Jedi: Mixing cfform validation and ajax-based functions"
date: "2008-01-11T17:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/11/Ask-a-Jedi-Mixing-cfform-validation-and-ajaxbased-functions
guid: 2588
---

Andy asks:

<blockquote>
<p>
If you have an ajax/html form and you submit using a button control which calls a function (like ColdFusion.Ajax.submitForm) is there still a way to easily take
advantage of the built in cfform validation?  This usually gets called when you use a submit, rather than a button, and I'd love to be able to call it right before I call my function that handles the cfform submission.
</p>
</blockquote>

If I read you right - you want to know if you can use cfform validation as well as using your own logic after the validation. If so, it works pretty easily:

<code>
&lt;cfif not structIsEmpty(form)&gt;
	&lt;cfdump var="#form#" label="Form"&gt;
&lt;/cfif&gt;

&lt;script&gt;
function doSomething() {
	alert('Called');
	return false;
}
&lt;/script&gt;

&lt;cfform name="test" onSubmit="return doSomething()"&gt;
	Who is the twelfth cylon? &lt;cfinput name="name" required="true"&gt;
	&lt;cfinput name="submit" type="submit" value="Submit"&gt;
&lt;/cfform&gt;
</code>

So read this from the bottom up. I've got a super simple form using CFFORM's built in validation for a grand total of one field (I'm easy like Sunday morning). Note the onSubmit. What's cool, and what I wasn't sure would work, is that doSomething won't run if there are any errors. As soon as your form is ok, it runs. 

I'm <i>very</i> much a anti-cfform kind of guy, so I may be missing something obvious, but I hope this answers your question.