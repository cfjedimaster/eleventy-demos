---
layout: post
title: "ColdFusion 8 and Ajax-Based Login"
date: "2007-11-29T15:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/29/coldfusion-8-and-ajaxbased-login
guid: 2504
---

Some of the new, cool, hip sites out there have done something rather neat with their login system. If you take a look at <a href="http://www.technorati.com/">Technorati</a>, notice that when you click the Sign In link, a modal window pops up. This lets you login no matter where you in the site. No need to go to another page (thank goodness, since Technorati is slow) and be sent back (hopefully) when done. Can ColdFusion 8 do this? Of course! Let's look at an example.
<!--more-->
First off - imagine we have an existing site. One that uses a custom tag for layout (details may be found <a href="http://www.raymondcamden.com/index.cfm/2007/9/3/ColdFusion-custom-tag-for-layout-example">here</a>). All of our pages use the custom tag. For example:

<code>
&lt;cf_layout&gt;

&lt;p&gt;
Welcome to our Web 2.0 site. 
&lt;/p&gt;

&lt;/cf_layout&gt;
</code>

(As just a quick warning, I'll be sharing the complete code for all of this at the end of the blog entry, and via a download link.) Our layout custom tag creates a simple navigation table on top:

<code>
&lt;a href="index.cfm"&gt;Home&lt;/a&gt; / &lt;a href="about.cfm"&gt;About Us&lt;/a&gt; / &lt;a href="buy.cfm"&gt;Buy Us&lt;/a&gt;
</code>

The first thing I want to do is add a Login link to the menu:

<code>
/ &lt;a href="javaScript:doLogin()"&gt;Login&lt;/a&gt;
</code>

The link above runs the JavaScript function, doLogin, so let's go there next.

<code>
function doLogin() {
	ColdFusion.Window.create('loginwindow','Login','login.cfm',{% raw %}{center:true,modal:true}{% endraw %});
}
</code>

This function simply uses the ColdFusion/Ajax API to create a window. I named it loginwindow, gave it a title, pointed it to a login.cfm page, and passed a few attributes. I could have styled it as well, made it a specific size, etc. But you get the idea. Now let's look at login.cfm:

<code>
&lt;form action="login.cfm" onSubmit="handleLogin();return false;" id="loginform"&gt;
&lt;table&gt;
	&lt;tr&gt;
		&lt;td&gt;Username:&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="username"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;Password:&lt;/td&gt;
		&lt;td&gt;&lt;input type="password" name="password"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;&nbsp;&lt;/td&gt;
		&lt;td&gt;&lt;input type="submit" name="login" value="Login"&gt;&lt;/td&gt;
	&lt;/tr&gt;
&lt;/table&gt;
&lt;/form&gt;
</code>

This is a fairly simple form - but note that I specifically block the form submission. I call yet another JavaScript function, handleLogin. So let's take a look at that:

<code>
function handleLogin() {
	ColdFusion.Ajax.submitForm('loginform','processlogin.cfm',handleResponse);
}
</code>

Once again we have a use of the ColdFusion/Ajax API. The submitForm function will do exactly as it sounds - send an entire form block to a page. My last argument, handleResponse, is the function that will be called with the result. Let's look at processlogin.cfm first:

<code>
&lt;cfsetting enablecfoutputonly="true"&gt;
&lt;cfparam name="form.username" default=""&gt;
&lt;cfparam name="form.password" default=""&gt;

&lt;cfif structKeyExists(form, "login")&gt;
	&lt;cfif form.username is "paris" and form.password is "hilton"&gt;
		&lt;cfset session.loggedin = true&gt;
		&lt;cfoutput&gt;good&lt;/cfoutput&gt;
	&lt;cfelse&gt;
		&lt;cfoutput&gt;bad&lt;/cfoutput&gt;
	&lt;/cfif&gt;
&lt;/cfif&gt;
</code>

Nothing too complex here. Normally you would call a CFC to handle the authentication. I've never used a hard coded username and password in production. Really. Now notice that I output two strings: good and bad. Remember how I submitForm named a function to run with the result? Let's look at that now:

<code>
function handleResponse(s) {
	if(s == "good") {
		//first hide the window
		ColdFusion.Window.hide('loginwindow');
		//rewrite out login
		var loginspan = document.getElementById('loginstatus');
		var newcontent = "&lt;a href='index.cfm?logout=1'&gt;Logout&lt;/a&gt;";
		loginspan.innerHTML = newcontent;
	} else {
		alert('Your login didn\'t work. Try paris/hilton');
	}
}
</code>

The function was passed the response, so all I need to do is check the value. If it is good, I hide the window (again, using the ColdFusion/Ajax API. Now I do something fancy. It wouldn't make sense to keep the login link on the page. I wrapped my login link in a span:

<code>
&lt;span id="loginstatus"&gt;&lt;a href="javaScript:doLogin()"&gt;Login&lt;/a&gt;&lt;/span&gt;
</code>

This lets me get the span and change the HTML inside. Pretty simple, right?

To see an online demo of this, go here: <a href="http://www.coldfusionjedi.com/demos/login/index.cfm">http://www.coldfusionjedi.com/demos/login/index.cfm</a>

Obviously someone could do this a lot prettier then I did - but notice how nice it works. You can login from any page, and when done, you are still on the page you were looking at. (I do something like this for the contact form at <a href="http://www.coldfusionbloggers.org">CFBloggers.org</a>.) Also note how little JavaScript was involved. The most complex bit was handling the result of the login, and even that was just about 10 lines of code.

Enjoy. I've attached the code to this blog entry.<p><a href='/enclosures/login.zip'>Download attached file.</a></p>