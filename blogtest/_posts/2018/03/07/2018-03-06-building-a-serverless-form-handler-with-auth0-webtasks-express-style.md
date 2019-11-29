---
layout: post
title: "Building a Serverless Form Handler with Auth0 Webtasks - Express Style"
date: "2018-03-07"
categories: [serverless]
tags: [webtask]
banner_image: /images/banners/wtexpress1.jpg
permalink: /2018/03/07/building-a-serverless-form-handler-with-auth0-webtasks-express-style
---

A few days ago I [blogged](https://www.raymondcamden.com/2018/03/02/buidling-a-serverless-form-handler-with-webtask/) about creating a basic "form handling service" using [Auth0 Webtask](https://webtask.io/). When I showed this to one of my coworkers, he had commented that this was something he would normally have used Express for. Auth0 Webtask does support deploying Express apps, and it's rather easy to do so, but using Express in a serverless world feels... weird to me. It just doesn't seem like something I'd *want* to do, which means it was a perfect thing for me to *actually* do so I could see what it felt like. I've done that and you'll see the code below. How do I feel about it now that I'm done? Keep reading and I'll share.

Let's begin by taking a look at the code. I'm going to strip out part of it for space but the full version can be found in my GitHub repo that I'll link to at the end. 

```js
'use strict';

const app = new (require('express'))();
const wt = require('webtask-tools');
const bodyParser = require('body-parser');
const helper = require('sendgrid').mail;

const DEFAULT_FROM = 'raymond.camden@auth0.com';
const TO = 'raymond.camden@auth0.com';
const SUBJ = 'Stormtrooper Form Submission';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({% raw %}{extended:false}{% endraw %}));

app.get('/', function (req, res) {
    res.header('Content-Type', 'text/html');
    res.end(FORM_HTML);
});

app.post('/', function (req, res) {
	console.log('req.body', req.body);

	let form = req.body;

	let from = DEFAULT_FROM;
	let to = TO;

	//let the form specify a from
	if(form._from) {
		from = form['_from'];
	}

    let subject = SUBJ;

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

	sendEmail(to,from,subject,content, req.webtaskContext.secrets.sg_key)
	.then(() => {
       res.redirect(`${% raw %}{req.originalUrl}{% endraw %}/thanks`);
	}).catch(e => {
		// handle error
	});
    
});

app.get('/thanks', function (req, res) {
    res.header('Content-Type', 'text/html');
    res.end(THANKS_HTML);
});

module.exports = wt.fromExpress(app);

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

const FORM_HTML = `
big honkin' chunk of html here
`;

const THANKS_HTML = `
more html here
`;
```

So let's discuss this. One of the first and most obvious changes is that I'm loading in Express and defining routes. Previously my handler had one main entry point, but now I've got - technically - three of them. I've got a route for the initial form display, one for processing, and one for thanking the user. Because I'm embedding the form and thank you page into to the app as a whole, I also scaled back on the "dynamic-ness" of the form processing. This isn't a "generic" form processing service now, but instead an app meant to display one form, process it, and thank the user. 

In order to handle my two static views, I've embedded the HTML in strings at the bottom of the page. In the listing above I've removed them for space, but it's basically the same HTML I used in the previous demo. (The only change is the URL in the form action.) I'm not crazy about embedding the templates like that, but for now, it's the best option. (And in theory, you could get a bit fancy with this. You could have them as separate files and simply use a build script to generate the final file and deploy that to Webtask.io.) 

The other big change is that I have to handle reading my form data myself - but Express makes that easy. I added in `bodyParser` and then refer to `req.body` in my post handler. 

Finally, the last bit that tricked me up was the redirect to thanks. I originally had this:

	res.redirect(`/thanks`);

But this sent me to my host Webtask.io domain *without* the prefix of the webtask name. In my case, I'd go from https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.run.webtask.io/form_handler_express to https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.run.webtask.io/thanks which gave me a 404. Thankfully I work with people far smarter than me and they helped me out with the `req.originalUrl` bit. (Thank you Olaf and Geoff!)

My deployment command is also slightly different:

	wt create form_handler_express.js --no-parse --no-merge --secret sg_key=mykeyismoresecretthanyours --dependency sendgrid

Specifically note the `--no-parse --no-merge` aspect. There's another way to handle this [documented](https://webtask.io/docs/model) in the webtask "custom program models" page and that's an aspect I want to touch on more deeply later.

If you want to see the full source code, you can view it here: https://github.com/cfjedimaster/Serverless-Examples/blob/master/webtask/form_handler_express.js. Don't forget that the webtask CLI let's you create a task based on a URL. If you've got the CLI installed and configured with your credentials, you could make your own copy and then edit it in the online editor. You will need your own Sendgrid key of course.

Ok, so I promised up top I'd share what I thought. I'm... torn. :) While I still don't think I'd go for Express initially when working with serverless, I do like how I have my app "tied" together like this. In the scenario of needing to build a form and not needing a 'generic' service, I think Express worked really well here. Some code for the view - some code for the processing. 

<i>Header photo by <a href="https://unsplash.com/photos/oxjo1IQBK7M?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Matt Jones</a> on Unsplash</i>