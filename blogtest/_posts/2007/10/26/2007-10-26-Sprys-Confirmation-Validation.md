---
layout: post
title: "Spry's Confirmation Validation"
date: "2007-10-26T22:10:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/10/26/Sprys-Confirmation-Validation
guid: 2437
---

A few days ago I blogged about <a href="http://www.raymondcamden.com/index.cfm/2007/10/21/Sprys-Password-Validation">Spry's password validation</a>. It is an impressive little widget giving you nice control over how strong your password needs to be. Today I'm going to demonstrate the confirmation widget.
<!--more-->
As you can guess - this is simply a widget that will enforce validation of a password. This widget can either work with a simple password field, or with <a href="http://labs.adobe.com/technologies/spry/articles/password_overview/index.html">Spry's password wdiget</a>. Since I assume most folks will want to use both, my example will follow that format. As with the other widgets I covered - you include a JavaScript and CSS file:

<code>
&lt;script src="/spryjs/SpryValidationConfirm.js" type="text/javascript"&gt;&lt;/script&gt;
&lt;link href="/sprycss/SpryValidationConfirm.css" rel="stylesheet" type="text/css" /&gt; 
</code>

Then you create a span that will include your confirmation field along with the errors:

<code>
&lt;span id="myconfirm"&gt;
Confirm Password: &lt;input type="password" name="password2"&gt;&lt;br /&gt;	
&lt;span class="confirmRequiredMsg"&gt;You must confirm the password, bozo.&lt;/span&gt;
&lt;span class="confirmInvalidMsg"&gt;Your confirmation password didn't match, idiot.&lt;/span&gt;
&lt;/span&gt;
</code>

And lastly you create a JavaScript variable that enables the validation:

<code>
var spryconfirm = new Spry.Widget.ValidationConfirm("myconfirm", "password");
</code>

Two things to note here. The first value is the ID of the confirmation span. The second value is the ID of the form field you are validating. Even though I'm using a Spry widget, I need to point to the field's ID value, not the span around it. As you can guess - the confirmRequiredMsg will be fired when the user doesn't enter anything, while the confirmInvalidMsg will fire if the passwords don't match at all. 

Taking the last example from the previous post, here is a file that does both strict password checking as well as validation checking:

<code>
&lt;html&gt;

&lt;head&gt;	
&lt;script src="/spryjs/SpryValidationPassword.js" type="text/javascript"&gt;&lt;/script&gt;
&lt;link href="/sprycss/SpryValidationPassword.css" rel="stylesheet" type="text/css" /&gt; 
&lt;script src="/spryjs/SpryValidationConfirm.js" type="text/javascript"&gt;&lt;/script&gt;
&lt;link href="/sprycss/SpryValidationConfirm.css" rel="stylesheet" type="text/css" /&gt; 

&lt;/head&gt;

&lt;body&gt;
	
&lt;form&gt;
&lt;span id="mypassword"&gt;	
Password: &lt;input type="password" name="password" id="password"&gt;&lt;br /&gt;
&lt;span class="passwordRequiredMsg"&gt;You must specify a password.&lt;br /&gt;&lt;/span&gt;
&lt;span class="passwordMinCharsMsg"&gt;You must specify at least 6 characters.&lt;br /&gt;&lt;/span&gt;
&lt;span class="passwordInvalidStrengthMsg"&gt;You must use at least 2 numbers and 2 uppercase characters in your password.&lt;br /&gt;&lt;/span&gt;
&lt;/span&gt;
&lt;span id="myconfirm"&gt;
Confirm Password: &lt;input type="password" name="password2"&gt;&lt;br /&gt;	
&lt;span class="confirmRequiredMsg"&gt;You must confirm the password, bozo.&lt;/span&gt;
&lt;span class="confirmInvalidMsg"&gt;Your confirmation password didn't match, idiot.&lt;/span&gt;
&lt;/span&gt;

&lt;input type="submit"&gt;
&lt;/form&gt;

&lt;script type="text/javascript"&gt;
	var spryp = new Spry.Widget.ValidationPassword("mypassword",
		{% raw %}{minChars:6,minNumbers:2,minUpperAlphaChars:2}{% endraw %}
	);
	var spryconfirm = new Spry.Widget.ValidationConfirm("myconfirm", "password");
&lt;/script&gt; 

&lt;/body&gt;
&lt;/html&gt;
</code>

You can find an online demo of this <a href="http://www.coldfusionjedi.com/demos/spryform/testc.html">here</a> as well as the full docs <a href="http://labs.adobe.com/technologies/spry/articles/confirm_overview/index.html">here</a>.