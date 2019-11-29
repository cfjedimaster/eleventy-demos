---
layout: post
title: "Cordova Example - Sending SMS Messages"
date: "2014-12-11T10:47:08+06:00"
categories: [development,javascript,mobile]
tags: []
banner_image: 
permalink: /2014/12/11/cordova-example-sending-sms-messages
guid: 5437
---

<div class="note">
Since the time I wrote this article, the plugin I used does not exist anymore. It is somewhat related to the plugin cordova-plugin-sms, but that plugin is Android only. You probably want to use cordova-sms-plugin. Note the different. This plugin has a slightly different API. You can read more about it here: <a href="https://github.com/cordova-sms/cordova-sms-plugin">https://github.com/cordova-sms/cordova-sms-plugin</a>. I have updated my demo code in the GitHub repo linked at the bottom and it works for me, but the main text of this blog post has not been updated to reflect the new plugin and code. 
</div>

Yesterday a reader contacted me asking for help sending SMS messages from a PhoneGap/Cordova application. I've made use of a nice plugin for this before so I thought I'd whip up a quick example of it for him, and my readers.

<!--more-->

The plugin I used is <a href="http://plugins.cordova.io/#/package/com.jsmobile.plugins.sms">Sms Custom Cordova Plugin</a> - not the most imaginative name but really darn simple to use. It has one method, sendMessage, that - wait for it - will send a SMS message. On Android this is done <strong>completely</strong> behind the scenes. In other words, it will send a SMS message without letting the user know. Obviously you shouldn't do that, but keep that in mind. On iOS and Windows it will actually open the SMS application so the user has to actually finish the process themselves. Let's look at a simple example. As with my other Cordova examples, this is all up on GitHub for you to play with.

First, the HTML. This application does one thing - prompt for a telephone number and message. To make it a tiny bit prettier I added <a href="http://goratchet.com">Ratchet</a>.

<pre><code class="language-markup">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge,chrome=1&quot;&gt;
		&lt;title&gt;&lt;/title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
        &lt;link rel=&quot;stylesheet&quot; type=&quot;text/css&quot; href=&quot;css/ratchet.min.css&quot; /&gt;
		&lt;script src=&quot;js/ratchet.min.js&quot;&gt;&lt;/script&gt;
	&lt;/head&gt;
	&lt;body&gt;

		&lt;header class=&quot;bar bar-nav&quot;&gt;
	      &lt;h1 class=&quot;title&quot;&gt;SMS Demo&lt;/h1&gt;
	    &lt;/header&gt;

	    &lt;div class=&quot;content&quot;&gt;
	    	&lt;div class=&quot;content-padded&quot;&gt;
		    	&lt;form&gt;
				&lt;input type=&quot;text&quot; id=&quot;number&quot; placeholder=&quot;Phone Number&quot;&gt;&lt;br/&gt;
				&lt;textarea id=&quot;message&quot; placeholder=&quot;Message&quot;&gt;&lt;/textarea&gt;
				&lt;input type=&quot;button&quot; class=&quot;btn btn-positive btn-block&quot; id=&quot;sendMessage&quot; value=&quot;Send Message&quot;&gt;
				&lt;/form&gt;
			&lt;/div&gt;
		&lt;/div&gt;


	&lt;script src=&quot;cordova.js&quot;&gt;&lt;/script&gt;	
	&lt;script src=&quot;js/app.js&quot;&gt;&lt;/script&gt;
	&lt;/body&gt;
&lt;/html&gt;
</code></pre>

Which renders this lovely UI:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2014/12/iOS-Simulator-Screen-Shot-Dec-11-2014-10.39.52-AM.png" alt="iOS Simulator Screen Shot Dec 11, 2014, 10.39.52 AM" width="600" height="382" class="alignnone size-full wp-image-5438" />

Now let's consider the JavaScript:

<pre><code class="language-javascript">
document.addEventListener("deviceready", init, false);
function init() {

	document.querySelector("#sendMessage").addEventListener("touchend", function() {
		console.log("click");
		var number = document.querySelector("#number").value;
		var message = document.querySelector("#message").value;
		console.log("going to send "+message+" to "+number);

		//simple validation for now
		if(number === '' || message === '') return;

		var msg = {
			phoneNumber:number,
			textMessage:message
		};

		sms.sendMessage(msg, function(message) {
			console.log("success: " + message);
			navigator.notification.alert(
			    'Message to ' + number + ' has been sent.',
			    null,
			    'Message Sent',
			    'Done'
			);

		}, function(error) {
			console.log("error: " + error.code + " " + error.message);
			navigator.notification.alert(
				'Sorry, message not sent: ' + error.message,
				null,
				'Error',
				'Done'
			);
		});

	}, false);

}
</code></pre>

So as I mentioned above, the plugin has one method. It takes an object containing the phone number and message. The second argument is the success handler and the third is for failures. If you try to run this on the simulator, you will get an error: "SMS feature is not supported on this device." This is useful in case your application is being run on a wifi-only tablet. 

As I mentioned, on iOS and Windows Phones, the user will see the 'real' SMS application pop up. It will be pre-populated with the data sent from the plugin. Here is an example:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2014/12/IMG_4245mod.png" alt="IMG_4245mod" width="423" height="750" class="alignnone size-full wp-image-5439" />

The user will need to hit Send to finish the process, but they won't have to actually type anything.

That's it. If you want a copy of this code, you can grab it here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/smscomposer">https://github.com/cfjedimaster/Cordova-Examples/tree/master/smscomposer</a>