---
layout: post
title: "Adding Emotional Tone Analysis to Your Contact Form"
date: "2019-01-18"
categories: ["serverless","static sites"]
tags: ["javascript","watson"]
banner_image: /images/banners/tear.jpg
permalink: /2019/01/18/adding-emotional-tone-analysis-to-your-contact-form
---

A few days ago I [blogged](https://www.raymondcamden.com/2019/01/15/customized-form-handling-on-netlify-with-serverless-functions) about adding customized form handling to your static site at Netlify. This was done via a simple serverless function that listened for form submissions and used the [SendGrid](https://sendgrid.com/) API to send an email. While this works just fine, I actually had something more interesting in mind that I had to delay a bit. Imagine if instead of just getting emails about contact form submissions, you actually got something with a bit of a warning in terms of their content:

<img src="https://static.raymondcamden.com/images/2019/01/tone1.jpg" alt="Example of tone analysis in the subject of the email" class="imgborder imgcenter">

In the image above, you can see some basic information about the contents of the email based on their tone. This would be a great way to know what to prioritize in terms of reading and responding. To build this, I made use of the [IBM Watson Tone Analyzer](https://www.ibm.com/watson/services/tone-analyzer/) service. I've used this multiple times in the past with various serverless demos with OpenWhisk, but I thought I'd give it a shot with Netlify and Lambda. Here's the full script (and be sure to read the [last entry](https://www.raymondcamden.com/2019/01/15/customized-form-handling-on-netlify-with-serverless-functions) for context on how it works) with the new feature added:

```js
const helper = require('sendgrid').mail;
const SG_KEY = process.env.SENDGRID;

const axios = require('axios');

const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3')
const TA_KEY = process.env.TONEANALZYER;

exports.handler = async (event, context, callback) => {
	console.log('submission created error testing');
	
	let payload = JSON.parse(event.body).payload;
	let analysis = '';
	let toneString = '';

	//lets analyze the text
	
	if(payload.data.comments && payload.data.comments.length) {
		analysis = await analyze(payload.data.comments);

		/*
		if we get results, its an array of tones, ex:

		[ { score: 0.633327, tone_id: 'fear', tone_name: 'Fear' },
		{ score: 0.84639, tone_id: 'tentative', tone_name: 'Tentative' } ]

		So what we will do is create an analysis string based on tone_names where score > 0.5
		*/
		analysis = analysis.filter(t => t.score > 0.5);
		// and now we'll build an array of just tones
		let tones = analysis.map(t => t.tone_name);
		// and then a string
		toneString = tones.join(', ');
	} 

	// note - no validation - booooo
	let from_email = new helper.Email(payload.data.email);
	let to_email = new helper.Email('raymondcamden@gmail.com');
	let subject = 'Contact Form Submission';

	if(toneString.length > 0) subject += ` [Tone: ${toneString}]`;

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
		
	await sg.API(request, function(error, response) {
		if(error) {
			console.log(error.response.body);
		} else console.log(response);
	});
	console.log('And done...');
};

async function analyze(str) {
	console.log('going to tone analzye '+str);
	
	let toneAnalyzer = new ToneAnalyzerV3({
		username: 'apikey',
		password: TA_KEY,
		version: '2017-09-21',
		url: 'https://gateway.watsonplatform.net/tone-analyzer/api/'
	});

	const result = await new Promise((resolve, reject) => {
		toneAnalyzer.tone(
			{
				tone_input: str,
				content_type: 'text/plain'
			},
			function(err, tone) {
				if (err) {
					console.log(err);
					reject(err);
				} else {
					resolve(tone.document_tone.tones);
				}
			}
		);
	});
	return result;

}
```

Alright, let's break this down. First, I load in the [Watson Node.js SDK](https://www.npmjs.com/package/watson-developer-cloud). While this isn't necessary, I had issues using the REST API for Tone Analysis directly and decided to simply take the easy route out and use their package.

```js
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3')
const TA_KEY = process.env.TONEANALZYER;
```

Where does the `process.env.TONEANALZYER` key come from? Don't forget you can define custom environment variables for your Netlify sites.

<img src="https://static.raymondcamden.com/images/2019/01/tone2.jpg" alt="Example of Netlify's settings for build variables" class="imgborder imgcenter">

Next, let's see if we have data to check. In this case I'm assuming I've got a field called `comments` and it's a block of text. You can make this more generic, or even use hidden form fields as a way of saying what should be checked.

```js
let analysis = '';
let toneString = '';

//lets analyze the text
	
if(payload.data.comments && payload.data.comments.length) {
	analysis = await analyze(payload.data.comments);
```

Note the fancy use of `await`. As a warning, please note I'm still fumbling my way around `async/await`. Let's look at `analyze`:

```js
async function analyze(str) {
	console.log('going to tone analzye '+str);
	
	let toneAnalyzer = new ToneAnalyzerV3({
		username: 'apikey',
		password: TA_KEY,
		version: '2017-09-21',
		url: 'https://gateway.watsonplatform.net/tone-analyzer/api/'
	});

	const result = await new Promise((resolve, reject) => {
		toneAnalyzer.tone(
			{
				tone_input: str,
				content_type: 'text/plain'
			},
			function(err, tone) {
				if (err) {
					console.log(err);
					reject(err);
				} else {
					resolve(tone.document_tone.tones);
				}
			}
		);
	});
	return result;

}
```

This basically just wraps the call to the Tone Analyzer API and returns the result data. I kept this mostly generic. Now back to the caller:

```js
/*
if we get results, its an array of tones, ex:

[ { score: 0.633327, tone_id: 'fear', tone_name: 'Fear' },
{ score: 0.84639, tone_id: 'tentative', tone_name: 'Tentative' } ]

So what we will do is create an analysis string based on tone_names where score > 0.5
*/
analysis = analysis.filter(t => t.score > 0.5);
// and now we'll build an array of just tones
let tones = analysis.map(t => t.tone_name);
// and then a string
toneString = tones.join(', ');
```

As the comments say, you get an array of tones back and they do not appear to be sorted. I did a quick "quality" filter by removing tones with a score less than 0.5. That was arbitrary. I then map out just the name and finally make a string.

By the way, I'm 99% sure those three things could be done in one fancy line of JavaScript by someone who can work at Google. I don't work at Google.

The final bit is to simply add the tones if we got em:

```js
if(toneString.length > 0) subject += ` [Tone: ${toneString}]`;
```

And that's it! So let's have some fun with this. Warning, adult language incoming. If the adult language doesn't make sense to you, ask your kids.

```text
I AM SO FUCKING MAD AT YOU I WISH YOU WOULD DIE I HATE YOUR SERVICE.
I HATE EVERYTHING YOU DO.
I HATE KITTENS.
i HATE PUPPIES.
I HATE BEER.

OH MY GOD IM SO MAD AT EVERYTHING
```

This returned what you would expect: `Contact Form Submission [Tone: Anger]`

Now check this input:

```text
i'm so happy with your service, but i'm nervous that if i commit to a monthly payment i'll not actually make use of it enough to get value. can you give me some more details on what i get with this service and help convince me it's worth it?
```

While I know Watson isn't perfect, but wow, check the result: `Contact Form Submission [Tone: Tentative]` I'd consider that near perfect. 

You could imagine connecting this with some rules in your mail server such that customer service folks with a history of handling angry customers automatically get those emails, and so on. Anyway, let me know what you think by leaving a comment below. As a reminder, this is all being done via a so-called "static" site. Pretty damn impressive, right?

<i>Header photo by <a href="https://unsplash.com/photos/lQ1hJaV0yLM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Aliyah Jamous</a> on Unsplash</i>
