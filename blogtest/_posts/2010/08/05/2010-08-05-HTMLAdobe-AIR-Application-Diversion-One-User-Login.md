---
layout: post
title: "HTML/Adobe AIR Application Diversion One - User Login"
date: "2010-08-05T19:08:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/08/05/HTMLAdobe-AIR-Application-Diversion-One-User-Login
guid: 3899
---

I've got a couple of entries going so far in my HTML/Adobe AIR series. I'm taking a step "out" of that course to address some questions I've gotten recently via IM. (Hence the 'Diversion' title above.) Today's question deals with handling server based authentication. In other words, how do you build a client side application that authenticates against some central server? Before I get started - let me send a quick shout out to <a href="http://www.12robots.com">Jason Dean</a> and <a href="http://www.andymatthews.net/">Andy Matthews</a> for helping me get this together.
<!--more-->
<p>

Ok, so before we get started - let's cover a few important things. I've yet to talk about network calls and Adobe AIR applications. I still plan to and have a few cool demos - but for now the important thing to know is that an AIR application can easily request data from remote domains. So while this would be a problem in a normal web app:

<p>

<code>
$.get("http://www.remotesomethingoranother.com/some.cfc?method=bringthefunk")
</code>

<p>

In Adobe AIR it works just fine. So right away, we now know that we can build a CFC to handle logins and other secured functions on some central server and our AIR applications will have no problems hitting it.

<p>

The second problem we have is handling the authentication <i>after</i> you have logged in. You aren't "on" the server - you are running a client side application. Sessions can't work, right? Well it turns out that your Ajax requests from your AIR application will easily accept ColdFusion's (or any other platform) session cookies. (Jason has an <a href="http://www.12robots.com/index.cfm/2009/9/22/AIR-Tip-Cookie-Sharing">article</a> that talks about this more in depth.) So that is no longer a problem. Enough chatter, let's look at some code.

<p>

I'm going to begin with my server code. In this example I'll keep it very simple. I've got a ColdFusion site that has one CFC. This CFC has a login method and a random number generator:

<p>

<code>
component {

	remote boolean function login(string username, string password) {
		if(arguments.username == "admin" && arguments.password == "password") {
			session.loggedin = true;
			return true;
		} else return false;
	}

	remote numeric function randomNumber() {
		return randRange(1,10000);
	}
	
}
</code>

<p>

In front of this I have an Application.cfc file that will handle my security. To be clear - this is one way of handling it. My service CFC above could also handle it within itself.

<p>

<code>
component {
	this.name="authtest";
	this.sessionManagement="true";
	this.sessiontimeout = createTimeSpan(0,0,1,30);
	
	public any function onCFCRequest(string cfcname, string method, struct args) {
		if(!structKeyExists(session, "loggedin") and arguments.method is not "login") throw("NotAuthorized");
		var comp = createObject("component", arguments.cfcname);
		var result = evaluate("comp.#arguments.method#(argumentCollection=arguments.args)");
		if(!isNull(result)) return result;
	}

}
</code>

<p>

So this component only has one method defined: onCFCRequest. This will handle all CFC requests to the application. I begin with a security check. If the session variable, "loggedin" doesn't exist, I'm going to throw an error if they currently aren't trying to login. After this, I create an instance of the CFC and run the method. Using onCFCRequest means you have to be a bit more manual with your CFC requests. The basic gist of this is - if you try to run <b>any</b> CFC method and aren't authorized, you will get an error unless you are trying to login. I want to repeat - there are many other ways you could do this. Consider this just one simple example.

<p>

Alright - so we've got our server setup. What's next? Well the front end client of course. This isn't a huge file so I'll paste in the entire thing. I'll then go over the bits and explain what's happening where.

<p>

<code>

&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;New Adobe AIR Project&lt;/title&gt;
        &lt;script type="text/javascript" src="lib/air/AIRAliases.js"&gt;&lt;/script&gt;
        &lt;script src="lib/jquery/jquery-1.4.2.min.js"&gt;&lt;/script&gt;
		&lt;script&gt;
		var serviceURL = "http://127.0.0.1/testingzone/authtest/service.cfc?returnFormat=json";
		
		$(document).ready(function() {
		
			//set up login div
			$("#loginDiv").show();
			
			$("#loginButton").click(function() {
				var u = $("#username").val();
				var p = $("#password").val();
				//normally you would validate here
				$.post(serviceURL, {% raw %}{"method":"login","username":u,"password":p}{% endraw %}, function(res,status) {
					res = $.trim(res);
					if(res == 'false') {
						$("#result").html("&lt;b&gt;Your credentials did not pass. Use admin for username and password for password.&lt;/b&gt;");
					} else {
						$("#loginDiv").hide();
						$("#mainApp").show();
					}
				});
				
			});
			
			$("#getRandomButton").click(function() {
				$.get(serviceURL, {% raw %}{"method":"randomNumber"}{% endraw %}, function(res,status) {
					res = $.trim(res);
					$("#randomResult").html("&lt;b&gt;Your random number is "+res + "&lt;/b&gt;");
				});				
			});

		});
		&lt;/script&gt;
    &lt;/head&gt;
    &lt;body&gt;

	&lt;!-- Login Panel --&gt;	
	&lt;div id="loginDiv" style="display:none"&gt;
		&lt;div id="result"&gt;&lt;/div&gt;
		Before you use the app, you must login.
		&lt;form id="loginForm"&gt;
		username: &lt;input type="text" id="username" value="admin"&gt;&lt;br/&gt;
		password: &lt;input type="password" id="password" value="password"&gt;&lt;br/&gt;
		&lt;input type="button" value="Login" id="loginButton"&gt;
	&lt;/form&gt;
	&lt;/div&gt;
	
	
	&lt;!-- Main App --&gt;
	&lt;div id="mainApp" style="display:none"&gt;
	&lt;h2&gt;Random CF Number Generator&lt;/h2&gt;
	Click the button to get a random number: &lt;input type="button" id="getRandomButton" value="Get Random!"&gt;
	&lt;div id="randomResult"&gt;&lt;/div&gt;
	&lt;/div&gt;

    &lt;/body&gt;	
&lt;/html&gt;
</code>

<p>

Let's start at the bottom. My application has two views. A login view and a 'Get a random number' view. I'm not quite sure what the best way to handle this so far. For this application I simply hid them both and will use visibility to enable the views. I plan to come back to this later with a more intelligent solution. Scroll on up a bit to the document.ready block. We begin by showing the login div. In theory it's possible that when you start this application, you have an existing session on the server. But we are going to always force you to login. Notice my loginButton handler. It picks up the username/password values and then sends it to my CFC defined above. If the value is bad - tell the user. If good - hide the login div and show the main application div.

<p>

Finally - I've got a simple handler for the random number generator. On click I fire off the request and display the response. Here is the beautiful app in action.

<p>

<img src="https://static.raymondcamden.com/images/capture11.PNG" />

<p>


<img src="https://static.raymondcamden.com/images/cfjedi/capture21.PNG" />

<p>

Sexy, isn't it? This is why my job never lets me do design work. Ok, so this works - but - what happens when the session times out? If you look at my Application.cfc above you can see that I've got a real short timeout. Unfortunately, right now my code does... nothing! The error isn't handled in my code so the user never gets a response and has no idea that something has gone wrong. Luckily jQuery makes this pretty simple for us. We can register an error handler for the individual data call we are doing. We can also register a global error for Ajax issues. I chose a global handler. We could argue which is better - and to be honest - I think probably the more specific one. But for now, let's keep this simple. Here is the handler I added:

<p>

<code>
$.ajaxSetup({
		error: function(x,e){
			//for now, assume error was a login error
			$("#mainApp").hide();
			$("#loginDiv").show();
			alert("I'm sorry, but your authentication has timed out.\nPlease login again.");
		}
	});
</code>

<p>

Right now the handler is a bit dumb. It assumes <i>any</i> error is an authorization error. Again though I wanted to keep things simple. Here is an example of the error being handled:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/capture31.PNG" />

<p>

And that's basically it. I've included the entire HTML below. You can download the AIR application as well and hit it. It will run against my own server so be sure to click the frack out of that button. 

<p>

I want to make one quick point. You may notice I'm sending my username and password over the air. (Heh, get it, air?) That's bad. This application could fix that by simply calling an HTTPS URL instead of an insecure HTTP URL. Obviously for a demo it works, but, keep it in mind if you go forward with a real application. (And again I'll push folks to Jason Dean. He's done multiple presentations on security and AIR applications. Check em out. He doesn't bite. Normally.)<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fauthtest%{% endraw %}2Eair'>Download attached file.</a></p>