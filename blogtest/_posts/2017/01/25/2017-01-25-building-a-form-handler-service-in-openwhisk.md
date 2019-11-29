---
layout: post
title: "Building a Form Handler Service in OpenWhisk"
date: "2017-01-25T14:42:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/01/25/building-a-form-handler-service-in-openwhisk
---

As a fan of static site generators, I've played with, and built, my own form processing services to work with my static sites. My current favorite is 
[FormSpree](https://formspree.io/) - it's the one I use on this blog. I even built my own version of it in Node (["Building a Simple Form Handler Service in Node"](https://www.raymondcamden.com/2016/10/31/building-a-simple-form-handler-service-in-node)) back
in October last year. I thought it would be kind of cool to look into building a similar type service with [OpenWhisk](https://developer.ibm.com/openwhisk/).

Right now, OpenWhisk isn't necessarily the best choice for this type of service. The main reason being that you can't return HTTP headers in your response. That
means I can't take a form and simply set the <code>action</code> to an OpenWhisk URL. Hopefully that will come in the future. But I *can* use Ajax to process
the form and that's the route I've taken for this demo.

The basic premise is this:

* Accept a set of form data
* Email that form data
* Look for special keys possibly change that email, like _subject, and _from.

For sending email, I decided to use the sendmail NPM package which is supported out of the box with OpenWhisk. nodemailer is also supported, but I
wanted to try something new. After creating my API key, I wrote up the following action.

<pre><code class="language-javascript">
&#x2F;&#x2F;SendGrid API Key
var SG_KEY = &#x27;noonecommentsonthefunnythingsiputinmykeys&#x27;;

&#x2F;&#x2F;people we are allowed to email
var RECIPS = [&quot;raymondcamden@gmail.com&quot;,&quot;ray@camdenfamily.com&quot;];

var helper = require(&#x27;sendgrid&#x27;).mail;

function main(args) {

	let from_email = new helper.Email(RECIPS[0]);
	let to_email = new helper.Email(RECIPS[0]);

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
				console.log(response.statusCode);
				console.log(response.body);
				console.log(response.headers);
				resolve({% raw %}{result:&#x27;Ok&#x27;}{% endraw %});
			}
		});

	});

}

exports.main = main;
</code></pre>

Let's tackle this line by line. I assume you can figure out what <code>SG_KEY</code> is. The variable, <code>RECIPS</code>, is used to create
a whitelist of emails that can be the recipient. This is *unlike* FormSpree which will email anyone (with confirmation of course!) but I figured
this was a more realistic example. I used an array since I thought for a real "dot com" there may be a few different forms in
use. 

Going into <code>main</code>, you can see how I look at my arguments for possible overrides of behavior. You can override the
from address, the to (again though, only within the acceptable list), and subject. I then craft a string of the remaining values and
send that to SendGrid. And that's it. I could obviously make this a bit nicer, switch to HTML email too perhaps, but you get the idea.

I then simply used the OpenWhisk command line to create the action and API end point. (Although before I did that, I [tested locally](https://www.raymondcamden.com/2017/01/09/quick-tip-for-testing-openwhisk-actions-locally).) 

Let's look at the front end. First, I built a really ugly form.

<pre><code class="language-markup">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

		&lt;h2&gt;Contact Form&lt;&#x2F;h2&gt;

		&lt;form id=&quot;contactForm&quot;&gt;
		&lt;p&gt;
		&lt;label for=&quot;name&quot;&gt;Name&lt;&#x2F;label&gt;&lt;br&#x2F;&gt;
		&lt;input id=&quot;name&quot; type=&quot;text&quot; required&gt;
		&lt;&#x2F;p&gt;

		&lt;p&gt;
		&lt;label for=&quot;email&quot;&gt;Email&lt;&#x2F;label&gt;&lt;br&#x2F;&gt;
		&lt;input id=&quot;email&quot; type=&quot;email&quot; required&gt;
		&lt;&#x2F;p&gt;

		&lt;p&gt;
		&lt;label for=&quot;comments&quot;&gt;Comments&lt;&#x2F;label&gt;&lt;br&#x2F;&gt;
		&lt;textarea id=&quot;comments&quot;&gt;&lt;&#x2F;textarea&gt;
		&lt;&#x2F;p&gt;

		&lt;p&gt;
			&lt;input type=&quot;submit&quot; value=&quot;Send My Important Comments&quot;&gt;
		&lt;&#x2F;p&gt;
		&lt;&#x2F;form&gt;

		&lt;script src=&quot;app.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

And then wired up the code.

<pre><code class="language-javascript">
let $name, $email, $comments, $contactForm;

const API_URL = &#x27;https:&#x2F;&#x2F;3b1fd5b1-e8cc-4871-a7d8-cc599e3ef852-gws.api-gw.mybluemix.net&#x2F;api&#x2F;sendmail&#x27;;
				
document.addEventListener(&#x27;DOMContentLoaded&#x27;, init, false);

function init() {
	$name = document.querySelector(&#x27;#name&#x27;);
	$email = document.querySelector(&#x27;#email&#x27;);
	$comments = document.querySelector(&#x27;#comments&#x27;);
	$contactForm = document.querySelector(&#x27;#contactForm&#x27;);

	$contactForm.addEventListener(&#x27;submit&#x27;, processForm, false);
}

function processForm(e) {
	console.log(&#x27;processForm ftw&#x27;);
	e.preventDefault();

	&#x2F;*
	create a structure of form data to send to the api
	*&#x2F;
	let data = {
		name:$name.value,
		_from:$email.value,
		_subject:&quot;My Cool Contact Form&quot;,
		comments:$comments.value
	};

	fetch(API_URL, {
		method:&#x27;POST&#x27;, 
		mode:&#x27;cors&#x27;,
		body:JSON.stringify(data)
	}).then((res) =&gt; {
		return res.json();
	}).then( (result) =&gt; {
		console.log(&#x27;result was &#x27;+JSON.stringify(result));	
		if(result.result === &#x27;Ok&#x27;) {
			$comments.value=&#x27;&#x27;;
			alert(&quot;Thanks for the awesome comments!&quot;);
		} else {
			alert(&quot;Sorry, something went wrong.&quot;);
		}
	});
}
</code></pre>

In the end, my code is simple DOM reading and Ajax-fetching. You do have to be careful about how you POST to OpenWhisk. You cannot send a regular
form body and must instead send a JSON packet of data. But frankly that wasn't necessarily a big deal. And of course - it works!

<img src="https://static.raymondcamden.com/images/2017/1/owemail1.png" title="Gmail Screenshot" class="imgborder">

Yes - the formatting is a bit subpar, but for a quick demo, I'll leave it be for now. So what do you think?