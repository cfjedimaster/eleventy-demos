---
layout: post
title: "Mixing client side dynamic forms with dynamic ColdFusion form processing"
date: "2009-01-18T11:01:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/01/18/Mixing-client-side-dynamic-forms-with-dynamic-ColdFusion-form-processing
guid: 3199
---

Here is an interesting thing I played with this Sunday morning. How can I create a dynamic form on the client side and combine it with dynamic processing on the server side? For example - consider a form that lets you send email to your friends. By default we could ask you for 5 sets of names and email addresses. But what if you aren't a programmer and have more than five friends? You could use a form that lets you enter data and includes a button labeled "I have more friends." The form would post to itself and then simply add more blank fields. That's kind of what <a href="http://soundings.riaforge.org">Soundings</a> does. It <i>works</i>, but we can do better, right?
<!--more-->
Let's start with a simple form and a set number of fields.

<code>
&lt;!--- Number of default rows to show ---&gt;
&lt;cfset defaultRows = 5&gt;

&lt;html&gt;

&lt;head&gt;
&lt;/head&gt;

&lt;body&gt;
	
&lt;p&gt;
Enter the names and email addresses of all your friends so we can spam them.
&lt;/p&gt;
	
&lt;form action="index.cfm" method="post" id="mainform"&gt;
&lt;table id="maintable"&gt;
	&lt;tr&gt;
		&lt;th&gt;Name&lt;/th&gt;
		&lt;th&gt;Email&lt;/th&gt;
	&lt;/tr&gt;
	&lt;cfloop index="x" from="1" to="#defaultRows#"&gt;
		&lt;tr&gt;
			&lt;cfoutput&gt;
			&lt;td&gt;&lt;input type="text" name="name#x#" class="name"&gt;&lt;/td&gt;
			&lt;td&gt;&lt;input type="text" name="email#x#" class="email"&gt;&lt;/td&gt;
			&lt;/cfoutput&gt;
		&lt;/tr&gt;
	&lt;/cfloop&gt;
&lt;/table&gt;

&lt;/body&gt;
&lt;/html&gt;

&lt;p&gt;
Enter a message for them:&lt;br/&gt;	
&lt;textarea name="msg" cols="40" rows="6"&gt;&lt;/textarea&gt;
&lt;/p&gt;

&lt;input type="submit" value="Send"&gt;	
&lt;/form&gt;
</code>

Nothing too complex here. I've set a CF variable, defaultRows, that indicates I'll have 5 sets of friends. Note then the loop that creates one TR for each set. 

This works well enough, but how can we add another set so we can add more friends? I looked to jQuery to see how easy it would be to add a new table row. I seem to remember that adding content, in general, to the browser is easy, but that tables were a bit more difficult. I figured, though, that jQuery would make this easier. 

A quick Google search turned up a solution by a user named motob (<a href="http://www.mail-archive.com/jquery-en@googlegroups.com/msg20739.html">http://www.mail-archive.com/jquery-en@googlegroups.com/msg20739.html</a>). I've no idea who he is, but thanks to him, I was able to get it working. I began by adding this link below the table:

<code>
&lt;a href="" onclick="addrow();return false;"&gt;Add Friend&lt;/a&gt;
</code>

And then added the following code:

<code>
&lt;script src="/jquery/jquery.js"&gt;&lt;/script&gt;
&lt;script&gt;
var totalRows = &lt;cfoutput&gt;#defaultRows#&lt;/cfoutput&gt;;

function addrow() { 
	totalRows++;
	var clonedRow = $("table#maintable tr:last").clone(); //this will grab the last table row.
	//get the textfield
	var tfName = $("input.name",clonedRow);
	var tfEmail = $("input.email",clonedRow);

	//change their names
	tfName.attr("name","name"+totalRows);
	tfEmail.attr("name","email"+totalRows);

	$("table#maintable").append(clonedRow); //add the row back to the table
	console.log('done')
}
&lt;/script&gt;
</code>

I begin by loading in my jQuery library. Kind of hard to use jQuery without it. Next I create a page-wide variable, totalRows, that matches the ColdFusion variable defaultRows. Next up is addrow. This is where the magic is. I use the clone() function as described by motob. This creates a clone of the last table row. Note - when I first tried this code my 'Add Friend' link was in a right-aligned final row. I had to work around that a bit and then decided to just make it simpler and remove the link from the last row. 

Ok, so the clone works just fine, but we need to get the input controls from within. If you look back at, you will notice I set a class for each input field. This doesn't match to any real CSS, but is just used as a marker. (Is there a better way, jQuery gurus?) Once I have a pointer to each input field, it is a simple matter to update their names. Lastly, I append the row back to the table.

A bit off topic, but what's the deal with console.log() at the end? This will only work in Firebug, so IE users please remove it. I added this in to make it easier to see if the code worked. When you have a link/button/whatever run JS code and the JS code has an error, the page will simply let the link 'continue' and the page will reload. Now Firefox does have a nice error console and I keep it open, but sometimes the reload 'flash' is so quick I miss it. By using that conole.log at the end, I get a quick way to see if everything ran ok, or at least did not throw an error. 

Ok, so that's the client side, on the server side, it isn't that complex. I added this to the top of my page:

<code>
&lt;cfif not structIsEmpty(form)&gt;
	&lt;cfset counter = 1&gt;
	&lt;cfloop condition="structKeyExists(form,'name#counter#') and structKeyExists(form,'email#counter#')"&gt;
		&lt;cfset name = form["name#counter#"]&gt;
		&lt;cfset email = form["email#counter#"]&gt;
		&lt;cfif len(trim(name)) and isValid("email", email)&gt;
			&lt;cfmail to="#email#" from="ray@camdenfamily.com" subject="A very special message...."&gt;
Hi #name#!

#form.msg#
			&lt;/cfmail&gt;
			&lt;cfoutput&gt;I sent email to #name# (#email#)&lt;br/&gt;&lt;/cfoutput&gt;
		&lt;/cfif&gt;
		&lt;cfset counter++&gt;
	&lt;/cfloop&gt;
&lt;/cfif&gt;
</code>

I simply loop with a condition checking to see if nameX and emailX exists. I'll continue onto infinity so for those of you with more than 5 friends, you will be covered. (If I did this during high school I'd have to add a 'Remove Friend' function!)

For each loop I grab the values, do basic validation, and send email. (I should also add basic validation to form.msg as well.) The complete code is below. Like always, I'll remind people I'm still new to jQuery so most likely it could be done a bit better.

<code>
&lt;cfif not structIsEmpty(form)&gt;
	&lt;cfset counter = 1&gt;
	&lt;cfloop condition="structKeyExists(form,'name#counter#') and structKeyExists(form,'email#counter#')"&gt;
		&lt;cfset name = form["name#counter#"]&gt;
		&lt;cfset email = form["email#counter#"]&gt;
		&lt;cfif len(trim(name)) and isValid("email", email)&gt;
			&lt;cfmail to="#email#" from="ray@camdenfamily.com" subject="A very special message...."&gt;
Hi #name#!

#form.msg#
			&lt;/cfmail&gt;
			&lt;cfoutput&gt;I sent email to #name# (#email#)&lt;br/&gt;&lt;/cfoutput&gt;
		&lt;/cfif&gt;
		&lt;cfset counter++&gt;
	&lt;/cfloop&gt;
&lt;/cfif&gt;

&lt;!--- Number of default rows to show ---&gt;
&lt;cfset defaultRows = 5&gt;

&lt;html&gt;

&lt;head&gt;
&lt;script src="/jquery/jquery.js"&gt;&lt;/script&gt;
&lt;script&gt;
var totalRows = &lt;cfoutput&gt;#defaultRows#&lt;/cfoutput&gt;;

function addrow() { 
	totalRows++;
	var clonedRow = $("table#maintable tr:last").clone(); //this will grab the last table row.
	//get the textfield
	var tfName = $("input.name",clonedRow);
	var tfEmail = $("input.email",clonedRow);

	//change their names
	tfName.attr("name","name"+totalRows);
	tfEmail.attr("name","email"+totalRows);

	$("table#maintable").append(clonedRow); //add the row back to the table
	console.log('done')
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
	
&lt;p&gt;
Enter the names and email addresses of all your friends so we can spam them.
&lt;/p&gt;
	
&lt;form action="index.cfm" method="post" id="mainform"&gt;
&lt;table id="maintable"&gt;
	&lt;tr&gt;
		&lt;th&gt;Name&lt;/th&gt;
		&lt;th&gt;Email&lt;/th&gt;
	&lt;/tr&gt;
	&lt;cfloop index="x" from="1" to="#defaultRows#"&gt;
		&lt;tr&gt;
			&lt;cfoutput&gt;
			&lt;td&gt;&lt;input type="text" name="name#x#" class="name"&gt;&lt;/td&gt;
			&lt;td&gt;&lt;input type="text" name="email#x#" class="email"&gt;&lt;/td&gt;
			&lt;/cfoutput&gt;
		&lt;/tr&gt;
	&lt;/cfloop&gt;
&lt;/table&gt;
&lt;a href="" onclick="addrow();return false;"&gt;Add Friend&lt;/a&gt;

&lt;/body&gt;
&lt;/html&gt;

&lt;p&gt;
Enter a message for them:&lt;br/&gt;	
&lt;textarea name="msg" cols="40" rows="6"&gt;&lt;/textarea&gt;
&lt;/p&gt;

&lt;input type="submit" value="Send"&gt;	
&lt;/form&gt;
</code>