---
layout: post
title: "Simple jQuery/ColdFusion form example"
date: "2010-05-08T19:05:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/05/08/Simple-jQueryColdFusion-form-example
guid: 3811
---

Last week I <a href="http://www.raymondcamden.com/index.cfm/2010/5/1/Simple-jQueryColdFusion-data-loading-example">blogged</a> a very simple example of jQuery to ColdFusion communication. At the request of a reader I created the simplest example I could come up with that demonstrated the basic concepts. Today I have a slightly more advanced example, one that specifically makes use of a form and a post operation.
<!--more-->
<p>

My example is a very simple authentication system. The form has a username and password field. We want to integrate with a ColdFusion Component that will handle responding to the post from jQuery. Let's begin with the front end template. 

<p>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	//grab the submit action
	$("#loginForm").submit(function(e) {

		//stop the form submission
		e.preventDefault()

		//get my values
		var uval = $("#username").val()
		var pval = $("#password").val()

		//basic validation
		if(uval == '' || pval == '') return

		//disable the button
		$("#loginButton").attr("disabled",true)

		//Let the user know we are doing something		
		$("#result").html("Logging in...")
		
		//Send them to the CFC
		$.post("test.cfc?method=authenticate&returnformat=json", 
				{% raw %}{username:uval, password:pval}{% endraw %},
				function(res) {
					//Handle the result
					if(res == "true") {
						$("#result").html("Your login worked.")
						//Do more here.
					} else {
						$("#result").html("Your login failed.")
						$("#loginButton").removeAttr("disabled")
					}
				})

	})
})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;form id="loginForm"&gt;
	username: &lt;input type="text" name="username" id="username"&gt;&lt;br/&gt;
	password: &lt;input type="password" name="password" id="password"&gt;&lt;br/&gt;
	&lt;input type="submit" value="Login" id="loginButton"&gt;
&lt;/form&gt;

&lt;div id="result"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Ok, we've got a few things to cover here. I'll begin with the HTML at the bottom. You can see my simple form (2 text fields and a submit button). Also notice the little "result" div at the bottom. I'll be using that later to provide feedback to the user. 

<p>

Ok, now scroll up to the JavaScript. The meat of this template is all within one main event handler defined here:

<p>

<code>
$("#loginForm").submit(function(e) {
</code>

<p>

This is going to "take over" the normal form submission and let me do something else with it. Notice too that the very first command within the handler is: e.preventDefault(). This will ensure that my form never does actually submit (if the user has JavaScript enabled of course). Moving down, I grab the value from my two fields. I do this manually but jQuery does provide a few ways of serializing a form all at once. Once I've got that, I do some very simple validation. If either field is blank we leave the function. 

<p>

Next up I disable the submit button. Remember that we're going to be doing an Ajax post, a network operation, and that isn't instantaneous. Disabling the submit button is an easy way to prevent a user from going click happy. We <i>also</i> add a status message so that the user knows something is going on.

<p>

The portion that actually performs the Ajax based request begins with $.post. We provide the URL first. Remember that you must pass the method to execute within the CFC. That's the method=authenticate part. You can - and normally should - provide a returnFormat argument as well to tell ColdFusion how to format the response. The second argument is a structure of data. These will be sent as POST fields to the CFC. Lastly we have a response handler. This is going to execute when the CFC returns a result to us. For our simple example we are assuming a string result of "true" or "false". Obviously there may be more complex results. In a longer form, you may have a set of error messages. In the result we either provide a "good" message or a "bad" message. As you can see in the comments, you would probably do a bit more on a good result. You may want to hide the form for example. Or you may actually push the user to another URL. 

<p>

Now let's take a look at the CFC:

<p>

<code>
component {

	remote boolean function authenticate(string username, string password) {
		sleep(1400);
		if(arguments.username == "paris" && arguments.password == "hilton") return true;
		return false;
	}

}
</code>

<p>

Yeah, I love me some script-based CFCs. So as you can imagine, this would probably be replaced with a query call or perhaps LDAP. But that doesn't really matter here. I added a sleep command in there to help simulate a slow network. To see this yourself, click the big new fancy Demo button below.

<p>

<a href="http://www.coldfusionjedi.com/demos/may82010/test.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo" border="0"></a>