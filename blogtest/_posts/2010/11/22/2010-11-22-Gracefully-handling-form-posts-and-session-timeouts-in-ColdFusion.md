---
layout: post
title: "Gracefully handling form posts and session timeouts in ColdFusion"
date: "2010-11-22T17:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/11/22/Gracefully-handling-form-posts-and-session-timeouts-in-ColdFusion
guid: 4024
---

Last week a follower on Twitter let me know that <a href="http://www.riaforge.org">RIAForge</a> doesn't nicely handle session time outs and forms. He had been working on a new project submission and had let his session time out. When he submitted the form he lost what he had typed in. While I haven't quite fixed that yet - I did work on a small demo at lunch time that both demonstrates this problem and shows one way of working around it. Let's begin by looking at the application in it's current "dumb" form.
<!--more-->
<p/>

Let's begin with the critical piece - the Application.cfc file:

<p/>

<code>
component {

	this.name="logindemo";
	this.sessionManagement="true";
	this.sessionTimeOut = createTimeSpan(0,0,2,0);
	
	public boolean function onApplicationStart() {
		return true;
	}
	
	public boolean function onRequestStart(string req) {
		var append = "";
		//handle an authentication
		if(structKeyExists(form, "login") && structKeyExists(form, "username") && structKeyExists(form, "password")) {
			if(form.username == "admin" && form.password == "password") session.loggedin = true;
			else {
				append = "?error=1";
			}
		}

		//force login if not authenticated
		if(!session.loggedin && !find("login.cfm", arguments.req)) location(url='login.cfm#append#',addtoken=false);

		return true;
	}
	
	public void function onSessionStart() {
		session.loggedin=false;
	}
	
}
</code>

<p/>

As this is fairly standard I won't go over every part. The critical parts are within onRequestStart. I have code to detect a login as well as code to force you to a login page if you aren't logged in. The login.cfm file is just a basic form so I won't post it here. (I've got a zip at the end of this entry though with the complete source code.) Now let's imagine a simple form:

<p/>

<code>
&lt;cfparam name="form.name" default=""&gt;
&lt;cfparam name="form.email" default=""&gt;
&lt;cfparam name="form.comment" default=""&gt;

&lt;!--- super fast, simple validation ---&gt;
&lt;cfset errors = ""&gt;
&lt;cfset showForm = true&gt;
&lt;cfif structKeyExists(form, "send")&gt;

	&lt;!--- quickly trim/htmlEditFormat ---&gt;
	&lt;cfloop item="field" collection="#form#"&gt;
		&lt;cfset form[field] = trim(htmlEditFormat(form[field]))&gt;
	&lt;/cfloop&gt;
	
	&lt;cfif not len(form.name)&gt;
		&lt;cfset errors &= "Please include your name.&lt;br/&gt;"&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(form.email) or not isValid("email", form.email)&gt;
		&lt;cfset errors &= "Please include your valid email address.&lt;br/&gt;"&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(form.comment)&gt;
		&lt;cfset errors &= "Please include your comments.&lt;br/&gt;"&gt;
	&lt;/cfif&gt;
	
	&lt;cfif errors is ""&gt;
		&lt;!--- here is where we would email the comments ---&gt;
		&lt;cfset showForm = false&gt;
	&lt;/cfif&gt;
	
&lt;/cfif&gt;

&lt;cfif showForm&gt;
	
	&lt;cfoutput&gt;
	
	&lt;p&gt;
	Use the form below to send us contact information.
	&lt;/p&gt;

	
	&lt;cfif len(variables.errors)&gt;
		&lt;p&gt;
		&lt;b&gt;Please correct the following error(s):&lt;br/&gt;#variables.errors#&lt;/b&gt;
		&lt;/p&gt;
	&lt;/cfif&gt;
		
	&lt;form action="contact.cfm" method="post"&gt;
	&lt;p&gt;
	Your name:&lt;br/&gt;
	&lt;input type="text" name="name" value="#form.name#"&gt;
	&lt;/p&gt;
	
	&lt;p&gt;
	Your email address:&lt;br/&gt;
	&lt;input type="text" name="email" value="#form.email#"&gt;
	&lt;/p&gt;
	
	&lt;p&gt;
	Your comments:&lt;br/&gt;
	&lt;textarea name="comment"&gt;#form.comment#&lt;/textarea&gt;
	&lt;/p&gt;
	
	&lt;p&gt;
	&lt;input type="submit" name="send" value="Send"&gt;
	&lt;/p&gt;
	
	&lt;/form&gt;
	
	&lt;/cfoutput&gt;
	
&lt;cfelse&gt;

	&lt;p&gt;
	Thank you for your feedback.
	&lt;/p&gt;
	
&lt;/cfif&gt;
</code>

<p/>

This form consists of three simple fields. Normally I'd have the error checking in a controller file, but hopefully this won't offend my Model-Glue friends. Now used as is - and with the quick 2 minute session timeout I setup - it would be easy for a user to end up losing their form when they fill it out. If they take longer than two minutes to fill it out - their data is essentially lost. Lost in time. Like tears in the rain. (Sorry - got distracted.) 

<p/>

Let's look at how we could handle this nicer. In my 'dream' world the user hits submit on the form - is asked to relogin - and is then returned to the form as if nothing had happened. If the form data was all good, then the form process is complete. If there was some error, then it is displayed. Again - it should act as if the session timeout never happened. Here is my new Application.cfc file:

<p/>

<code>

component {

	this.name="logindemo";
	this.sessionManagement="true";
	this.sessionTimeOut = createTimeSpan(0,0,0,15);
	
	public boolean function onApplicationStart() {
		return true;
	}
	
	public boolean function onRequestStart(string req) {
		var append = "";
		var togo = "";

		//handle an authentication
		if(structKeyExists(form, "login") && structKeyExists(form, "username") && structKeyExists(form, "password")) {
			if(form.username == "admin" && form.password == "password") {
				session.loggedin = true;
				if(structKeyExists(session, "requestedurl")) {
					togo = session.requestedurl;
					structDelete(session, "requestedurl");
					location(url=togo, addtoken=false);
				} 
			} else {
				append = "?error=1";
			}
		}

		//force login if not authenticated
		if(!session.loggedin && !find("login.cfm", arguments.req)) {
			session.requestedurl = arguments.req & "?" & cgi.query_string;
			if(!structIsEmpty(form)  && !structKeyExists(form, "login")) session.formdata = serializeJSON(form);
			location(url='login.cfm#append#',addtoken=false);
		}

		//Got Form?
		if(session.loggedin && structKeyExists(session, "formData") and isJSON(session.formData)) {
			structAppend(form,deserializeJSON(session.formData));
			structDelete(session, "formData");
		}
		
		return true;
	}
	
	public void function onRequestEnd(string req) {
	}

	public void function onSessionStart() {
		session.loggedin=false;
	}
	
}
</code>

<p/>

Ok, we've got a few changes here so let's pick them apart. First, let's focus on the block that occurs when you aren't logged in:

<p/>

<code>
//force login if not authenticated
if(!session.loggedin && !find("login.cfm", arguments.req)) {
	session.requestedurl = arguments.req & "?" & cgi.query_string;
	if(!structIsEmpty(form)  && !structKeyExists(form, "login")) session.formdata = serializeJSON(form);
	location(url='login.cfm#append#',addtoken=false);
}
</code>

<p/>

I made two changes here. First - I noticed what your original request was. Both the file and the query string. Secondly I look to see if the form contained any data. I want to ensure I'm not posting a login itself so I check for that as well. If so, I copy the data into the session scope. (I just realized that I serialized it and I really didn't need to. But using JSON would allow me to do other things - like perhaps use the client scope.) Now let's go back up to the 'you logged in' block:

<p/>

<code>
//handle an authentication
if(structKeyExists(form, "login") && structKeyExists(form, "username") && structKeyExists(form, "password")) {
	if(form.username == "admin" && form.password == "password") {
		session.loggedin = true;
		if(structKeyExists(session, "requestedurl")) {
			togo = session.requestedurl;
			structDelete(session, "requestedurl");
			location(url=togo, addtoken=false);
		} 
	} else {
		append = "?error=1";
	}
}
</code>

<p/>

The main change here is that we now look for the 'requestedurl' value. If it exists, we push you there. This will handle returning the user to the contact form. Now let's look at the final block:

<p/>

<code>
//Got Form?
if(session.loggedin && structKeyExists(session, "formData") and isJSON(session.formData)) {
	structAppend(form,deserializeJSON(session.formData));
	structDelete(session, "formData");
}
</code>

<p/>

The final bit simply looks for the stored form data - deserializes it - and appends it to the Form scope. And that's it. To the contact form nothing has changed at all. It's the exact same code. But you can now handle a session time out gracefully and not lose anything in terms of the user's content. 

<p/>

This system is not perfect of course. File uploads will be lost. But - it is certainly better than nothing. How have other people solved this problem on their web sites? Click the big demo button to check it out (and note that I've set the session timeout to 15 seconds). You can download the code as well.

<p/>

<a href="http://www.raymondcamden.com/demos/nov222010/"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Flogin2%{% endraw %}2Ezip'>Download attached file.</a></p>