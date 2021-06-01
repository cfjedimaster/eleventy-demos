---
layout: post
title: "Building a Google Sheets Twitter Bot with Pipedream"
date: "2020-04-27"
categories: ["serverless"]
tags: ["javascript","pipedream"]
banner_image: /images/banners/moon.jpg
permalink: /2020/04/27/building-a-google-sheets-twitter-bot-with-pipedream
description: Using Pipedream to create a Google Sheets-driven "random" Twitter Bot
---

This is something that's been kicking around my head for a week or so and today I thought I'd try it. It ended up taking about 20 minutes total and 10 lines of code, of which 5 are a function I copied and pasted. While what I built is kind of trivial, I'm blown away by how much was done by built-in functions with Pipedream and how little work I had to do myself. In fact, most of my time was spent in setting stuff up *outside* of Pipedream itself. Alright, so what did I build?

I've got a kind of fascination (ok, a problem) with building Twitter bots, especially those that share random content. Earlier this month I [created](https://www.raymondcamden.com/2020/04/02/building-a-twitter-bot-in-pipedream) a Twitter bot that uses Wikia APIs to scrape GI Joe content. One problem with my "random bots" is that, well, they're random, and I don't have full control over the data itself. It's possible there's something on the [GI Joe](https://gijoe.fandom.com/wiki/Joepedia_-_The_G.I._Joe_Wiki) wiki that I'm not aware of. And since it's a wiki, even if I check every single page now, in the future something may be added that I don't want my bot to pick up.

So I thought - what if the random bot was tied to content that I had full control over? Also - what if the content was in an easily editable form, something a non-developer could use. It occurred to me that Google Sheets could be great for this. With that in mind,  built [moonpicbot](https://twitter.com/moonpicbot). This is a bot that shares pictures of the moon driven by public domain NASA images. 

<blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">Triptych of the Moon <a href="https://t.co/VNCEcTwymp">pic.twitter.com/VNCEcTwymp</a></p>&mdash; moonpicbot (@moonpicbot) <a href="https://twitter.com/moonpicbot/status/1254852860564520960?ref_src=twsrc%5Etfw">April 27, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

While NASA may have an API (I'm pretty sure they do), I instead built a Google Sheet where I manually selected some pictures I thought were nice.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/moon1.png" alt="Google Sheet screenshot" class="lazyload imgborder imgcenter">
</p>

I then registered my bot which is mainly painless now that I've done it multiple, multiple times. ;)

With my data in place, I designed the following workflow in Pipedream:

1) Use a CRON trigger to schedule the tweets. Currently mine's once every two hours.
2) Connect and read my Google Sheet.
3) Select a random row.
4) Upload the image.
5) Tweet the text and the image.

Alright, here's comes the cool part. Pipedream handled steps 1, 2, 4, and 5. I've shown their CRON trigger before, but here's the Google Sheet action. I connected it to my app and pasted in the sheet ID:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/moon2.png" alt="Google Sheet step" class="lazyload imgborder imgcenter">
</p>

Make note of the range. My sheet uses two columns so my range goes from A2 in one corner (A1 is the header) to B999 in the other. That means if I ever have one thousand rows I'll need to edit the range. That will take about 5 seconds so I'm not concerned, and again, since I'm manually controlling the data for this bot, I'll know.

Step 3 is where I wrote code:

```js
async (event, steps) => {
	function getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
	}

	let selectedRow = steps.get_values.$return_value.values[getRandomIntInclusive(0,steps.get_values.$return_value.values.length-1)];
	this.image = 'https://' +selectedRow[0];
	this.text = selectedRow[1];
	// hard coded for now
	this.mimetype = 'image/jpeg';
}
```

That's a bit over ten lines of which about half is a function to handle getting the random value. I slightly modify the image to include https (the NASA site didn't have this) and hard code a mimetype.

And that's it. I'm done. I added a `upload_media_to_twitter` step and then a `post_tweet` step. I could share this sheet now with a non-technical user and they could control the bot as they see fit. You can see, and fork, the entire workflow here: <https://pipedream.com/@raymondcamden/random-moon-p_WxC9jR/edit>

<i>Header photo by <a href="https://unsplash.com/@sannisahil?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Sanni Sahil</a> on Unsplash</i>