---
layout: post
title: "jQuery Form Validation with Selects"
date: "2009-02-16T09:02:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2009/02/16/jQuery-Form-Validation-with-Selects
guid: 3240
---

A reader on my <a href="http://www.raymondcamden.com/index.cfm/2009/2/9/An-introduction-to-jQuery-and-Form-Validation">first post on jQuery Form Validation</a> asked an interesting question - how do you validate select form fields? Specifically, given that a drop down may have a 'Other' option, how do mark a text field required if the drop down is set to Other?
<!--more-->
Before I answer that, let me first point out a simpler example. Given a drop down where the first option is 'Pick one of the below', how do you require a user to select one of the other items? Easy! Just make the first option have a blank value. Consider:

<code>
&lt;select id="cjob" name="job"&gt;
&lt;option value=""&gt;Select a Job&lt;/option&gt;
&lt;option value="1"&gt;Jedi&lt;/option&gt;
&lt;option value="2"&gt;Annoying Droid&lt;/option&gt;
&lt;option value="3"&gt;Bad Guy&lt;/option&gt;
&lt;/select&gt;
</code>

Notice how all the options, except the first, have a value? By just setting this drop down to required in our rules block, jQuery will handle ensuring that the user doesn't leave the drop down on the first option. To be honest, even with all the respect I've gained for jQuery, I didn't think it would be that easy. You can even specify that the user select a certain number of options (for multi-select drop downs) or that they must select a certain number but no more than some max. The plugin author has a nice <a href="http://jquery.bassistance.de/validate/demo/radio-checkbox-select-demo.html">demo page</a> with examples of that. What I didn't see, though, was an example that matched what the reader wanted. If the drop down is on 'other', make some other field required. Here is how I solved it.

First, our form:

<code>
&lt;form id="commentForm" method="get" action=""&gt;
	&lt;fieldset&gt;
	&lt;legend&gt;A simple comment form with submit validation and default messages&lt;/legend&gt;
	&lt;p&gt;
	&lt;label for="cname"&gt;Name&lt;/label&gt;
	&lt;em&gt;*&lt;/em&gt;&lt;input id="cname" name="name" size="25" /&gt;
	&lt;/p&gt;
	&lt;p&gt;
	&lt;label for="cjob"&gt;Job&lt;/label&gt;
	&lt;em&gt;*&lt;/em&gt;&lt;select id="cjob" name="job"&gt;
	&lt;option value=""&gt;Select a Job&lt;/option&gt;
	&lt;option value="1"&gt;Jedi&lt;/option&gt;
	&lt;option value="2"&gt;Annoying Droid&lt;/option&gt;
	&lt;option value="3"&gt;Bad Guy&lt;/option&gt;
	&lt;option value="other"&gt;Other (Enter Below)&lt;/option&gt;
	&lt;/select&gt;
	&lt;/p&gt;   
	&lt;p&gt;
	&lt;label for="cother"&gt;Other Job:&lt;/label&gt;
	&lt;input id="cother" name="otherjob" size="25" /&gt;
	&lt;/p&gt;
	&lt;p&gt;
	&lt;input class="submit" type="submit" value="Submit"/&gt;
	&lt;/p&gt;
	&lt;/fieldset&gt;
&lt;/form&gt;
</code>

The form has 3 main fields: Name, Job, and Other Job. I want name to be required. I want job to be required. If you select Other for a job, I then want Other Job to be required as well. Here is the rules block I used:

<code>
rules: {
    name: {
    	required: true,
    	minlength: 2
    }
    ,job: {
	required: true
    }
    ,otherjob: {
    	required: function(element) {
	return $("#cjob").val() == 'other'
	}
    }
}
</code>

Let's skip the first rule since it isn't anything new. The second rule applies just to the drop down. The use of required here will ensure that an option with some value has been picked. If I leave it on the first option there will be no value and the rule will fail. The third rule is where things get interesting. I essentially provide an inline function that returns true or false. The field will be required if and only if the value of cjob (my drop down) is set to other.

Next, I ensured my messages made all of the above clear:

<code>
messages: {
    name: {
    	required: "Stand up for your comments or go home.",
    	minlength: jQuery.format("You need to use at least {% raw %}{0}{% endraw %} characters for your name.")
    }
    ,job: "You must select a job."
    ,otherjob: "If you select 'other' for a job, you must enter it."
}
</code>

Pretty simple, right? Can anyone recommend an alternate way of solving this? You can find a demo of this code here:

<a href="http://www.coldfusionjedi.com/demos/jqueryvalidation/test4.html">http://www.coldfusionjedi.com/demos/jqueryvalidation/test4.html</a>

p.s. I think I may forgo Star Wars for my next tattoo and just do 'jQuery FTW'. Or is that too fan boy?