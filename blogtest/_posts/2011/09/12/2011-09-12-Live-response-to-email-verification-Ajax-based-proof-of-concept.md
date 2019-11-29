---
layout: post
title: "Live response to email verification - Ajax based proof of concept"
date: "2011-09-12T22:09:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2011/09/12/Live-response-to-email-verification-Ajax-based-proof-of-concept
guid: 4361
---

Tonight I'm going to demonstrate my version of an interesting technique now I've seen on a few sites - the live handling of email verification. I don't think that really describes the issue well, but let try to explain what I'm talking about to see if it makes more sense. Imagine a simple registration form that asks for a few details including an email address.
<!--more-->
<p/>

<img src="https://static.raymondcamden.com/images/shot11.png" />

<p/>

If you include a bad email address, we can display a nice error:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/shot21.png" />

<p/>

If you enter a good email address, we can fire off the email verification system via an Ajax operation.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/shot3.png" />

<p/>

Which then sends you an email:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip179.png" />

<p/>

Now here comes the cool part. Clicking the link opens up a new tab with a simple verification message, but the <i>original</i> tab automatically notices this. Without any action on the user's part, the page just magically knows that the verification is done.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/shot4.png" />

<p>

It's a cool technique and one I wanted to build myself. Here's what I came up with. The front end isn't terribly big so I'll include the entire template.

<p/>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="jqueryui/js/jquery-ui-1.8.16.custom.min.js"&gt;&lt;/script&gt;
&lt;link rel="stylesheet" href="jqueryui/css/vader/jquery-ui-1.8.16.custom.css" type="text/css" /&gt;

&lt;script&gt;
$(document).ready(function() {
	
	function checkVerification(){
		var email = $.trim($("#email").val())
		if(email == '') return;
		$.post("service.cfc?returnFormat=json&method=checkVerificationStatus", {% raw %}{"email":email}{% endraw %}, function(res,code) {
			if (res == "true") {
				$("#dialogSentVerification").dialog("close");
				$("#dialogVerified").dialog({
					modal:true, 
					buttons: {
						"Continue": function() {
							$( this ).dialog( "close" );
							document.location.href='test2.cfm';
						}
					}
				});
				clearInterval(checkVerification);
			}
		});
	}
	
	//Listen for the email submit
	$("#btnSubmit").click(function() {
		var email = $.trim($("#email").val())
		if(email == '') return;
		//make the post to the server so we can fire off the response
		$.post("service.cfc?returnformat=json&method=sendVerificationEmail", {% raw %}{"email":email}{% endraw %}, function(res,code) {
			//show the error
			if (res == "false") {
				$("#dialogError").dialog({
					modal: true
				});
			}
			else {
				$("#dialogSentVerification").dialog({
					modal:true
				});
				//set an interval to check for verification
				setInterval(checkVerification, 1000);
			}
			console.log(res);
			
		});
	});
	
});

&lt;/script&gt;

&lt;/head&gt;

&lt;body&gt;

&lt;div id="emailVerificationFormDiv"&gt;
&lt;form method="post"&gt;
&lt;b&gt;Enter your email address for the test:&lt;/b&gt; &lt;input type="text" id="email" name="email"&gt; &lt;input id="btnSubmit" type="button" value="Verify"&gt;
&lt;/form&gt;
&lt;/div&gt;

&lt;div id="dialogSentVerification" title="Verification Email Sent!" style="display:none"&gt;
	&lt;p&gt;
		Good news. We've sent you an email verification. When you click the link there, we
		can get down to business. And we all want to get to business time.
	&lt;/p&gt;
&lt;/div&gt;

&lt;div id="dialogError" title="Error" style="display: none;"&gt;
	&lt;p&gt;Either you used a bad email address, or you used one we already know. A better demo would support either.&lt;/p&gt;
&lt;/div&gt;

&lt;div id="dialogVerified" title="Email Verified!" style="display:none"&gt;
	&lt;p&gt;
		You verified the email. You rock. Let's carry on...
	&lt;/p&gt;
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

You can see two main functions in play here. The click handler for btnSubmit handles click actions on the button. It's going to send the email address to the server to either report an error or kick off the verification process. Both of these are displayed to the user using jQuery UI dialogs.

<p>

Once the verification process is started, note we then begin an interval that runs checkVerification. This performs an Ajax request every second to ask the server if we've verified the email address. If so, we open up a dialog to tell the user and even provide a button to take them to the next step.

<p>

The back end for this code is also a bit simpler, but mostly because I faked it. So for example, here is my service.cfc.

<p>

<code>
component {

	remote boolean function sendVerificationEmail(required string email) {
		//So the logic here could be verified. Are we checking if this is a known email address? 
		//But for now, we will keep things simple. If syntax is right, its good, return 1. Otherwise
		//return 0.
		
		if(!isValid("email", arguments.email)) return false;

		//store my key in the session scope
		session.mykey = createUUID();
		
		//verification email is sent to user with a special key he has to click. Normally this 
		//would be more complex. We would perhaps store the key so we can confirm the right person
		//clicked it. But for our demo, we don't care. So we will just make the link random and include
		//the email addy itself.
		var link = "http://localhost/testingzone/emailverificationdemo/verify.cfm?email=#urlEncodedFormat(arguments.email)#&key=#session.myKey#";
		
		var emailContent = "";
		savecontent variable="emailContent" {
			include "_mail.cfm";
		}
		
		var m = new com.adobe.coldfusion.mail();        
        m.setTo(arguments.email);        
		m.setFrom("admin@oursite.com");
		m.setSubject("Email Verification");
		m.setBody(emailContent);
		m.send();
		
		return true;
        
		
	}
	
	remote boolean function checkVerificationStatus(required string email) {
		//This would normally be db driven
		return structKeyExists(application.verifiedEmails, arguments.email);
	}

}
</code>

<p>

As you can see, I'm not doing any real database calls but instead just assume everything is kosher. The checkVerificationStatus method is just checking an Application scoped variable. This is set via the verify.cfm button in verify.cfm. 

<p>

<code>
&lt;cfparam name="url.email" default=""&gt;
&lt;cfparam name="url.key" default=""&gt;

&lt;!--- simple validation of the paremters ---&gt;
&lt;cfif not len(url.email) or not isValid("email", url.email) or not len(url.key)&gt;
	&lt;cfabort/&gt;
&lt;/cfif&gt;

&lt;!---
So here is where we verify the email and the key - for now we just assume it's good.
Our service.cfc handles the front end asking for an email to be valid. Since we aren't using
a database, we use an Application scope map to simply store good email addresses.
---&gt;

&lt;cfset application.verifiedEmails[url.email] = 1&gt;
</code>


<p>

Again - this is all fake. You would have a bit more code on your server to really make use of this technique, but the front end works pretty cool. In my testing it was so quick I had to move the tab to another monitor so I could see it happen. I've included a zip of the entire folder, but won't be setting up a live demo as I don't want folks to use it for spamming.

<p>

Any comments on this technique?<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Femailverificationdemo%{% endraw %}2Ezip'>Download attached file.</a></p>