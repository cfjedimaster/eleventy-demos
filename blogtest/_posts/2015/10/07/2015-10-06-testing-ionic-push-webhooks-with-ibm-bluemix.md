---
layout: post
title: "Testing Ionic Push Webhooks with IBM Bluemix"
date: "2015-10-07T09:45:33+06:00"
categories: [development,javascript,mobile]
tags: [bluemix,ionic]
banner_image: 
permalink: /2015/10/07/testing-ionic-push-webhooks-with-ibm-bluemix
guid: 6882
---

<strong>Disclaimer: Ionic Services are currently in Alpha status. While the feature I'm talking about will surely exist when Ionic's Push service goes Gold, the <i>details</i> of what I'm covering today will surely change. Please keep that in mind.</strong>

I've been going over the various Ionic Services as I prepare for my <a href="http://www.meetup.com/Ionic-SF/events/225612872/">presentation</a> next week. One of the aspects of Ionic's Push service that I had not used yet is <a href="http://docs.ionic.io/docs/push-server-setup">webhooks</a>. Ionic lets you define a webhook (a URL really) that they will call whenever someone registers for push, unregisters for push, or simply has a device that becomes invalid. I thought I'd create a quick Node.js application so I could test this feature for myself. To host this application, I'll make use of <a href="https://ibm.biz/IBM-Bluemix">Bluemix</a>, our PaaS solution that makes Node.js hosting quite easy. As an aside, Bluemix supports Push by itself and you may wish to use that instead of Ionic's Push service. One of the nice things about Bluemix is the ability to mix and match services as you see fit.

<!--more-->

To begin, I created a simple Push demo. You can find the complete source code for this demo here: <a href="https://github.com/cfjedimaster/IonicServicesPresentation/tree/master/demos/push1_user">https://github.com/cfjedimaster/IonicServicesPresentation/tree/master/demos/push1_user</a>. I'm not going to show the code here in the blog entry as it isn't necessarily relevant. All it does is register the application for push and associate it with an Ionic User. That by itself is interesting as the docs don't show a complete example of this yet, but I'll save that for a blog entry later this week. The important thing is that I've got an application I can fire up on my device and do real push tests.

Now let's turn our attention to the <a href="http://docs.ionic.io/docs/push-server-setup">webhook</a> feature. The main purpose of this feature is to give you the ability to know when a user registers (or unregisters) for push. You can use <i>any</i> server technology you want for this, which for me means Node.js. I began by going to Bluemix and signing in (which is free, by the way!) and creating a new app using the Node.js starter. I downloaded the sample code (which has gotten quite a bit simpler since I first began using Bluemix), and ran <code>npm install</code> to get things prepared locally. I've talked about how to use Bluemix for Node.js before, but in case you need a refresher, check out my article here: <a href="http://www.raymondcamden.com/2015/03/02/hosting-node-js-apps-on-bluemix">Hosting Node.js apps on Bluemix</a>.

For my application, I decided that it will respond to Ionic's calls by storing the registration data in <a href="https://ibm.biz/Bluemix-Cloudant">Cloudant</a>. There's a great Node.js <a href="https://www.npmjs.com/package/cloudant">package</a> for it so I knew using it in the application would be simple. You can easily add the Cloudant service to your Bluemix app from the catalog:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot11.png" alt="shot1" width="407" height="225" class="aligncenter size-full wp-image-6883" />

Once I added the service, I then went into the administrator and created a database called "registrations". Now I opened up my code and started writing. Believe it or not, I wrote everything below in one sitting and I didn't make any mistakes. Seriously. (Ok, I may be off by a factor of ten or so.) Here is the code I used to handle calls from the webhook:

<pre><code class="language-javascript">/*eslint-env node*/

var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

var Cloudant = require('cloudant');

var cdMe = &quot;&quot;;
var cdPassword = &quot;&quot;;
if(process.env.VCAP_SERVICES) {
	var info = JSON.parse(process.env.VCAP_SERVICES);
	cdMe = info.cloudantNoSQLDB[0].credentials.username;
	cdPassword = info.cloudantNoSQLDB[0].credentials.password;	
} else {
	cdMe = &quot;the username from the Bluemix console&quot;;
	cdPassword = &quot;ditto&quot;;
}


var cloudant = Cloudant({% raw %}{account:cdMe, password:cdPassword}{% endraw %});
var registrationDb = cloudant.db.use('registrations');

var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

var jsonBody = require(&quot;body/json&quot;);

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

function getRegistrationMode(body) {
	if(body.token_invalid) return &quot;invalid&quot;;
	if(body.unregister &amp;&amp; body.unregister == true) return &quot;unregister&quot;;
	return &quot;register&quot;;	
}

app.post('/register', function(req, res) {
	console.log('running register');

	jsonBody(req, function(err,body) {
		console.log(body);
		
		var tokens = [];

		/*
		There are 3 'modes' of the hook: register, invalid, unregister,
		but there is no simple flag for this. We'll do the ugly code in a
		function and when Ionic improves this, we can fix it there.
		*/
		var mode = getRegistrationMode(body);
		console.log('registration mode is '+mode);
		
		if(mode === 'register') {

			if(body._push.android_tokens) {
				body._push.android_tokens.forEach(function(token) {
					tokens.push(token);
				});
			}
			if(body._push.ios_tokens) {
				body._push.ios_tokens.forEach(function(token) {
					tokens.push(token);
				});
			}
			console.log(&quot;Going to add tokens &quot;+tokens);
			tokens.forEach(function(token) {
				//do a get to see if exists
				registrationDb.get(token, function(err, dbBody) {
					if(err) {
						console.log('inserting '+token);
						//console.log(arguments);
						registrationDb.insert({% raw %}{_id:token,time:new Date().getTime()}{% endraw %}, function(err, body, header) {
							//console.log(&quot;cloudant db response: &quot;+JSON.stringify(arguments));
						});
					} else {
						console.log('updating '+token);
						registrationDb.insert({% raw %}{_id:token,time:new Date().getTime(),_rev:dbBody._rev}{% endraw %}, function(err, body, header) {
							//console.log(&quot;cloudant db response: &quot;+JSON.stringify(arguments));
						});
					}
				});
			});
		} else {
			//for both unregister, invalid we just delete, but how we get the tokens is different
			if(mode === &quot;unregister&quot;) {
				if(body._push.android_tokens) {
					body._push.android_tokens.forEach(function(token) {
						tokens.push(token);
					});
				}
				if(body._push.ios_tokens) {
					body._push.ios_tokens.forEach(function(token) {
						tokens.push(token);
					});
				}								
			} else {
					if(body.android_token) tokens = [body.android_token];
					if(body.ios_token) tokens = [body.ios_token];
			}
			console.log(&quot;Removing &quot;+tokens);
			tokens.forEach(function(token) {
				//do a get to see if exists
				registrationDb.get(token, function(err, dbBody) {
					if(!err){
						registrationDb.destroy(token,dbBody._rev, function(err, body, header) {
							//console.log(&quot;cloudant db response: &quot;+JSON.stringify(arguments));
						});
					}
				});
			});			
		}
	});
	
	res.send(1);
});

app.get('/list', function(req, res) {
	var results = [];
	registrationDb.list(function(err, body) {
		if(!err) {
			body.rows.forEach(function(doc) {
				results.push(doc);
			});	
			res.send(JSON.stringify(results));
		}
	});
});

// start server on the specified port and binding host
app.listen(appEnv.port, function() {
	// print a message when the server starts listening
	console.log(&quot;server starting on &quot; + appEnv.url);
});</code></pre>

Before we dive into this, let me just clarify that I wrote the <i>bare minimum</i> here to get my tests working. This code could be organized quite a bit better. I'm sorry.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/sorry.jpg" alt="sorry" width="400" height="393" class="aligncenter size-full wp-image-6884" />

Let's work our way from the top down. For the most part, the first few lines are just simple require statements. Notice that I get my Cloudant credentials either via an environment variable or via a hard coded value. Don't forget you can get your credentials in the Bluemix console by clicking on the "Show Credentials" link of the service itself:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot22.png" alt="shot2" width="369" height="450" class="aligncenter size-full wp-image-6885" />

Moving on down - the next critical aspect is <code>getRegistrationMode</code>. If you read the docs for how Ionic will hit your URL, you will notice that it is bit difficult to tell one "mode" form the other. I spoke with the developer behind this service and he agrees it can be simpler, but for now, I wrote a simple function to look at the data and figure out the mode. In the <code>/register</code> route, we then use that function to figure out what in the heck we are doing. 

If we are adding, then we get the tokens and figure out if they exist already in our database. If they do, we update, if they don't, we insert. I'm including a time stamp along with the registration. I could include other things as well. Both the 'unregister' and invalid status we end up removing the token.

Finally, I built a <code>/list</code> route so I could quickly see if it was working. And that's it. As I said, I wrote this all in one fell swoop without any errors. (Actually I did something kind of spectacularly stupid - read the p.s. at the bottom for details.) 

I ran this on my local machine first, and to test, I copied the sample JSON packets from Ionic's docs and used the <a href="https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en">Postman Chrome app</a> to test. Postman has been around for years, but I never got around to playing with it till yesterday. It is awesome. Here it is in action:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/postman.png" alt="postman" width="650" height="371" class="aligncenter size-full wp-image-6886" />

I really can't praise this app enough. It certainly isn't a "use every day" type thing but it is incredibly useful. Once I had my app working fine, I pushed it up to Bluemix: <code>cf push IonicPushRegistration</code>. I waited for it to get setup, and then ran this at the command line to tell Ionic about the webhook: <code>ionic push webhook_url http://ionicpushregistration.mybluemix.net/register</code>

At the time I write this, there is no way for you to determine if an Ionic app is using a web hook. Again, I've reported this to Ionic and they know it is an issue. 

And that's it really. Outside of the data packet from Ionic needing a bit of organization, the feature works as expected. You can hit the <a href="http://ionicpushregistration.mybluemix.net/list">/list</a> URL yourself and see the tokens I've tested.

Once Ionic's services hit 1.0, I'll consider releasing a complete Node.js application to handle this. Just remind me!

p.s. So yeah, my "epic" screw up. I was trying to write code that said, "If I have an environment variable for my Cloudant auth crap, use it, otherwise default to these values." While doing that, I ended up completely breaking process.env by setting it to a new object that wiped away everything else. That kinda screwed up multiple things. Yep, I still suck at Node.