---
layout: post
title: "Spry's Password Validation"
date: "2007-10-21T16:10:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2007/10/21/Sprys-Password-Validation
guid: 2427
---

Yesterday I <a href="http://www.raymondcamden.com/index.cfm/2007/10/20/Playing-with-form-validation-in-Spry">blogged</a>  about my initial look into Spry's form validation widgets. I began with the checkbox validation class. Today I looked at password field validation. As before, the widget is employed by loading in a JavaScript and CSS file, surrounding the form field with a span, and then lastly enabling the widget with a line of JavaScript code. Let's look at a very simple example of this:
<!--more-->
<code>
&lt;html&gt;

&lt;head&gt;	
&lt;script src="/spryjs/SpryValidationPassword.js" type="text/javascript"&gt;&lt;/script&gt;
&lt;link href="/sprycss/SpryValidationPassword.css" rel="stylesheet" type="text/css" /&gt; 
&lt;/head&gt;

&lt;body&gt;
	
&lt;form&gt;
&lt;span id="mypassword"&gt;	
Password: &lt;input type="password" name="password"&gt;
&lt;span class="passwordRequiredMsg"&gt;You must specify a password.&lt;/span&gt;
&lt;/span&gt;
&lt;input type="submit"&gt;
&lt;/form&gt;

&lt;script type="text/javascript"&gt;
	var spryp = new Spry.Widget.ValidationPassword("mypassword");
&lt;/script&gt; 

&lt;/body&gt;
&lt;/html&gt;
</code>

Since this is very similar to yesterday's blog post, I won't describe every line, but you can see where I have surrounded my password and then created a new instance of Spry.Widget.ValidationPassword. You can see an example of this <a href="http://www.coldfusionjedi.com/demos/spryform/testp.html?">here</a>. Note as with the previous example, the error message within the span class is hidden on load. I can modify the look and feel of the error if I need to, but for now have left it with the default. 

While this is nice and all - where things get interesting is the validation specifics we can apply to the widget. You can:

<ul>
<li>Specify both a min and max number of characters for the password.
<li>Specify both a min and max number of letters for the password.
<li>Specify both a min and a max number of numbers for the password.
<li>Specify both a min and max number of upper case letters for the password.
<li>Specify both a min and max number of "special" characters for the password. (The docs don't detail what special is, but I assume they mean non-numeric, non-letter characters.
</ul>

So here is one more example where the validaiton is more stringent:

<code>
&lt;html&gt;

&lt;head&gt;	
&lt;script src="/spryjs/SpryValidationPassword.js" type="text/javascript"&gt;&lt;/script&gt;
&lt;link href="/sprycss/SpryValidationPassword.css" rel="stylesheet" type="text/css" /&gt; 
&lt;/head&gt;

&lt;body&gt;
	
&lt;form&gt;
&lt;span id="mypassword"&gt;	
Password: &lt;input type="password" name="password"&gt;
&lt;span class="passwordRequiredMsg"&gt;You must specify a password.&lt;/span&gt;
&lt;span class="passwordMinCharsMsg"&gt;You must specify at least 6 characters.&lt;/span&gt;
&lt;span class="passwordInvalidStrengthMsg"&gt;You must use at least 2 numbers and 2 uppercase characters in your password.&lt;/span&gt;
&lt;/span&gt;
&lt;input type="submit"&gt;
&lt;/form&gt;

&lt;script type="text/javascript"&gt;
	var spryp = new Spry.Widget.ValidationPassword("mypassword",
		{% raw %}{minChars:6,minNumbers:2,minUpperAlphaChars:2}{% endraw %}
	);
&lt;/script&gt; 

&lt;/body&gt;
&lt;/html&gt;
</code>

Skip down to the end first. Note that I've added 3 options to the validation widget. I've specified that there must be at least 6 characters - there must be at least two numbers - and finally - there must be two upper case characters.

In order for these rules to work though I need to specify a few new spans for the error messages. The passwordMinChars message is obviously used to cover the case where not enough characters were specified. For all the rules that cover the <i>type</i> of characters required, you use the passwordInvalidStrengthMsg class. A demo of this file may be found <a href="http://www.coldfusionjedi.com/demos/spryform/testp2.html">here</a>.

Finally - the complete docs for this feature may be found <a href="http://labs.adobe.com/technologies/spry/articles/password_overview/index.html">here</a>.