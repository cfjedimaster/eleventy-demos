---
layout: post
title: "Using jQuery to add form fields - with validation"
date: "2009-02-22T18:02:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2009/02/22/Using-jQuery-to-add-form-fields-with-validation
guid: 3248
---

A few days back I posted a <a href="http://www.raymondcamden.com/index.cfm/2009/2/19/Using-jQuery-to-add-form-fields">blog entry</a> on using jQuery to dynamically add form fields to a form. The example I gave was a form that asked you to enter information about a person and then had a simple way to add new people to the form. I asked for - and got - a lot of feedback on other (better!) ways to write the code. I've taken one of the <a href="http://www.coldfusionjedi.com/index.cfm/2009/2/19/Using-jQuery-to-add-form-fields#c90BBF0C2-19B9-E658-9D653A9820F0D3BB">suggestions</a> from Brian Swartzfager (see his demo <a href="http://www.swartzfager.org/blog/demoFiles/clonedFields/">here</a>) and used it for my next task - adding validation to the form, including validation on the new fields. Definitely view source on his demo as I'll be assuming you have read it.
<!--more-->
Alright - so the first thing I wanted to do was add validation to the form fields that showed up by default. I am a big believer in 'baby steps' so before I even try to make the validation dynamic, I'll work with the static form fields first. Brian's code already had a (document).ready block, so I simply added the following:

<code>
$("#demoForm").validate({

	rules: {
		firstname1: {
			required: true,
			minlength: 2
		}
		,lastname1: {
			required: true,
			minlength: 2
		}
		,email1: {
			required: true,
			email: true
		}
	}
</code>

If you have read my entries on form validation with jQuery than the above shouldn't be anything new. I verified this worked before going on. 

It is a bit off topic for this entry, but notice how my form uses one label for first and last name? Notice how since both are required, if you forget both, the error message displays by each field? It would be nice if there was a way to say "Yes, firstname and lastname are required, but I want to treat them as a group and just one error message." Turns out - the plugin supports this out of the box. You can create a group of form fields using the groups value in the constructor. This will group the fields in terms of messaging. We still need a way to specify <i>where</i> the error should go. This can be done with yet another constructor value - errorPlacement. Consider:

<code>
groups: {
	fullname: "firstname1 lastname1"
},
errorPlacement: function(error, element) {
	if (element.attr("name") == "firstname1" || element.attr("name") == "lastname1" )	
		error.insertAfter("#lastname1");
	else
		error.insertAfter(element);
},
</code>

I've created an arbitrary group name called fullname and linked it to my two name fields. The errorPlacement value is a function that can dynamically handle putting the message in the right place for my name 'set'. FYI, I think this is a bit overly complex. I can see needing custom error placement about 100% of the time for groups. I've filed an enhancement request for the plugin to make this a bit easier. 

Okay - sorry for the diversion there. So given that we can now validate the form fields built in, and we have an easy way to add more fields, how do we also add validation for the new rules? The Validation plugin makes this simple. For each new field we add, we can do:  X.rules("add", rule) where X is our selector the rule is the logic to add. Taking Brian's code he wrote for the addPerson logic, I just added:

<code>
//add validation
$("#firstname"+current).rules("add", {% raw %}{ required:true,minlength:2 }{% endraw %});
$("#lastname"+current).rules("add", {% raw %}{ required:true,minlength:2 }{% endraw %});
$("#email"+current).rules("add", {% raw %}{ required:true,email:true }{% endraw %});
</code>

Remember that current was a number that kept track of how many people we had in the form.

You can see this in action here: <a href="http://www.coldfusionjedi.com/demos/jqueryvalidation/testadd.cfm">http://www.coldfusionjedi.com/demos/jqueryvalidation/testadd.cfm</a> View source to see the complete modification to Brian's code.

This leaves us with one small little issue. While grouping nicely handles our default firstname/lastname pair, you can't add new groups after the form has been validated. (You know, I wonder what happens if you just run validate() again?) So the error display isn't terribly nice, but that could probably be worked on a bit more.

Anyway - I hope this is helpful to folks.