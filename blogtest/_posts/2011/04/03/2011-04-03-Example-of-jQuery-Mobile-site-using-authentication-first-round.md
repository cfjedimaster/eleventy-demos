---
layout: post
title: "Example of jQuery Mobile site using authentication - first round"
date: "2011-04-03T17:04:00+06:00"
categories: [coldfusion,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/04/03/Example-of-jQuery-Mobile-site-using-authentication-first-round
guid: 4182
---

I've been thinking lately about how to add authentication to a jQuery Mobile site. I whipped up a quick example that works, but I'm definitely open to suggestions on how this could be done better. My intent with calling this entry the "first round" is to make it clear that there are other ways of doing this and probably <i>better</i> ways of doing it. Hopefully this example will help others and - admittedly - flesh out some improvements from my readers.
<!--more-->
<p>

I began by creating a very simple page with two links. In my application login is not required for everything, but only for one link. 

<p>

<code>
&lt;!DOCTYPE html&gt; 
&lt;html&gt; 
	&lt;head&gt; 
	&lt;title&gt;Page Title&lt;/title&gt; 
	&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/1.0a4/jquery.mobile-1.0a4.min.css" /&gt;
	&lt;script src="http://code.jquery.com/jquery-1.5.2.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://code.jquery.com/mobile/1.0a4/jquery.mobile-1.0a4.min.js"&gt;&lt;/script&gt;
&lt;/head&gt; 
&lt;body&gt; 

&lt;div data-role="page"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Secure Site Test&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
		&lt;ul data-role="listview" data-inset="true"&gt;
			&lt;li data-role="list-divider"&gt;Options&lt;/li&gt;
			&lt;li&gt;&lt;a href="page1.cfm"&gt;Non-Secure page&lt;/a&gt;&lt;/li&gt;
			&lt;li&gt;&lt;a href="page2.cfm"&gt;Secure page&lt;/a&gt;&lt;/li&gt;
		&lt;/ul&gt;
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

So I won't go over the basics - I've blogged about jQuery Mobile quite a bit already - but you can see I've created a basic list page with two links. One to an open page and one to a secure page. I then created page1.cfm:

<p>

<code>
&lt;div data-role="page"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Non-Secure page&lt;/h1&gt;
		&lt;a href="index.cfm" data-icon="home" class="ui-btn-right"&gt;Home&lt;/a&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
		&lt;p&gt;This page is not secure.&lt;/p&gt;		
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;
</code>

<p>

And then page2.cfm - note this page assumes that session.username exists. 

<p>

<code>
&lt;div data-role="page"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Secure page&lt;/h1&gt;
		&lt;a href="index.cfm" data-icon="home" class="ui-btn-right"&gt;Home&lt;/a&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
		&lt;cfoutput&gt;
		&lt;p&gt;This page is secure. You should only see it if you are logged in: #session.username#&lt;/p&gt;
		&lt;/cfoutput&gt;
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;
</code>

<p>

So - how to handle the security? I decided to add a simple Application.cfc page. This will run with every request and I could use it to lock down requests for page2.cfm. Remember that jQuery Mobile will load page2.cfm via an Ajax call, but it's still just a request to ColdFusion.

<p>

<code>
component {
	this.name="jqmwithlogin_rev1";
	this.sessionManagement="true";
	
	public boolean function onApplicationStart() {
		return true;
	}
	
	public boolean function onRequestStart(string req) {
		//logic to determine if a page is secured should probably be elsewhere...
		if(listLast(arguments.req, "/") == "page2.cfm" && !structKeyExists(session, "username")) {
			location(url="login.cfm",addToken=false);	
		}
		return true;
	}
	
}
</code>

<p>

You can see where I do my security check. I wouldn't normally write the code so statically, but for a simple example it works ok. My app only has one secure page so the logic isn't too complex. Anything more than one though would require a bit more thought here. So if the request is for my secured page and I am not logged in, I use a location call to push the user to the login page. Let's look at that.

<p>

<code>
&lt;cfif structKeyExists(form, "login")&gt;
	&lt;cfif form.username is "admin" and form.password is "admin"&gt;
		&lt;cfset session.username = "admin"&gt;
		&lt;cflocation url="page2.cfm" addToken="false"&gt;
	&lt;cfelse&gt;
		&lt;cfset badFlag = true&gt;
	&lt;/cfif&gt;
&lt;/cfif&gt;

&lt;div data-role="page"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Login&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;
		&lt;cfif not structKeyExists(variables, "badFlag")&gt;
			&lt;p&gt;Please login...&lt;/p&gt;
		&lt;cfelse&gt;
			&lt;p&gt;Your login was incorrect - try again - try harder...&lt;/p&gt;
		&lt;/cfif&gt;	
		&lt;p&gt;
		&lt;form action="login.cfm" method="post"&gt;

			&lt;div data-role="fieldcontain"&gt;
			    &lt;label for="username"&gt;Username:&lt;/label&gt;
			    &lt;input type="text" name="username" id="username"  /&gt;
			&lt;/div&gt;	

			&lt;div data-role="fieldcontain"&gt;
			    &lt;label for="password"&gt;Password:&lt;/label&gt;
			    &lt;input type="password" name="password" id="password" /&gt;
			&lt;/div&gt;	

			&lt;input type="submit" name="login" value="Login" /&gt;
		&lt;/form&gt;
			
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;
</code>

<p>

So - this page is a bit bigger, but not really that complex. The form makes use of a divs with the role fieldcontain. This is standard jqm form rendering style. My form posts to itself and you can see logic on top of the file to handle that. Note the use of a static username and password. Again - this isn't something you would do normally. If the login is ok, once again a location is called to send you to the secure page. 

<p>

So - how horrible is this? It seems to work ok.  You can try this yourself by running the demo below.

<p>


<a href="http://www.raymondcamden.com/demos/april32011/rev1/"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>