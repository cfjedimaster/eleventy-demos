---
layout: post
title: "Customized Form Handling on Netlify with Serverless Functions"
date: "2019-01-15"
categories: ["serverless","static sites"]
tags: ["javascript"]
banner_image: /images/banners/forms.jpg
permalink: /2019/01/15/customized-form-handling-on-netlify-with-serverless-functions
---

A couple days ago I wrote up a look at serverless functions at Netlify (["Adding Serverless Functions to Your Netlify Static Site"](https://www.raymondcamden.com/2019/01/08/adding-serverless-functions-to-your-netlify-static-site)) and today I want to look at a particular aspect of that feature - connecting functions to [Netlify events](https://www.netlify.com/docs/functions/#event-triggered-functions). 

Per the docs, you can write customized logic for the following Netlify events:

* When a deploy is begins to build, succeeds in building, fails to build, is locked, or unlocked
* When a split test is activated, deactivated, or modified
* When a user signs up or tries to log in
* And of course, when a Netlify-controlled form is submitted

So to be clear, Netlify doesn't care about the forms on your site unless you specifically tell it to. This is covered in the [form docs](https://www.netlify.com/docs/form-handling/), but basically, you either add `netlify` or `data-netlify="true"` to your form tag as a way to signal to Netlify that you want them to handle the submission. Out of the box you get things like spam protection, captcha, and redirects on submission as well as the ability to integrate with third party utilities via Zapier. You should first play around to see if you even need customization via a serverless function as your needs may already be met. 

Given that your pretty sure you *do* want to write some customized logic, let's take a look at how that's done. First, here is a simple form I built for testing:

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>Contact Form</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

	<form action="/thankyou.html" method="post" name="Contact Form" data-netlify="true">
	<p>
		<label for="name">Name</label>	
		<input id="name" name="name" value="Raymond Testing">
	</p>
	<p>
		<label for="email">Email</label>
		<input type="email" id="email" name="email" value="raymondcamden@gmail.com">
	</p>
	<p>
		<label for="comments">Comments</label><br/>
		<textarea id="comments" name="comments">Default value</textarea>
	</p>
	<p>
		<input type="submit" value="Send Comments">
	</p>
	</form>

</body>
</html>
```

If you want, you can see this at <https://codabreaker.netlify.com/contact.html>. I only supplied default values in order to make my testing a bit easier. It's nothing related to Netlify support or anything like that.

Ok - so the first thing you need to is create a function with the name, `submission-created.js`. You can only have one handler per Netlify site and event, but as your function is passed information about the event, you could definitely add support for multiple sources. From what I see of the supported list of events, forms are probably the only time where you would probably care. 

Like other Netlify serverless functions, your basic function signature looks like this:

```js

exports.handler = (event, context, callback) => {
	//logic
};
```

Although you can skip the `callback` argument. In my testing, calling the callback, both with and without an error, had no impact on the form submission or anything else. 

Accessing the form data can be done via `event.body`, which is a JSON string, and within there you would access the `payload` value. So for example:

```js
let payload = JSON.parse(event.body).payload;
```

What does payload look like? Here's an example:

```js
{
  "number": 24,
  "title": "Raymond Testing",
  "email": "raymondcamden@gmail.com",
  "name": "Raymond Testing",
  "first_name": "Raymond",
  "last_name": "Testing",
  "company": null,
  "summary": "<strong>Raymond Testing</strong> Default value",
  "body": "Default value",
  "data": {
    "name": "Raymond Testing",
    "email": "raymondcamden@gmail.com",
    "comments": "Default value",
    "ip": "76.72.11.11"
  },
  "created_at": "2019-01-15T22:00:51.691Z",
  "human_fields": {
    "Name": "Raymond Testing",
    "Email": "raymondcamden@gmail.com",
    "Comments": "Default value"
  },
  "ordered_human_fields": [
    { "title": "Name", "name": "name", "value": "Raymond Testing" },
    { "title": "Email", "name": "email", "value": "raymondcamden@gmail.com" },
    { "title": "Comments", "name": "comments", "value": "Default value" }
  ],
  "id": "5c3e5813f203baba9782ba13",
  "form_id": "5c3a051bdbfb660008114ddb",
  "site_url": "http://codabreaker.netlify.com",
  "form_name": "Contact Form"
}
```

Yes, that's a heck of a lot of data. You can see some interesting things going on here. First off, if all you care about is your form data, then you can find it within the `data` block. Notice that an `ip` value was added automatically. 

Secondly, it appears as if Netlify is trying to do some basic parsing of the form. Notice how it picked up a first and last name by simply splitting my input. It made note of the email address. It also provided "human" versions of the form fields which I'm guessing is probably going to do basic parsing as well. I renamed `email` to `email_address`, and Netlify still called the human form `email`. I guess if you have large, ugly forms with poor naming, this could be useful.

Finally, note that it recognizes the name of the form, the site, and that this is the 24th submission. All things you could use in your logic.

Here's a complete example that makes use of both SendGrid and code I had built for OpenWhisk in the past:

```js
const SG_KEY = process.env.SENDGRID;

const helper = require('sendgrid').mail;


exports.handler = (event, context, callback) => {
	console.log('submission created error testing');
	
	let payload = JSON.parse(event.body).payload;

	// note - no validation - booooo
	let from_email = new helper.Email(payload.data.email);
	let to_email = new helper.Email('raymondcamden@gmail.com');
	let subject = 'Contact Form Submission';

	let date = new Date();
	let content = `
Form Submitted at ${date}
--------------------------------
`;

	for(let key in payload.data) {
		content += `
${key}:			${payload.data[key]}
`;
	}

	let mailContent = new helper.Content('text/plain', content);
	let mail = new helper.Mail(from_email, subject, to_email, mailContent);
	let sg = require('sendgrid')(SG_KEY);

	let request = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: mail.toJSON()
	});
		
	sg.API(request, function(error, response) {
		if(error) {
			console.log(error.response.body);
		}
	});

};
```

Note that I dynamically build the content based on the form submission which would work nice with Netlify and multiple forms, but you could also hard code a set of key-value pairs here.

That's basically it. I've got an interesting idea for how to take this a bit further, but I'm waiting for IBM to unlock my dang developer account before I try it. If you've got any questions, let me know by leaving a comment below!
