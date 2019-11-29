---
layout: post
title: "Another OpenWhisk Cron Example - the Blog Nag"
date: "2017-02-21T09:31:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: /images/banners/blognag.jpg
permalink: /2017/02/21/another-openwhisk-cron-example-the-blog-nag
---

Last week I [blogged](https://www.raymondcamden.com/2017/02/14/collecting-911-data-openwhisk-cron-triggers) about my first experience working with [OpenWhisk](https://developer.ibm.com/openwhisk/) triggers and rules, specifically the Cron trigger which lets you execute actions according to a schedule. Today I'm sharing another example, which, while not as complex as the 911 scraper, I thought was kind of fun. 

As a blogger, I try to keep to a certain amount of posts per month. While I a absolutely care more about quality than quantity, I still try to maintain a certain amount of content per month. I thought it would be fun to create an OpenWhisk action that would nag me if I hadn't blogged in a few days. This turned out to be rather simple:

* First, I get the RSS feed.
* Then I parse the XML. There's packages to read RSS, but there's also xml2js which just does a basic conversion.
* I can then check the date of the most recent article and compare it to now.
* If it's been too long, nag!

Let's start with the action:

<pre><code class="language-javascript">
const request = require(&#x27;request&#x27;);
const parseString = require(&#x27;xml2js&#x27;).parseString;

&#x2F;&#x2F;number of days you have till i bug you
const NAG_DAY = 2;

&#x2F;&#x2F;SendGrid API Key
const SG_KEY = &#x27;SG.whywontanyonecommentonthestuffiputhere&#x27;;
const helper = require(&#x27;sendgrid&#x27;).mail;

function doNag(last) {

	let from_email = new helper.Email(&#x27;raymondcamden@gmail.com&#x27;);
	let to_email = new helper.Email(&#x27;raymondcamden@gmail.com&#x27;);
	let subject = &#x27;You Need to Blog!&#x27;;

	let content = `
You have not blogged in the past ${% raw %}{NAG_DAY}{% endraw %} days!
Your last post was on ${% raw %}{last}{% endraw %}.
`
	let mailContent = new helper.Content(&#x27;text&#x2F;plain&#x27;, content);
	let mail = new helper.Mail(from_email, subject, to_email, mailContent);
	let sg = require(&#x27;sendgrid&#x27;)(SG_KEY);

	var request = sg.emptyRequest({
		method: &#x27;POST&#x27;,
		path: &#x27;&#x2F;v3&#x2F;mail&#x2F;send&#x27;,
		body: mail.toJSON()
	});
		
	sg.API(request, function(error, response) {
		if(error) {
			console.log(error.response.body);
		} else {
			&#x2F;&#x2F;right now we do nothing really
		}
	});
}

function main() {

	let rssurl = &#x27;http:&#x2F;&#x2F;feeds.feedburner.com&#x2F;raymondcamdensblog&#x27;;

	return new Promise((resolve, reject) =&gt; {

		request.get(rssurl, function(error, response, body) {
			if(error) return reject(error);

			parseString(body, function(err, result) {
				if(err) return reject(err);

				&#x2F;&#x2F;Latest post:
				let latest = result.rss.channel[0].item[0];
				&#x2F;&#x2F;now lets try to parse the date
				let latestDate = new Date(latest.pubDate[0]).getTime();
				&#x2F;&#x2F;alright then - so compare Now to latestDate
				let now = Date.now();
				&#x2F;&#x2F;difference is how much time (duh)
				let diff = now - latestDate;
				if(diff &gt; (NAG_DAY * 24 * 60 * 60 * 1000)) {
					console.log(&#x27;got to nag!&#x27;);
					doNag(latest.pubDate[0]);
					resolve({% raw %}{status:true}{% endraw %});
				} else {
					resolve({% raw %}{status:false}{% endraw %});
				}
			});

		});

	});
}

exports.main = main;
</code></pre>

Start with the `main` function which is OpenWhisk's entry point to the function. I use the request library to open up my RSS feed and then `parseString` from the xml2js library. I can then get the most recent blog entry (which is the first entry in a RSS feed) and make a date object with it. 

Once I have that - then it's math. I set the constant `NAG_DAY` to 2, which is a bit too low if you ask me, but I had blogged on Friday so I needed a value that would trigger the alert. (For folks curious, I try to blog once every 3 days.) If we need to nag, we then simply call `doNag`.

The `doNag` function just writes an email using the Sendgrid API and fires it out. And that's it. 

So then I had to make this "live" - which beforehand would have meant provisioning a server and all that, but with the wonders of Serverless (yes, I'm half-joking here ;) I just did the following:

* Sent the action up to OpenWhisk with the CLI (`wsk action create --kind nodejs:6 rssnag rssnag.zip`)
* Made the trigger (`wsk trigger create checkBlog --feed /whisk.system/alarms/alarm --param cron "* * 1 * *"`). That Cron value is for once a day, and yes I had to use http://crontab-generator.org again.
* Made the rule (`wsk rule create blogNagRule checkBlog rssnag`)

And that's it. To test I used the OpenWhisk UI on IBM Bluemix and manually triggered it. And the result....

![Email ftw](https://static.raymondcamden.com/images/2017/2/blognag1.png)