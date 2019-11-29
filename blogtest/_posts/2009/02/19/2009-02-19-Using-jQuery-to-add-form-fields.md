---
layout: post
title: "Using jQuery to add form fields"
date: "2009-02-19T13:02:00+06:00"
categories: [development,jquery]
tags: []
banner_image: 
permalink: /2009/02/19/Using-jQuery-to-add-form-fields
guid: 3244
---

A reader on <a href="http://www.raymondcamden.com/index.cfm/2008/9/10/Ask-a-Jedi-Dynamically-updating-line-items-on-a-form#c66689663-19B9-E658-9D8C331055BBD5D8">another post</a> asked me about using jQuery to dynamically add form fields to an existing form. I whipped up a quick demo that I'd like to get folks opinions on. Here is what I came up with:
<!--more-->
<code>
&lt;cfif not structIsEmpty(form)&gt;
	&lt;cfdump var="#form#"&gt;
&lt;/cfif&gt;

&lt;html&gt;

&lt;head&gt;
&lt;script src="/jquery/jquery.js"&gt;&lt;/script&gt;
&lt;script&gt;
var current = 1;

function addPerson() {
	console.log('running addPerson')
	//current keeps track of how many people we have.
	current++;
	var strToAdd = '&lt;p&gt;&lt;label for="firstname"'+current+'"&gt;Name&lt;/label&gt; &lt;em&gt;*&lt;/em&gt;&lt;input id="firstname'+current+'" name="firstname'+current+'" size="25" /&gt; &lt;input id="lastname'+current+'" name="lastname'+current+'" size="25" /&gt;'
	strToAdd += '&lt;p&gt;&lt;label for="email'+current+'"&gt;Email&lt;/label&gt;	&lt;em&gt;*&lt;/em&gt;&lt;input id="email'+current+'" name="email'+current+'" size="25" /&gt;&lt;/p&gt;'
	console.log(strToAdd)
	$('#mainField').append(strToAdd)
}

$(document).ready(function(){
	$('#addPerson').click(addPerson)
});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;form id="someform" method="post"&gt;
	&lt;fieldset id="mainField"&gt;
		&lt;p&gt;
		&lt;label for="firstname1"&gt;Name&lt;/label&gt;
		&lt;em&gt;*&lt;/em&gt;&lt;input id="firstname1" name="firstname1" size="25" /&gt; &lt;input id="lastname1" name="lastname1" size="25" /&gt;
		&lt;/p&gt;
		&lt;p&gt;
		&lt;label for="email1"&gt;Email&lt;/label&gt;
		&lt;em&gt;*&lt;/em&gt;&lt;input id="email1" name="email1" size="25" /&gt;
		&lt;/p&gt;
	&lt;/fieldset&gt;
	
	&lt;p&gt;
	&lt;input type="button" id="addPerson" value="Add Another Person"&gt;
	&lt;/p&gt;
	
	&lt;input type="submit" value="Save"&gt;
&lt;/form&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

I want to talk about this from the bottom up, so please read 'up' with me. The form contains one block of detail for a person - a firstname, lastname, and email address. There are two buttons - one to add another person and one to submit. This is what I started off with as the base form. I wanted it so that when you clicked Add Another Person, it would essentially duplicate the 3 fields.

I began by telling jQuery to monitor the click event for the button (inobtrusive JS FTW):

<code>
$(document).ready(function(){
	$('#addPerson').click(addPerson)
});
</code>

addPerson then had to do two things. First, it needed to know how many people existed on the page already. I had created a JavaScript variable, 'current', with a hard coded value of 1. This doesn't need to be hard coded, but it certainly seemed to be the simplest way to handle it. Inside of addPerson, I immediately increase the value by one. I generate the HTML I want to use which was basically a cut and paste of the HTML below. The only difference is that I make the number part dynamic. I could have probably used a special character like $N and then used Regex to replace it. (On second though, that would have been a lot cleaner I think.) Then I just append the new string to the HTML.

You can view this <a href="http://www.coldfusionjedi.com/demos/jqueryadd/test1.cfm">here</a>.

So a few open questions/things to discuss:

1) jQuery provides a clone() function for the DOM. In theory, I could have just cloned my fieldset. The problem with that (as far as I know) is that I'd end up with form fields that have the same name. That "works" in CF, but the values would be a list. So for example, form.firstname would be "Ray,Jay". That works well until someone has a comma in their name. Not very likely, but still. I believe in PHP it actually gives you the values in an array, but in CF we have no control over that. Maybe I could have done a clone, gotten the new node, and did the regex on the HTML?

2) I didn't demonstrate the CF side to parse this because I've done so many times before, but in case folks are curious - you would simply introspect the Form struct to figure out how many people you have to process.

3) Of course, the next step is to add validation. I'm willing to bet I can use the kick butt jQuery Validation plugin with dynamic forms. I'll check that next!