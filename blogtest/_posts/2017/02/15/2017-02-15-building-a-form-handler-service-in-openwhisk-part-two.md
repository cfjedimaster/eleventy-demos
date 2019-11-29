---
layout: post
title: "Building a Form Handler Service in OpenWhisk - Part Two"
date: "2017-02-15T12:22:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/02/15/building-a-form-handler-service-in-openwhisk-part-two
---

A few weeks ago I [blogged](https://www.raymondcamden.com/2017/01/25/building-a-form-handler-service-in-openwhisk) about creating a generic "forms handler" with [OpenWhisk](https://developer.ibm.com/openwhisk/). The idea was that you could point any form at the action and it would gather up the form data and email the results. One of the issues with my action was that it only worked via a HTTP call to the end point. That made it fine for a simple Ajax call from JavaScript, but it missed one of the cooler features that most form handling services provide - the ability to redirect to another URL when done.

Turns out that support is now available in OpenWhisk as a new feature, "web actions." Fellow IBMer Rodric Rabbah wrote up a great post on the feature here: [Serverless HTTP handlers with OpenWhisk](https://medium.com/openwhisk/serverless-http-handlers-with-openwhisk-90a986cc7cdd#.oifkk4uxz). Also be sure to see his follow up here: [Web Actions: Serverless Web Apps with OpenWhisk](https://medium.com/openwhisk/web-actions-serverless-web-apps-with-openwhisk-f21db459f9ba#.n8ddwapgx)

I won't repeat the instructions, but essentially it comes down to a few changes:

* First, when creating (or updating) your action, add <code>\-\-annotation web-export true</code>
* Second, figure out the URL. Your URL will be https://openwhisk.ng.bluemix.net/api/v1/experimental/web/NAMESPACE/PACKAGE/ACTION.TYPE. If you aren't using a package for your action, use <code>default</code>. The TYPE value is one of json, html, text, or http. 

Basically, that's it. (There's more, but again, see Rodric's [post](https://medium.com/openwhisk/serverless-http-handlers-with-openwhisk-90a986cc7cdd#.oifkk4uxz)). Given that my action was already mostly done, the modifications were pretty simple. I'll share the entire action at the end, but here are the mods I added.

First, I simply look for a new parameter, _next. If specified, it means that we want to redirect after processing the form. I made this optional to still support the Ajax version I created initially.

<pre><code class="language-javascript">let next = '';
if(args['_next']) next = args['_next'];
</code></pre>

Then I simply look for this when done:

<pre><code class="language-javascript">if(next === '') {
	resolve({% raw %}{result:'Ok'}{% endraw %});
} else {
	resolve({
		headers: {% raw %}{ location: next}{% endraw %},
		code: 302
	});
}
</code></pre>

The final step was updating my action with the new code *and* that new flag to open it up as a web action. I modified my form to skip using JavaScript for the submission and just post to the new URL:

<pre><code class="language-javascript">&lt;form id="contactForm"
action = "https://openwhisk.ng.bluemix.net/api/v1/experimental/web/rcamden@us.ibm.com_My%20Space/default/sendmail.http" 
method="post"&gt;

&lt;input type="hidden" name="_next" value="https://www.raymondcamden.com"&gt;
</code></pre>

Note the use of HTTP as the content type. I'm not sending HTML back, but rather HTTP headers. If I wanted to created a dynamic "thank you" page I'd use the HTML extension instead. The _next value I used is just my blog, but in a real world situation it would be a page specifically thanking the user for their feedback.

And that's it. This is a great addition to the platform and I can't wait to kick the tires a bit more with it. Here's the complete source of the action, and as always, if you have any questions, comments, or suggestions, just add a comment below.

<pre><code class="language-javascript">&#x2F;&#x2F;SendGrid API Key
var SG_KEY = &#x27;SG.secretkeysbetweenyouandme&#x27;;

&#x2F;&#x2F;people we are allowed to email
var RECIPS = [&quot;raymondcamden@gmail.com&quot;,&quot;ray@camdenfamily.com&quot;];

var helper = require(&#x27;sendgrid&#x27;).mail;

function main(args) {

	let from_email = new helper.Email(RECIPS[0]);
	let to_email = new helper.Email(RECIPS[0]);

	let next = &#x27;&#x27;;
	if(args[&#x27;_next&#x27;]) next = args[&#x27;_next&#x27;];

	&#x2F;*
	Ok, so args will be our form data. Look for a few special item
	*&#x2F;

	if(args[&quot;_from&quot;]) {
		from_email = new helper.Email(args[&quot;_from&quot;]);
	}

	if(args[&quot;_to&quot;]) {
		if(RECIPS.indexOf(args[&quot;_to&quot;]) === -1) {
			return {% raw %}{error:&quot;Invalid _to address: &quot;+args[&quot;_to&quot;]}{% endraw %};
		} else {
			to_email = new helper.Email(args[&quot;_to&quot;]);
		}
	}

	let subject = &#x27;Form Submission&#x27;;

	if(args[&quot;_subject&quot;]) {
		subject = args[&quot;_subject&quot;];
	}

	&#x2F;*
	Now loop through the rest of the args to create the form submission email.
	*&#x2F;

	&#x2F;&#x2F;todo: make date a bit prettier
	let date = new Date();
	let content = `
Form Submitted at ${% raw %}{date}{% endraw %}
--------------------------------
`;

	for(let key in args) {
		&#x2F;&#x2F;blanket ignore if _*
		if(key.indexOf(&quot;_&quot;) != 0) {
			content += `
${% raw %}{key}{% endraw %}:			${% raw %}{args[key]}{% endraw %}
`;
		}
	}

	let mailContent = new helper.Content(&#x27;text&#x2F;plain&#x27;, content);
	let mail = new helper.Mail(from_email, subject, to_email, mailContent);
	let sg = require(&#x27;sendgrid&#x27;)(SG_KEY);

	return new Promise( (resolve, reject) =&gt; {

		var request = sg.emptyRequest({
			method: &#x27;POST&#x27;,
			path: &#x27;&#x2F;v3&#x2F;mail&#x2F;send&#x27;,
			body: mail.toJSON()
		});
		
		sg.API(request, function(error, response) {
			if(error) {
				console.log(error.response.body);
				reject({% raw %}{error:error.message}{% endraw %}) 
			} else {
				console.log(&#x27;got to good result, next is &#x27;+next);
				&#x2F;*
				new logic - handle possible redirect
				*&#x2F;
				if(next === &#x27;&#x27;) {
					resolve({% raw %}{result:&#x27;Ok&#x27;}{% endraw %});
				} else {
					resolve({
						headers: {% raw %}{ location: next}{% endraw %},
						code: 302
					});
				}
			}
		});

	});

}

exports.main = main;
</code></pre>