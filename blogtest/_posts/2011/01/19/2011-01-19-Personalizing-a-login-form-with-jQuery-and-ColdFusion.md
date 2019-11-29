---
layout: post
title: "Personalizing a login form with jQuery and ColdFusion"
date: "2011-01-19T12:01:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/01/19/Personalizing-a-login-form-with-jQuery-and-ColdFusion
guid: 4086
---

So - I'm still not 100% sure what <a href="http://www.quora.com/">Quora</a> is and why I would use it. It looks like a generic version of <a href="http://www.stackoverflow.com">StackOverflow</a> which could be cool. Right now my take is that it's "The site I keep hearing people talk about but I find impossible to spell." That being said I went to login this morning and noticed something I thought was <i>really</i> cool. Check out this screen shot.
<!--more-->
<p>

<img src="https://static.raymondcamden.com/images/ScreenClip13.png" />

<p>

I think that's pretty cool! Now - it may also be viewed as something of a privacy issue. I tried a few friend's email addresses and for it showed me their profile pics. I wasn't able to login as them - and - to be honest - I already knew what they looked like anyway - but it may be something that upsets some people. All I know is I saw it and wanted to recreate it as a proof of concept. Here's what I whipped up. I'm going to start on the server side. I didn't want to hook up to a <i>real</i> login system so all I did was return the gravatar URL for the email and a static name.

<p>

<code>
component {

	remote struct function checkemail(string email) {
		//look up to see if the user exists
		//if true (and it's always true for us), return profile image
		//for us this will be gravatar and return their name
		var result = {};
		if(isValid("email", arguments.email)) {
			result.name = "John Smith";
			result.profileimage = "http://www.gravatar.com/avatar/#lcase(hash(arguments.email))#?s=64";
		}
		return result;
	}
	
}
</code>

<p>

Nothing here should be too complex. If it's a valid email I return a struct of data, otherwise I just return an empty structure. The front end is a bit more interesting.

<p>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$("#email").blur(function() {
		var value = $(this).val();
		if(value.length==0) return;
		$.post("test.cfc?method=checkemail&returnFormat=json", {% raw %}{"email":value}{% endraw %}, function(res,code) {
			if(res.PROFILEIMAGE && res.NAME) {
				var s = "&lt;img src=\"" + res.PROFILEIMAGE + "\"&gt;&lt;br/&gt;"+res.NAME;
				$("#picSample").html(s);
			}
		}, "json");
	});
})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;form&gt;
&lt;table&gt;
	&lt;tr&gt;
		&lt;td&gt;email:&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="email" id="email"&gt;&lt;/td&gt;
		&lt;td rowspan="2"&gt;&lt;div id="picSample"&gt;&lt;/div&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;password:&lt;/td&gt;
		&lt;td&gt;&lt;input type="password" name="password"&gt;&lt;/td&gt;
	&lt;/tr&gt;
&lt;/table&gt;
&lt;/form&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Ok, first off, I apologize for the table. Sorry - until I can layout stuff that easy and that quick with CSS without having to look it up - I'm going to stick with tables. Just call me old and cranky. While you are laughing at my horrible design skills though take note of the email field and the div to the right of it. This is where we're going to display the user info. Now go up to the jQuery code.

<p>

I've got a blur listener on the on the email field. When it's fired, we run a POST request against the CFC above. When the result returns we see if we got data and if so, create a simple HTML string out of it. You can view the demo below.

<p>

<a href="http://www.coldfusionjedi.com/demos/jan192011/test.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>