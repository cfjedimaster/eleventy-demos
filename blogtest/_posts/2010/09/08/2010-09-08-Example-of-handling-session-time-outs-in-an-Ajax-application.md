---
layout: post
title: "Example of handling session time outs in an Ajax application"
date: "2010-09-08T14:09:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/09/08/Example-of-handling-session-time-outs-in-an-Ajax-application
guid: 3935
---

Earlier today a user on cf-talk asked about handling session time outs in an Ajax based application. I'm happy he asked this because I'm been worrying about this myself for a while now. One of my applications, <a href="http://lighthousepro.riaforge.org">Lighthouse Pro</a>, makes heavy use of Ajax. The main issue display is entirely Ajax driven. If your session times out though you get... nothing. <b>That sucks.</b> So I used this as an excuse to get off my butt and fix it once and for all. I also whipped up a quick simple example that I'll use for the blog entry. I'd love to get people's opinions on it and start a discussion about how others have solved this issue as well. (I'll also say that there will be a follow up later talking about handling ColdFusion errors in general.)
<!--more-->
<p>

To begin, let's create an incredibly simple application. First, our Application.cfc with a super simple security system.

<p>

<code>
component {
	this.name="ajaxtimeout";
	this.sessionManagement="true";
	this.sessiontimeout=createTimeSpan(0,0,0,31);
	
	public boolean function onRequestStart(string req) {
		if(structKeyExists(form, "login")) {
			session.loggedin = true;
		}
		
		if(!structKeyExists(session, "loggedin") && listlast(arguments.req,"/") != "login.cfm") {
			location(url="login.cfm");
		}
		return true;
	}
	

}
</code>

<p>

As you can see, we use the onRequestStart method to look for a session variable. If it doesn't exist, we push the user to the login page. If we see the login key in the form scope, we mark the user as logged in. (This is normally where you would actually check the username and password.) Now let's look at our Ajax "application."

<p>

<code>

&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$("#testLink").click(function(e) {
		$("#showResult").load("rand.cfm");
		e.preventDefault();
	});
})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;


Click the link to perform an Ajax request to load a random number: &lt;a href="" id="testLink"&gt;Click Me, Baby&lt;/a&gt;

&lt;p&gt;

&lt;div id="showResult"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Woot. That's no GMail for sure. The so-called application has one link. When you click on it I'm going to load the contents of rand.cfm into the div. rand.cfm simply outputs a random number so I won't bother showing the code for that. So you may have noticed that my session timeout was extremely small. If you run this code as is, login (you can enter anything or nothing), and then let the app site for a bit over half a minute, you will see that clicking the link returns the login form to the user. In a more complex Ajax app where JSON was requested, the login form wouldn't be valid JSON so nothing at all would happen. (As with Lighthouse Pro.) Here is an example:

<p>

<img src="https://static.raymondcamden.com/images/screen.png" />

<p>

So, let's talk about how we can handle this. Currently our security logic is that if you are not logged in, we push you to a new CFM. That works fine for normal requests, but for an Ajax request we should handle it differently. We could simply output a string, like "SessionTimeout", but then we would need to update our jQuery code to look for that particular string. Instead, why not simply throw an error that we can listen for? Let's look at an example of that first:

<p>

<code>
public boolean function onRequestStart(string req) {
	if(structKeyExists(form, "login")) {
		session.loggedin = true;
	}
		
	if(!structKeyExists(session, "loggedin") && listlast(arguments.req,"/") != "login.cfm") {
		//for ajax requests, throw an error
		var reqData = getHTTPRequestData();
		if(structKeyExists(reqData.headers,"X-Requested-With") && reqData.headers["X-Requested-With"] eq "XMLHttpRequest") throw(message="SessionTimeout");
		else location(url="login.cfm");
	}
	return true;
}
</code>

<p>

I've modified onRequestStart to look for a Ajax request. This is done by looking at the HTTP Request Data. It isn't perfect but should work well for 99.99% of your clients. If the request is an Ajax one, I'm throwing an exception with a particular message. Otherwise we simply do the default location.

<p>

Luckily, jQuery provides an excellent way to handle errors across all Ajax requests in a page. The ajaxSetup method can be used to handle errors. Mahesh Chari has a great blog post on the topic: <a href="http://www.maheshchari.com/jquery-ajax-error-handling/">How to handle ajax errors using jQuery ?</a> I used his example, modified, to look for a particular type of error we are going to work with in a bit.

<p>

<code>
&lt;script&gt;
$(document).ready(function() {

	$.ajaxSetup({
		error:function(x,e){
			if(x.status == 500 && x.statusText == "SessionTimeout") {
				alert("Your session has timed out.");
				location.href = 'login.cfm';
			}
		}
	});

	$("#testLink").click(function(e) {
		$("#showResult").load("rand.cfm");
		e.preventDefault();
	});
})
&lt;/script&gt;
</code>

<p>

I love this code for a few reasons. First, notice that my original code is <b>not changed</b>. It's logic is the exact same. Instead, I added an error handler at the page level. It then can worry about handling errors whereas my other function can stay simple. How you handle this error is obviously up to you, but I decided to use the alert function to let the user know about the issue and then I push them to the login. Obviously it could be done a bit snazzier. 

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/screen1.png" />

<p>

Woot! Everything is perfect. Almost... You may be wondering - what happens if you have an error handler for your site? (Sorry - I said "if", everyone has an error handler for their site.) Well, that makes things... interesting. Consider the following onError:

<p>

<code>
public void function onError(exception,eventname) {
		writelog(file='application', text='my onerror ran');
}
</code>

<p>

This is a fairly simple, and useless, error handler. Normally you would want to tell the user something, but for now, it at least hides the default ColdFusion errors from returning to the screen. But now we are intentionally throwing an error - so what do we do? We end up then needing to actually rethrow the error. CFScript doesn't support rethrow, so it is a bit more wordier in the script version, but here is what I used:

<p>

<code>
public void function onError(exception,eventname) {
	if(arguments.exception.rootcause.message == "SessionTimeout") throw(message=arguments.exception.rootcause.message);
	writelog(file='application', text='my onerror ran: #serializejson(arguments.exception.rootcause.message)#');
}
</code>

<p>

Basically - look at the exception - and if you see that it was my Ajax-specific timeout, recreate it and let it leak out to the response. 

<p>

Comments? As a quick note - you may wonder - what about <b>normal</b> ColdFusion errors? How would you handle that in an Ajax-based application. I'm going to talk about that next.