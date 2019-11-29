---
layout: post
title: "Simple example of a Form post to ColdFusion with jQuery - Login"
date: "2009-03-24T08:03:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/03/24/Simple-example-of-a-Form-post-to-ColdFusion-with-jQuery-Login
guid: 3287
---

A few days ago I <a href="http://www.raymondcamden.com/index.cfm/2009/3/20/Simple-example-of-a-Form-post-to-ColdFusion-with-jQuery">blogged</a> a simple example of doing an Ajax form post with jQuery to a ColdFusion page. Today I'd like to build upon that simple example by demonstrating a login process that uses jQuery to fire off the authentication requests. I know I keep saying this, but do remember that this is just one way to do this and you could modify this code quite a bit if you wanted it to run a bit differently.
<!--more-->
Let's start with a simple Application.cfc file for my application.

<pre><code class="language-markup">&lt;cfcomponent output="false"&gt;
	
	&lt;cfset this.name = "jqlogin"&gt;

	&lt;cfset this.sessionManagement = true&gt;
	
	&lt;!--- Run before the request is processed ---&gt;
	&lt;cffunction name="onRequestStart" returnType="boolean" output="false"&gt;
		&lt;cfargument name="thePage" type="string" required="true"&gt;
		&lt;cfset var page = listLast(arguments.thePage,"/")&gt;

		&lt;cfif not listFindNoCase("login.cfm,auth.cfc",page)&gt;		
			&lt;cfif not structKeyExists(session, "loggedin") or session.loggedin is false&gt;
				&lt;cflocation url="login.cfm" addToken="false"&gt;
			&lt;/cfif&gt;
		&lt;/cfif&gt;
		&lt;cfreturn true&gt;
	&lt;/cffunction&gt;

	&lt;!--- Runs when your session starts ---&gt;
	&lt;cffunction name="onSessionStart" returnType="void" output="false"&gt;
		&lt;cfset session.loggedin = false&gt;
	&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code></pre>

There are two methods defined in this Application.cfc. The important one is the onRequest. It will be used to handle security for the application. If the request is not for my login page or my authentication CFC, and if you aren't logged in (notice I check a session variable initialized in the onSessionStart), then we push the user to the login page.

Now let's look at auth.cfc:

<pre><code class="language-markup">&lt;cfcomponent&gt;

&lt;cffunction name="processLogin" access="remote" output="false" returnType="string"&gt;
	&lt;cfargument name="username" type="string" required="true"&gt;
	&lt;cfargument name="password" type="string" required="true"&gt;
	
	&lt;cfif arguments.username is "mcp" and arguments.password is "tron"&gt;
		&lt;!--- store login success in session ---&gt;
		&lt;cfset session.loggedin = true&gt;
		&lt;cfreturn "success"&gt;
	&lt;cfelse&gt;
		&lt;cfreturn "failure"&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;
	
&lt;/cfcomponent&gt;
</code></pre>

Obviously a real authentication CFC would have a bit more to it. This one simply checks for a hard coded username and password. Depending on if these values are specified correctly, the CFC will either return the word failure, or return success while also setting the session variable. Oh, and of course, I set the method to have remote access. (And yes, I did almost forget that.) 

Ok, so far, nothing really special has been done. Let's look at login.cfm and how I used jQuery.

<pre><code class="language-markup">&lt;html&gt;

&lt;head&gt;
&lt;script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;

function sendForm() {
	$("#status").html('Logging in...');
	$.post('auth.cfc?method=processLogin&returnFormat=plain',$("#loginForm").serialize(),function(data,status){
		data = $.trim(data)
		if (data == 'failure') {
			$("#status").html('&lt;b&gt;Your login failed...&lt;/b&gt;');
		} else {
			//good login
			$("#status").html('');

			document.location.href='index.cfm'
		}

   });

   return false
   
}

$(document).ready(function() {
   $("#loginForm").submit(sendForm)
})

&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;form id="loginForm"&gt;
   Username: &lt;input type="text" name="username"&gt;&lt;br/&gt;
   Password: &lt;input type="password" name="password"&gt;&lt;br/&gt;
   &lt;input type="submit" value="Login" /&gt;
&lt;/form&gt;

&lt;div id="status"&gt;&lt;/div&gt;

&lt;/body&gt;

&lt;/html&gt;
</code></pre>

Let's take this from the bottom up. At the bottom of my page I have my login form with two simple fields. Below that I have a blank div with the id of status. 

Moving up into the script code block, notice the my document.ready code simply hijacks the form's submit action. The send form should look pretty familiar to the one I did in the <a href="http://www.coldfusionjedi.com/index.cfm/2009/3/20/Simple-example-of-a-Form-post-to-ColdFusion-with-jQuery">last blog entry</a>. I start off by creating a message in the status div. This will let my users know that something is going on. Next, I use the built in serialize() function to convert the form into data and send it to my ColdFusion code. This time I'm posting to a CFC method, so I specify a returnFormat to keep the result in simple text. If a failure was returned, I set a message in the status div. If the result was good, I clear the status and then send the user to the home page. Why clear the status? If the home page takes a few seconds to load, I don't want the user to think that their login failed. 

That's it. <strike>You can demo this here: http://www.coldfusionjedi.com/demos/jqlogin. I've also attached the files to this blog entry.<p><a href='enclosures/E{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fjqlogin%{% endraw %}2Ezip'>Download attached file.</a></strike> <i>Old demo links removed on 8/29/2017.</i></p>