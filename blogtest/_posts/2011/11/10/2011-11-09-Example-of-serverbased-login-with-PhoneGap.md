---
layout: post
title: "Example of server-based login with PhoneGap"
date: "2011-11-10T09:11:00+06:00"
categories: [html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/11/10/Example-of-serverbased-login-with-PhoneGap
guid: 4427
---

**I got a comment about a few things on this blog post and thought I'd do a quick edit. First, when I wrote this, I just assumed anyone doing a login request would be hitting a https server. My code shows hitting a http server because at the time, that's how my blog was hosted, but I assumed people running this code in production wouldn't do that. That was wrong. So to be clear, you should be logging in to something on https only. I'm changing the code to reflect that, even though the demo itself isn't online. Secondly - I mentioned in the article how I was unsure that storing credentials in LocalStorage was a good idea. I definitely do not think it is now. I'd look at the Secure Storage wrapper I blogged about last year: [Working with Ionic Native - Using Secure Storage](https://www.raymondcamden.com/2016/08/16/working-with-ionic-native-using-secure-storage)** 

Yesterday I worked on a simple PhoneGap that would demonstrate how to perform a login before using the application. (Ok, technically, you are using the application when you login, but you get my drift.) I worked up a simple demo of this and then extended it to allow for automatic login after you've first successfully authenticated. This could probably be done better, but here's my first draft demo application that will hopefully be useful to others.

<p>
<!--more-->
<p>

I began by creating a new PhoneGap application in Eclipse and included jQuery Mobile. My home page will include my login form and upon successful login I'll simply push the user to the "real" home page. Here's the login screen.

<p>

<pre><code class="language-markup">
&lt;!DOCTYPE HTML&gt;
&lt;html&gt;

&lt;head&gt;
	&lt;meta name="viewport" content="width=320; user-scalable=no" /&gt;
	&lt;meta http-equiv="Content-type" content="text/html; charset=utf-8"&gt;
	&lt;title&gt;Auth Demo&lt;/title&gt;
	&lt;link rel="stylesheet" href="jquery.mobile/jquery.mobile-1.0rc2.css" type="text/css" charset="utf-8" /&gt;
	&lt;script type="text/javascript" src="js/jquery-1.7.min.js"&gt;&lt;/script&gt;
	&lt;script type="text/javascript" charset="utf-8" src="js/phonegap-1.2.0.js"&gt;&lt;/script&gt;
	&lt;script src="jquery.mobile/jquery.mobile-1.0rc2.js"&gt;&lt;/script&gt;
	&lt;script type="text/javascript" charset="utf-8" src="js/main.js"&gt;&lt;/script&gt;
&lt;/head&gt;

&lt;body onload="init()"&gt;
	
&lt;div id="loginPage" data-role="page"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Auth Demo&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	

		&lt;form id="loginForm"&gt;
		&lt;div data-role="fieldcontain" class="ui-hide-label"&gt;
			&lt;label for="username"&gt;Username:&lt;/label&gt;
			&lt;input type="text" name="username" id="username" value="" placeholder="Username" /&gt;
		&lt;/div&gt;

		&lt;div data-role="fieldcontain" class="ui-hide-label"&gt;
			&lt;label for="password"&gt;Password:&lt;/label&gt;
			&lt;input type="password" name="password" id="password" value="" placeholder="Password" /&gt;
		&lt;/div&gt;

		&lt;input type="submit" value="Login" id="submitButton"&gt;
		&lt;/form&gt;
		
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;&copy; Camden Enterprises&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p>

I assume most of my readers are familiar with jQuery Mobile now so I won't discuss the mechanics of it above. That being said, here's a quick screen shot of how this looks.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/device-2011-11-10-090005.png" />

<p>

Ok, now let's switch over to the code. 

<p>

<pre><code class="language-javascript">
function init() {
    document.addEventListener("deviceready", deviceReady, true);
    delete init;
}

function deviceReady() {
 
    $("#loginForm").on("submit",function(e) {
    	//disable the button so we can't resubmit while we wait
    	$("#submitButton",this).attr("disabled","disabled");
        var u = $("#username", this).val();
        var p = $("#password", this).val();
        if(u != '' && p!= '') {
        	$.post("https://www.coldfusionjedi.com/demos/2011/nov/10/service.cfc?method=login&returnformat=json", {% raw %}{username:u,password:p}{% endraw %}, function(res) {
        		if(res == true) {
        			$.mobile.changePage("some.html");
        		} else {
        			navigator.notification.alert("Your login failed", function() {});
        		}
	        	$("#submitButton").removeAttr("disabled");
        	},"json");
        }
        return false;
    });

}
</code></pre>

<p>

I begin with a deviceready listenener. Technically I'm not actually using any of the phone features for this demo, but in general I think this is a good way to start up your application specific code. The code we care about is in the submit handler for my form. All we need to do when run is do an Ajax request to the server. <b>Remember:</b> The restriction on non-same-domain Ajax requests does not exist in a PhoneGap app. If my authentication returns true, I then use jQuery Mobile's changePage feature to shift them over to the page. (Note - my remote service is just returning a boolean. It would probably be more useful to return some data about the user. Their username for example. You get the idea I think.)

<p>

So this works - but let's ramp it up a bit. What I'd like to do is ensure that once you login with the application, you don't have to do it again. This could be optional, but for now I've made it just happen by default. I'm going to modify my code to...

<p>

<ul>
<li>Store my username and password in local storage upon successful login
<li>When the application starts, check for these values, and if they exist, prepopulate the form and submit it automatically
</ul>

<p>

So, my first change was just to store the values. HTML5 local storage to the rescue...

<p>

<pre><code class="language-javascript">
function handleLogin() {
	var form = $("#loginForm");	
	//disable the button so we can't resubmit while we wait
	$("#submitButton",form).attr("disabled","disabled");
	var u = $("#username", form).val();
	var p = $("#password", form).val();
	console.log("click");
	if(u != '' && p!= '') {
		$.post("https://www.coldfusionjedi.com/demos/2011/nov/10/service.cfc?method=login&returnformat=json", {% raw %}{username:u,password:p}{% endraw %}, function(res) {
			if(res == true) {
				//store
				window.localStorage["username"] = u;
				window.localStorage["password"] = p;        			
				$.mobile.changePage("some.html");
			} else {
				navigator.notification.alert("Your login failed", function() {});
			}
	    	$("#submitButton").removeAttr("disabled");
		},"json");
	}
	return false;
}
</code></pre>

<p>

Handling the check on startup was a bit more difficult. I'm still trying to wrap my best way to handle events when working with PhoneGap and jQuery Mobile together. For my case, I wanted to populate the form fields. Therefore it made sense to do this both after the page is loaded and the page is "decorated" by jQuery Mobile. For that I needed the pageinit function. However, it is tricky to get the listener in for this. If I add it to my init function, the one called by body/onload, it's too late. A bit of Googling seems to suggest the best place is in the DOM itself. Here's how my home page looks now.

<p>

<pre><code class="language-markup">
&lt;!DOCTYPE HTML&gt;
&lt;html&gt;

&lt;head&gt;
	&lt;meta name="viewport" content="width=320; user-scalable=no" /&gt;
	&lt;meta http-equiv="Content-type" content="text/html; charset=utf-8"&gt;
	&lt;title&gt;Auth Demo&lt;/title&gt;
	&lt;link rel="stylesheet" href="jquery.mobile/jquery.mobile-1.0rc2.css" type="text/css" charset="utf-8" /&gt;
	&lt;script type="text/javascript" src="js/jquery-1.7.min.js"&gt;&lt;/script&gt;
	&lt;script type="text/javascript" charset="utf-8" src="js/phonegap-1.2.0.js"&gt;&lt;/script&gt;
	&lt;script src="jquery.mobile/jquery.mobile-1.0rc2.js"&gt;&lt;/script&gt;
	&lt;script type="text/javascript" charset="utf-8" src="js/main.js"&gt;&lt;/script&gt;
&lt;/head&gt;

&lt;body onload="init()"&gt;
	
&lt;div id="loginPage" data-role="page"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Auth Demo&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	

		&lt;form id="loginForm"&gt;
		&lt;div data-role="fieldcontain" class="ui-hide-label"&gt;
			&lt;label for="username"&gt;Username:&lt;/label&gt;
			&lt;input type="text" name="username" id="username" value="" placeholder="Username" /&gt;
		&lt;/div&gt;

		&lt;div data-role="fieldcontain" class="ui-hide-label"&gt;
			&lt;label for="password"&gt;Password:&lt;/label&gt;
			&lt;input type="password" name="password" id="password" value="" placeholder="Password" /&gt;
		&lt;/div&gt;

		&lt;input type="submit" value="Login" id="submitButton"&gt;
		&lt;/form&gt;
		
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;&copy; Camden Enterprises&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;

&lt;script&gt;
    $("#loginPage").live("pageinit", function(e) {
		checkPreAuth();
	});
&lt;/script&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p>

And here is my re-engineered main.js file:

<p>

<pre><code class="language-javascript">
function init() {
    document.addEventListener("deviceready", deviceReady, true);
    delete init;
}


function checkPreAuth() {
	var form = $("#loginForm");
	if(window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
		$("#username", form).val(window.localStorage["username"]);
		$("#password", form).val(window.localStorage["password"]);
		handleLogin();
	}
}

function handleLogin() {
	var form = $("#loginForm");	
	//disable the button so we can't resubmit while we wait
	$("#submitButton",form).attr("disabled","disabled");
	var u = $("#username", form).val();
	var p = $("#password", form).val();
	console.log("click");
	if(u != '' && p!= '') {
		$.post("https://www.coldfusionjedi.com/demos/2011/nov/10/service.cfc?method=login&returnformat=json", {% raw %}{username:u,password:p}{% endraw %}, function(res) {
			if(res == true) {
				//store
				window.localStorage["username"] = u;
				window.localStorage["password"] = p;        			
				$.mobile.changePage("some.html");
			} else {
				navigator.notification.alert("Your login failed", function() {});
			}
	    	$("#submitButton").removeAttr("disabled");
		},"json");
	} else {
		//Thanks Igor!
		navigator.notification.alert("You must enter a username and password", function() {});
		$("#submitButton").removeAttr("disabled");
	}
	return false;
}

function deviceReady() {
	
    $("#loginForm").on("submit",handleLogin);

}
</code></pre>

<p>

The code you care about here is checkPreAuth. It basically looks for the existing values, and if there, sets them up in the form and automatically runs the submission. In my tests, this works well. You would probably want to configure the login failed message to handle a case where an auto-login failed. Another issue - and one I do not have a good feel for - is how secure the local storage data will be on the device. <b>Use with caution!</b>