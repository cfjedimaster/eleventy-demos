---
layout: post
title: "Using ColdFusion and Ajax to check for an existing database record"
date: "2011-09-01T00:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/08/31/Using-ColdFusion-and-Ajax-to-check-for-an-existing-database-record
guid: 4349
---

A user on Twitter (@sean010101, or Sean21 to his friends), asked about using cfinput to validate that a value does not collide with entries in the database. I assume he was talking about the validation aspects of cfform. That is not something I make use of myself. There's a lot of built in validation rules with cfform, but I normally would make use of the <a href="http://bassistance.de/jquery-plugins/jquery-plugin-validation/">jQuery Validate</a> plugin. That being said - his query - validating to see if a record exists - interested me so I decided to dig a bit to see what was possible.
<!--more-->
<p>

My goal was this. Given a form with one field, a name field, validate that the value entered by the user did not match an existing last name in the art database that ships with ColdFusion. I decided to first try a simple message base solution. By that I meant the user would be told the last name was a match.

<p>

<code>
&lt;cfform name="mainForm"&gt;
	New Artist: &lt;cfinput name="artist"&gt;&lt;br/&gt;
	&lt;cfdiv bind="cfc:test.checkArtist({% raw %}{artist@keyup}{% endraw %})" &gt;

&lt;/cfform&gt;
</code>

<p>

In this example, I've used cfdiv to bind to a CFC. It listens in for changes to the artist form field and specifically makes use of the keyup event listener. I know I kind of poo poo on the front end Ajax stuff ColdFusion uses, but I <i>really</i> like how simple this is. Let's look at the CFC.

<p>

<code>
component {

	remote function checkArtist(string n) {
		var q = new com.adobe.coldfusion.query();
		q.setDatasource("cfartgallery");
		q.setSQL("select lastname from artists where upper(lastname) = :name");
		q.addParam(name="name",value="#ucase(arguments.n)#",cfsqltype="cf_sql_varchar");
		var res = q.execute().getResult();
		if(res.recordCount) return "This artist already exist.";
		return "";
	}

}
</code>

<p>

As you can see, I do a simple database check and if there is an exact match, I return an error. You can demo this yourself here: <a href="http://www.raymondcamden.com/demos/aug312011/test3.cfm">http://www.coldfusionjedi.com/demos/aug312011/test3.cfm</a>. Try "Weber" as a name and you will see it return a match.

<p>

Ok - now that works, but it doesn't actually validate per se in that it should also prevent you from submitting the form, right? The first thing I considered was a cfinput/type=button that used a bind as well. What you may not know, and I had forgotten myself too, that you can bind to a specific HTML attribute. I was going to use this to bind to the disabled attribute of the button, but in HTML, the presence of disabled as an attribute means the item is disabled. You can't do (as far as I know), disabled="false". So I decided to go another route.

<p>

<code>
&lt;cfajaxproxy bind="cfc:test.checkArtist({% raw %}{artist@keyup}{% endraw %})" onSuccess="handleConflict"&gt;
&lt;script&gt;
function handleConflict(r){
	if (r == true) {
		document.getElementById("warning").innerHTML="This artist exists.";
		document.getElementById("submitBtn").setAttribute("disabled", "disabled");
	}
	else {
		document.getElementById("warning").innerHTML="";
		document.getElementById("submitBtn").removeAttribute("disabled");	
	}
}
&lt;/script&gt;

&lt;cfform name="mainForm"&gt;
	New Artist: &lt;cfinput name="artist"&gt;&lt;br/&gt;
	&lt;div id="warning"&gt;&lt;/div&gt;
	&lt;input type="submit" id="submitBtn" value="Save"&gt;
&lt;/cfform&gt;
</code>

<p>

In this version, I use a cfajaxproxy to create a bind between the form field and a JavaScript function. What may not be immediately clear is that ColdFusion is handling all the Ajax for me. I basically tell it what CFC to run and what function to call on success. Now I can take the result (I modified the CFC to return true or false) and do my own message. Also note the addition of code to add or remove the disabled attribute. Here's the new CFC method:

<p>

<code>
remote function checkArtist(string n) {
	var q = new com.adobe.coldfusion.query();
	q.setDatasource("cfartgallery");
	q.setSQL("select lastname from artists where upper(lastname) = :name");
	q.addParam(name="name",value="#ucase(arguments.n)#",cfsqltype="cf_sql_varchar");
	var res = q.execute().getResult();
	return res.recordCount==1;
}
</code>

<p>

Pretty simple, right? You can test this one here: <a href="http://www.coldfusionjedi.com/demos/aug312011/test2.cfm">http://www.coldfusionjedi.com/demos/aug312011/test2.cfm</a> As before, use "Weber" as a matched result. Tomorrow I'll do an example where I still use ColdFusion on the back end but replace all the front end code with jQuery.