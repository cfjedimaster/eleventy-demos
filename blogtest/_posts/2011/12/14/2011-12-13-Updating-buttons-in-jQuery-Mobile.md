---
layout: post
title: "Updating buttons in jQuery Mobile"
date: "2011-12-14T07:12:00+06:00"
categories: [jquery,mobile]
tags: []
banner_image: 
permalink: /2011/12/14/Updating-buttons-in-jQuery-Mobile
guid: 4461
---

When working with various control types in jQuery Mobile (forms, widgets ,etc), one of the things you have to remember is that after jQuery Mobile "enhances" your content, changes to those controls, like via JavaScript, have to be updated as well. I've run into this already with list controls. Recently I built a form for a PhoneGap app and ran into the same problem. I thought I'd demonstrate the solution (which is rather simple), and give a complete example of what you need to do.

<p/>
<!--more-->
First, let's create a super simple application. It will have two pages - a login screen and a second page. Here's our login screen:

<p/>

<code>
&lt;!DOCTYPE html&gt; 
&lt;html&gt; 
	&lt;head&gt; 
	&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;	
	&lt;title&gt;Button Example&lt;/title&gt; 
	&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/latest/jquery.mobile.min.css" /&gt;
	&lt;script src="http://code.jquery.com/jquery-1.6.4.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://code.jquery.com/mobile/latest/jquery.mobile.min.js"&gt;&lt;/script&gt;
	&lt;script src="main.js"&gt;&lt;/script&gt;
&lt;/head&gt; 
&lt;body&gt; 

&lt;div data-role="page" id="homePage"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Login&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
		&lt;form id="loginForm"&gt;
		&lt;div data-role="fieldcontain"&gt;    
	        &lt;label for="username"&gt;Username:&lt;/label&gt;    
	        &lt;input type="text" name="username" id="username" value=""  /&gt;    
	    &lt;/div&gt;	
		&lt;div data-role="fieldcontain"&gt;    
	        &lt;label for="password"&gt;Password:&lt;/label&gt;    
	        &lt;input type="text" name="password" id="password" value=""  /&gt;    
	    &lt;/div&gt;	
		&lt;input type="submit" id="submitButton" value="Login"&gt;
		&lt;/form&gt;
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Nothing there should be terribly interesting - it's just two form fields and a button. Note we load up main.js. That's where our logic will be. Let's look at the initial version.

<p>

<code>
$("#homePage").live("pageinit", function() {
	console.log("Ready");
	
	$("#loginForm").submit(function(e) {
		var username = $.trim($("#username").val());
		var password = $.trim($("#password").val());
		
		if(username != '' && password != '') {
			$.post("service.cfc?method=authenticate&returnformat=json", 
					{% raw %}{username:username,password:password}{% endraw %}, 
					function(res) {
						if(res) {
							$.mobile.changePage("page2.html");
						} else {
							//warn user of error
						}
					}
			);
		}
	
		return false;
	});
	
});
</code>

<p>

Now - let me be absolutely clear. You do not need to write JavaScript code to handle a form submission. I am for demonstration purposes, and the assumption is that there would be a bit more logic here. So for example, I don't bother telling the user if they leave the fields blank. You would probably want to do that. 

<p>

So given then, you can see we get the fields and simply hit a CFC for validation. Here is that code.

<p>

<code>
component {

	remote boolean function authenticate(string username, string password) {
		sleep(3000);
		return (username == "admin" && password == "password");
		
	}

}
</code>

<p>

The only thing you should note here is the use of sleep. What I'm doing here is faking a slow service. Originally, this code was built for a PhoneGap mobile app - so the authentication service was going over the network and took about a second. This code will take at least three seconds to run.

<p>

So given that - it would be nice to provide some feedback to the user, right? I decided to simply disable and change the submit button. The user sees right away that the something is going on, and they can't keep clicking the submit button to try to make it go quicker. (Be honest - you've done that too.) Let's look at the new version:

<p>

<code>
$("#homePage").live("pageinit", function() {
	console.log("Ready");
	
	$("#loginForm").submit(function(e) {
		var username = $.trim($("#username").val());
		var password = $.trim($("#password").val());
		
		if(username != '' && password != '') {
        	$("#submitButton",this).attr("disabled","disabled");
        	$("#submitButton").val("Logging in...");
        	$("#submitButton").button("refresh");

			$.post("service.cfc?method=authenticate&returnformat=json", 
					{% raw %}{username:username,password:password}{% endraw %}, 
					function(res) {
						if(res) {
							$.mobile.changePage("page2.html");
						} else {
				        	$("#submitButton").removeAttr("disabled");
				        	$("#submitButton").val("Login");
				        	$("#submitButton").button("refresh");
							//warn user of error
						}
					},"json"
			);
		}
	
		return false;
	});
	
});
</code>

<p>

Primarily the logic is rather simple. Add the disabled attribute and change the value. You can see where I back that out on error too. But the critical thing to note is the use of $("#submitButton").button("refresh"). Without this one line, the user will not see your changes. Your affecting the original item as it was in the DOM, but not the new sexy version jQuery Mobile created for you.

<p>

<a href="http://www.raymondcamden.com/demos/2011/dec/14/"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

<b>Update!</b> Thanks to James for pointing out that jQuery Mobile provides a simple API to enable/disable buttons. I've updated the code in the demo to reflect this, and here is the new version of the code.

<p>

<code>

$("#homePage").live("pageinit", function() {
	console.log("Ready");
	
	$("#loginForm").submit(function(e) {
		var username = $.trim($("#username").val());
		var password = $.trim($("#password").val());
		
		if(username != '' && password != '') {
        	$("#submitButton").button("disable");
        	$("#submitButton").val("Logging in...");
        	$("#submitButton").button("refresh");

			$.post("service.cfc?method=authenticate&returnformat=json", 
					{% raw %}{username:username,password:password}{% endraw %}, 
					function(res) {
						if(res) {
							$.mobile.changePage("page2.html");
						} else {
				        	$("#submitButton").button("enable");
				        	$("#submitButton").val("Login");
				        	$("#submitButton").button("refresh");
							//warn user of error
						}
					},"json"
			);
		}
	
		return false;
	});
	
});
</code>