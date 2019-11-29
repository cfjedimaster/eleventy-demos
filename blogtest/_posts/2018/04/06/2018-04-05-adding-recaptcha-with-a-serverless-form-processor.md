---
layout: post
title: "Adding reCaptcha with a Serverless Form Processor"
date: "2018-04-06"
categories: [serverless]
tags: [webtask,vuejs]
banner_image: /images/banners/tallbuildings.jpg
permalink: /2018/04/06/adding-recaptcha-with-a-serverless-form-processor
---

A few days ago I added [Google's reCaptcha](https://www.google.com/recaptcha/) support to a ColdFusion site. It was pretty easy (some front end work, some back end work), so I thought I'd whip up a quick demo of how you could add it to a form using a serverless processor, in my case, [Webtask](https://webtask.io). To get started, let's go over a quick demo of how such a processor could look before we add the captcha.

BC (Before Captcha)
===


First, here is the form.

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width">
		<style>
		[v-cloak] {% raw %}{display: none}{% endraw %}
		</style>
	</head>
	<body>

		<form id="infoForm" v-cloak>
			<p>
			<label for="name">Name:</label>
			<input type="text" v-model="name" id="name" required>
			</p>

			<p>
			<label for="email">Email:</label>
			<input type="email" v-model="email" id="email" required>
			</p>

			<p>
			<label for="url">URL:</label>
			<input type="url" v-model="url" id="url">
			</p>

			<p>
				<input type="submit" value="Send Info" @click.prevent="submitForm">
			</p>

			<div v-if="errors.length">
				<p>
					<b>Please correct these errors:</b>
					<ul>
						<li v-for="error in errors">{% raw %}{{error}}{% endraw %}</li>
					</ul>
				</p>
			</div>
			<div v-if="formGood">
				<p>
					Thanks for filling out the form. We care a lot.
				</p>
			</div>
		</form>

		<script src="https://unpkg.com/vue"></script>
		<script>
		const taskEndpoint = 'https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.run.webtask.io/form_resp1';

		new Vue({
			el:'#infoForm',
			data() {
				return {
					name:null,
					email:null,
					url:null,
					errors:[],
					formGood:false
				}
			},
			methods:{
				submitForm() {
					this.errors = [];
					this.formGood = false;
					fetch(taskEndpoint, {
						body:JSON.stringify({ 
							name:this.name,
							email:this.email,
							url:this.url
						}),
						headers: {
							'content-type':'application/json'
						}, 
						method:'POST'
					})
					.then(res => res.json())
					.then(res => {
						console.log(res);
						if(res.status) {
							this.formGood = true;
						} else {
							this.errors = res.errors;
						}
					});
				}
			}
		});
		</script>

	</body>
</html>
```

I've got three form fields and I'm using Vue.js to handle doing a POST via Ajax. I assume that all of this is pretty simple to understand, but as always, if you have any questions, add a comment. The end point is a webtask function. Here it is:

```js
'use strict';

module.exports = function(context, cb) {
	//first, gather the form fields
	console.log(context.body)
	let form = context.body;
	let errors = checkForm(context.body);

	if(errors.length) {
		cb(null, {% raw %}{status: false, errors:errors}{% endraw %});
	} else {
		// we'd also email the results here, or store them, or something
		cb(null, {% raw %}{status: true}{% endraw %});
	}
}

/* simple validation routine, returns an array of errors */
function checkForm(f) {
	let errors = [];
	if(!f.name || f.name.trim() === '') errors.push("Name required.");
	if(!f.email || f.email.trim() === '') errors.push("Email required.");
	// could add email validation here
	return errors;
}
```

In this webtask, I simply grab the form data (it is in `context.body`, and you can read more about the Context object in the [docs](https://webtask.io/docs/context)) and pass it to a function called checkForm. My form had three fields, but I only really care about two. If the validation fails (by returning anything in the array), I return a false status and the errors. Otherwise I return true and as the comment says, I'd probably email the form or store it somehow.

AC (<strike>Air Conditioning</strike>After Captcha)
===

Working with Google's reCaptcha involves three main steps:

* First, you get a key. Google has made that quite a bit easier now.
* Second, you add the [front end code](https://developers.google.com/recaptcha/docs/display). You've got multiple options on how to do that.
* Finally, you validate the reCaptcha on the server side.

To get your key, start here: http://www.google.com/recaptcha/admin. Note that you actually get *two* keys. 	

![Screen shot of keys](https://static.raymondcamden.com/images/2018/04/rec1.jpg)

The first key is used in the front end. The second key is used on the server side for validation.

Adding the captcha is pretty simple. Drop in a script tag and then add a div:

```html
<div class="g-recaptcha" data-sitekey="my site key is blah"></div>
```

By itself, this will create a hidden form field and when the user checks the captcha, it will fill in a key. If you are using a "regular" old server like ColdFusion, or even Node, then you would grab the value in the typical way you handle getting form values. However, in our case, we're using client-side code to POST to a serverless web hook, so we need to fetch the key manually. Here's the updated form (with a bit removed to cut down on size):

```html
<form id="infoForm" v-cloak>
	<p>
	<label for="name">Name:</label>
	<input type="text" v-model="name" id="name" required>
	</p>

	<p>
	<label for="email">Email:</label>
	<input type="email" v-model="email" id="email" required>
	</p>

	<p>
	<label for="url">URL:</label>
	<input type="url" v-model="url" id="url">
	</p>

	<div class="g-recaptcha" data-sitekey="6Ld5WlEUAAAAAJmHfUirSkYnsFk85br615KDYktz"></div>
	
	<p>
		<input type="submit" value="Send Info" @click.prevent="submitForm" :disabled="disabled">
	</p>

	<div v-if="errors.length">
		<p>
			<b>Please correct these errors:</b>
			<ul>
				<li v-for="error in errors">{% raw %}{{error}}{% endraw %}</li>
			</ul>
		</p>
	</div>
	<div v-if="formGood">
		<p>
			Thanks for filling out the form. We care a lot.
		</p>
	</div>
</form>

<script src='https://www.google.com/recaptcha/api.js?onload=onload'></script>
<script src="https://unpkg.com/vue"></script>
<script>
const taskEndpoint = 'https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.run.webtask.io/form_resp2';

let app = new Vue({
	el:'#infoForm',
	data() {
		return {
			name:null,
			email:null,
			url:null,
			errors:[],
			formGood:false,
			disabled:true
		}
	},
	methods:{
		enable() {
			this.disabled = false;
		},
		submitForm() {
			this.errors = [];
			this.formGood = false;
			fetch(taskEndpoint, {
				body:JSON.stringify({ 
					name:this.name,
					email:this.email,
					url:this.url,
					recaptcha:grecaptcha.getResponse()
				}),
				headers: {
					'content-type':'application/json'
				}, 
				method:'POST'
			})
			.then(res => res.json())
			.then(res => {
				console.log(res);
				if(res.status) {
					this.formGood = true;
				} else {
					this.errors = res.errors;
				}
			});
		}
	}
});

function onload() {
	app.enable();
}
</script>
```

Ok, so a few things. First, when I added the script tag, note the `onload` bit:

```html
<script src='https://www.google.com/recaptcha/api.js?onload=onload'></script>
```

This lets me listen for the load event for the captcha. I need this because I don't want users to submit the form until the captcha has had a chance to load. I added a new variable to my Vue instance that disables the submit button until that event fires. Basically `onload` just chains to `app.enable()` which toggles the value.

The next change is in my POST:

```js
body:JSON.stringify({ 
	name:this.name,
	email:this.email,
	url:this.url,
	recaptcha:grecaptcha.getResponse()
}),
```

You can see I'm using a global object, `grecaptcha` to get the value from the UI. This will either be blank (the evil user ignored it) or a long string. Here's how it looks:

![Screen shot of form with captcha](https://static.raymondcamden.com/images/2018/04/rec2.png)

Now let's look at the updated webtask:

```js
'use strict';

const request = require('request');

module.exports = function(context, cb) {
	//first, gather the form fields
	let form = context.body;
	
	checkForm(context.body, context.secrets.recaptcha)
	.then(result => {
		console.log('result was '+JSON.stringify(result.errors));		

		if(result.errors.length) {
			cb(null, {% raw %}{status: false, errors:result.errors}{% endraw %});
		} else {
			// we'd also email the results here, or store them, or something
			cb(null, {% raw %}{status: true}{% endraw %});
		}

	});

}

/* simple validation routine, returns an array of errors */
function checkForm(f, recaptchaKey) {
	return new Promise((resolve, reject) => {

		let errors = [];
		if(!f.name || f.name.trim() === '') errors.push("Name required.");
		if(!f.email || f.email.trim() === '') errors.push("Email required.");
		// could add email validation here

		request.post(' https://www.google.com/recaptcha/api/siteverify', {
			form:{
				secret:recaptchaKey,
				response:f.recaptcha
			}
		}, (err, resp, body) => {
			if(!JSON.parse(body).success) {
				errors.push('You did not fill out the recaptcha or resubmitted the form.');
			}
			resolve({% raw %}{errors:errors}{% endraw %});

		});

	});
}
```

The first major change is that checkForm is now asynchronous and returns a Promise. I did this because I knew I was going to be making a HTTP call to verify the key. I now pass that key, and the form, like so:

```js
checkForm(context.body, context.secrets.recaptcha)
```

What is `context.secrets.recaptcha`? Webtasks allow for [secrets](https://webtask.io/docs/editor/secrets) which are really useful for API keys. In my case, I simply set the key via the CLI: `wt create form_resp2.js --secret recaptcha=mykeywashere`. You can also set the key in the online editor. 

In `checkForm`, you can see where I do a simple POST to Google's verify end point. If anything goes wrong, I return a generic error (I could make this more precise) and then finally we resolve the array of errors. 

You can test this yourself here: https://cfjedimaster.github.io/Serverless-Examples/recaptcha/test2.html

And the full source code for both versions may be found here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/recaptcha

If you have any questions about this, just leave me a comment below!

<i>Header photo by <a href="https://unsplash.com/photos/yfgkWX-2vEA?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Steven Wei</a> on Unsplash</i>