---
layout: post
title: "Building a Serverless Form Handler with Auth0 Webtasks"
date: "2018-03-02"
categories: [serverless]
tags: [webtask]
banner_image: /images/banners/wt_forms.jpg
permalink: /2018/03/02/buidling-a-serverless-form-handler-with-webtask
---

Earlier this week I decided to build a rather simple application with [Auth0 Webtask](https://webtask.io/), a form handler. This was something I did many [months ago](https://www.raymondcamden.com/2017/02/15/building-a-form-handler-service-in-openwhisk-part-two/) with OpenWhisk and I was curious what the experience would be with Auth0 Webtask. As usual in such things, even though it was pretty simple, I did run into a few things that helped me understand Auth0 Webtask a bit more. Here is how I approached it.

First, I built a form. I actually had a simple form I used last week in my (very last) OpenWhisk talk, so I just copied that over. 

```html
<form method="post" action="">
	
	<div class="form-group">
		<label for="name">Name</label>
		<input type="text" class="form-control" name="name" id="name" required>
	</div>

	<div class="form-group">
		<label for="email">Email</label>
		<input type="email" class="form-control" name="email" id="email" required>
	</div>

	<div class="form-group">
		<label for="acc">Current Accuracy</label>
		<select name="acc" id="acc" class="form-control" required>
			<option></option>
			<option>Sharp Shooter!</option>
			<option>Reasonable Accuracy</option>
			<option>I can hit anything except a rebel</option>
		</select>
	</div>


	<div class="form-group">
		<label for="emp">The Empire is...</label>
		<select name="emp" id="emp" class="form-control" required>
			<option></option>
			<option>Awesome!</option>
			<option>Totally Not Evil!</option>
			<option>Whatever "Better than Awesome" is!</option>
		</select>
	</div>


	<div class="form-group">
		<label for="why">Why you want to join the Stormtrooper ranks:</label>
		<textarea name="why" id="wh" class="form-control" required></textarea>
	</div>

	<button type="submit" class="btn btn-primary">Submit (No, seriously, submit!)</button>

</form>
```

I used Bootstrap to make it a bit nicer. If you want to see the final result, I'll be sharing the URL at the end. I created the first draft of my handler with the smallest code possible.

```js
'use strict';

module.exports = function(context, cb) {
	//first, gather the form fields
	let form = context.body;
	console.log(form);
	cb(null, {% raw %}{form:form}{% endraw %})
}
```

Form data is available in the context argument so I've simply made a copy of it to address it a bit nicer. I log it and return it. To deploy this, I saved that code as form_handler_v1.js and used the following command line:

	wt create form_hander_v1.js --name form_handler

What's with the `--name` part? By default the CLI will give your webtask a name based on the filename. I was planning on writing multiple different versions of this application so I used the name argument to specify exactly what I wanted. As I go on and add newer versions, I'll just keep using the same name.

The command line spit out the URL for me: https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.run.webtask.io/form_handler and I simply pasted that into my form. I filled out some data, hit submit, and got a nice, but not very helpful, JSON response:

![JSON output](https://static.raymondcamden.com/images/2018/03/wtf1.jpg)

I also opened up a new tab in my terminal and ran `wt logs` so I could see the log output as the webtask was run:

![Log output](https://static.raymondcamden.com/images/2018/03/wtf2.jpg)

Sweet. Practically done, right? I then switched to a new version, `form_handler_v2.js`:

```js
'use strict';

const RECIPS = ["raymondcamden@gmail.com","ray@camdenfamily.com"];

module.exports = function(context, req, res) {
	//first, gather the form fields
	let form = context.body;

	let from = RECIPS[0];
	let to = RECIPS[0];

	//let the form specify a from
	if(form._from) {
		from = form["_from"];
	}

	if(form["_to"]) {
		if(RECIPS.indexOf(form["_to"]) === -1) {
			cb("Invalid _to address: "+form["_to"]);
		} else {
			to = form["_to"];
		}
	}

	let subject = form["_subject"] || 'Form Submission';

	let next = form["_next"] || context.headers.referer;

	//Generate the text
	let date = new Date();
    let content = `
Form Submitted at ${% raw %}{date}{% endraw %}
--------------------------------
`;

    for(let key in form) {
        //blanket ignore if _*
        if(key.indexOf("_") != 0) {
            content += `
${% raw %}{key}{% endraw %}:         ${% raw %}{form[key]}{% endraw %}
`;
        }
    }
	
	//fire off the request to send an email - we don't want the user to wait so this is fire and forget
	sendEmail(to,from,subject,content);

	res.writeHead(301, {% raw %}{'Location': next }{% endraw %});
	res.end();

}

function sendEmail(to, from, subject, body) {
}
```

This one kicks it up a notch by adding features and functionality from my original OpenWhisk demo.

First - I have support for looking for a form variable called `_from`. If it exists, I'll use it as the sender for the email generated by the form. I also allow for a dynamic address as well, but restrict it to a hard coded list of valid values (`RECIPS`). As before, I use a form field with an underscore (`_to`). 

Next, I look for a `_subject` field to allow customization for the email.

Finally, I look for `_next` as a way to know where to send the user after the form is processed. If nothing was specified for that, I simply send them back to where they came from. That's probably not a good idea, but I needed some default.

After working with the "special" variables, I then gather up the form fields into a simple string. Note we skip any field that begins with an underscore. I wrote a mocked out `sendEmail` function and then did my redirect. I deployed this version by using `wt create form_handler_v2.js --name form_handler` and...

It broke. Why? I kept getting an error about form._form not existing. Turns out, when you use a webtask with this form: `function(context, req, res)`, the expectation is that you are going to parse the request body to get what you want out of it. I had switched to this form so I could do the redirect at the end. This issue with the context value is documented, but needs to be cleaned up a bit (my job!). Luckily, there's an easy fix - add `--parse-body` to your CLI call. You can find this if you run `wt create -h`. So my new command was:

	wt create form_handler_v2.js --name form_hamdler --parse-body

I didn't need to update my URL in the form as it already had the right value. I did change the email field to use `_from` though.

Ok, almost there! Now let's add in actual email support. I used sendgrid before so I figured I'd use it again. I already had a developer key so that saved me the trouble of getting a new one. Here's the updated version (form_handler_v3.js):

```js
'use strict';

const helper = require('sendgrid').mail;
const RECIPS = ["raymondcamden@gmail.com","ray@camdenfamily.com"];

module.exports = function(context, req, res) {
	//first, gather the form fields
	let form = context.body;

	let from = RECIPS[0];
	let to = RECIPS[0];

	//let the form specify a from
	if(form._from) {
		from = form["_from"];
	}

	if(form["_to"]) {
		if(RECIPS.indexOf(form["_to"]) === -1) {
			cb("Invalid _to address: "+form["_to"]);
		} else {
			to = form["_to"];
		}
	}

	let subject = form["_subject"] || 'Form Submission';

	let next = form["_next"] || context.headers.referer;

	//Generate the text
	let date = new Date();
    let content = `
Form Submitted at ${% raw %}{date}{% endraw %}
--------------------------------
`;

    for(let key in form) {
        //blanket ignore if _*
        if(key.indexOf("_") != 0) {
            content += `
${% raw %}{key}{% endraw %}:         ${% raw %}{form[key]}{% endraw %}
`;
        }
    }
	
	//fire off the request to send an email - we don't want the user to wait so this is fire and forget
	sendEmail(to,from,subject,content, context.secrets.sg_key)
	.then(() => {
		res.writeHead(301, {% raw %}{'Location': next }{% endraw %});
		res.end();
	}).catch(e => {
		// handle error
	});

}

function sendEmail(to, from, subject, body, key, cb) {

	let to_email = new helper.Email(to);
	let from_email = new helper.Email(from);
    let mailContent = new helper.Content('text/plain', body);
    let mail = new helper.Mail(from_email, subject, to_email, mailContent);
	let sg = require('sendgrid')(key);

	var request = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: mail.toJSON()
	});
        
	return new Promise((resolve, reject) => {
		sg.API(request, function(error, response) {
			if(error) {
				console.log(error.response.body);
				reject(error.response.body);
			} else {
				console.log('good response from sg');
				resolve();
			}
		});
	});

}
```

So notice I changed how I called `sendEmail`. Instead of "fire and forget", I actually wait for it to finish. The code inside `sendEmail` is virtually the same from my previous demo and is just boilerplate email code. However, to get it to work, I need to add the sendgrid npm module. The visual editor has a slick UI for this, but as I'm using the CLI, I'll just use that. Luckily there's yet another argument for this, `--dependency`. Note, `--dependancy` will not work, because that's not how it's spelled. Learn to spell. (I'm talking to myself, by the way.)

Here's the final version of the CLI call:

	wt create form_handler_v3.js --name form_handler --parse-body --dependency sendgrid --secret sg_key=mysecretsarebetterthanyours

Notice I also added my sendgrid key as well. That was used here: `context.secrets.sg_key`. At this point, the CLI is a bit long, so I'd probably create a simple shell script to simplify it a bit. To finish testing, I added this to my form:

```html
<input type="hidden" name="_subject" value="Stormtrooper Form">
<input type="hidden" name="_next" value="https://auth0.com">
```

This provides a custom subject line for the email and an address to go to when done. You are more than welcome to test the form here - https://cfjedimaster.github.io/Serverless-Examples/webtask/test_form.html. Please note I won't actually be reading the emails. ;) You can find the full source code for all three versions of the handler here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/webtask. Enjoy!

<i>Header photo by <a href="https://unsplash.com/photos/G_xJrvHN9nk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Samuel Zeller</a> on Unsplash</i>