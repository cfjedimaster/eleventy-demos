---
layout: post
title: "Sharing Your Movies with Pipedream and Letterboxd"
date: "2020-08-04"
categories: ["serverless","javascript"]
tags: ["pipedream"]
banner_image: /images/banners/theater_seats.jpg
permalink: /2020/08/04/sharing-your-movies-with-pipedream-and-letterboxd
description: How to use a Pipedream workflow to connect your movie watching to Twitter
---

I recently discovered [Letterboxd](https://letterboxd.com/) via a cool example of integrating it's data with Eleventy (["Show Off Your Letterboxd Film Diary with Eleventy"](https://smithtimmytim.com/blog/2020/create-a-film-diary-with-eleventy-and-letterboxd/)). Letterboxd is a site (and app) that lets you track the movies you've watched and give reviews and ratings. I'm a huge fan of [GoodReads](https://www.goodreads.com/) for keeping track of the books I've read and I'm going to give Letterboxd a try as well. My wife and I are both huge movie nerds so I thought it would be kind of cool to have a list of movies I've watched when the year finally ends. 

While there isn't a proper API yet (apparently it's in [beta now](https://letterboxd.com/api-beta/)), every account has an RSS feed setup. Here's mine: <https://letterboxd.com/raymondcamden/rss/>

While we all know what RSS looks like (ok, maybe it's just me), Letterboxd has quite a few extensions to the specification that provide additional data about your films. Here's one entry (which is all I've got for now - I've told the site about a bunch of old movies I've watched but have only "logged" one review so far):

```xml
<item>
<title>John Mulaney: Kid Gorgeous at Radio City, 2018 - ★★★★</title>
<link>https://letterboxd.com/raymondcamden/film/john-mulaney-kid-gorgeous-at-radio-city/</link>
<guid isPermaLink="false">letterboxd-watch-117795457</guid>
<pubDate>Wed, 5 Aug 2020 08:40:48 +1200</pubDate>
<letterboxd:watchedDate>2020-08-03</letterboxd:watchedDate>
<letterboxd:rewatch>No</letterboxd:rewatch>
<letterboxd:filmTitle>John Mulaney: Kid Gorgeous at Radio City</letterboxd:filmTitle>
<letterboxd:filmYear>2018</letterboxd:filmYear>
<letterboxd:memberRating>4.0</letterboxd:memberRating>
<description><![CDATA[ <p><img src="https://a.ltrbxd.com/resized/film-poster/4/5/0/3/1/5/450315-john-mulaney-kid-gorgeous-at-radio-city-0-500-0-750-crop.jpg?k=1f94664287"/></p> <p>Watched on Monday August 3, 2020.</p> ]]></description> <dc:creator>Raymond Camden</dc:creator>
</item>
```		

Everything with the `letterboxd:` prefix is a namespaced set of data that they've added to provide more information to the feed. Looking at this, and the blog entry I shared earlier, it occurred to me that it would be easy to build an integration between this and [Pipedream](https://pipedream.com). I got this working and you can see it below. 


<blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">I just watched John Mulaney: Kid Gorgeous at Radio City and rated it a 4.0. See my <br>review at <a href="https://t.co/4sPdaLTFeJ">https://t.co/4sPdaLTFeJ</a>.</p>&mdash; moonpicbot (@moonpicbot) <a href="https://twitter.com/moonpicbot/status/1290761974893219842?ref_src=twsrc%5Etfw">August 4, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Notice - when I "play" like this, I use one of my bot accounts, not my main account. If I continue to use Letterboxd I'll update my workflow to post to my main account. Alright, so how was this built?

The first step of my workflow was an RSS event source. I first wrote about Pipedream's [event sources](https://www.raymondcamden.com/2020/05/07/looking-at-pipedreams-event-sources) back in May. It's a powerful way to build workflows built on custom events. One of the events built in is an RSS feed parser that runs every fifteen minutes and on a new RSS entry will emit an event. With this as the source of my workflow I've got a serverless function that will execute automatically whenever I do a new movie review. (Well, within fifteen minutes.)

The next step was a custom Node step. I did two things in here. First, I wanted to get the URL of the image for the movie. In that blog entry I shared earlier, they used a npm package called [letterboxd](https://www.npmjs.com/package/letterboxd). This is a cool little package that abstracts away the complete logic of reading and parsing the RSS feed. But for me, the RSS feed was already parsed, I just needed the "find the image logic". 

I went to the GitHub repo, opened up [index.js](https://github.com/zaccolley/letterboxd/blob/master/index.js), and found the `getImage` function. I took the logic from there and incorporated it into my Node step:

```js
async (event, steps) => {
	const cheerio = require('cheerio');

	/*
	This logic taken from the https://github.com/zaccolley/letterboxd package. The package assumes it is doing
	all the network stuff and I just needed the image parsing part.
	*/
	getImage = function(description) {
		var $ = cheerio.load(description);

		// find the film poster and grab it's src
		var image = $('p img').attr('src');

		// if the film has no image return no object
		if (!image) {
			return false;
		}

		return {
			tiny: image.replace('-0-150-0-225-crop', '-0-35-0-50-crop'),
			small: image.replace('-0-150-0-225-crop', '-0-70-0-105-crop'),
			medium: image,
			large: image.replace('-0-150-0-225-crop', '-0-230-0-345-crop')
		};
	}

	let imgdata = getImage(steps.trigger.event.description);
	let text = `
I just watched ${steps.trigger.event['letterboxd:filmtitle']['#']} and rated it a ${steps.trigger.event["letterboxd:memberrating"]["#"]}. See my 
review at ${steps.trigger.event.link}.
	`;

	return {
		text, imgdata
	};

}
```

The second thing I did was to simply write up the text I wanted to tweet. I used the custom values from the RSS feed to get the title and rating.

By the way, make note of the use of [cheerio](https://www.npmjs.com/package/cheerio) package. This is an awesome implementation of jQuery on the server and works really darn well for cases where you need to parse HTML as a string. 

So at this point, I've got images (multiple to pick from) and text. My plan was to tweet with the image so to do that you first need to upload the image. I picked the pre-built `upload_media_to_twitter` step where all I did was plugin my URL param: `steps.parseEntry.$return_value.imgdata.medium`.

Lastly, I used the `post_tweet` step with two params: status was `steps.parseEntry.$return_value.text` and media ids was `steps.upload_media_to_twitter.$return_value`. 

And that's it. You can see the complete workflow here: <https://pipedream.com/@raymondcamden/letterboxd-to-twitter-p_V9CVvK/> As I mention every time, don't forget you can copy this workflow to your own Pipedream account and use it as you will. Enjoy!

<span>Photo by <a href="https://unsplash.com/@felixmooneeram?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Felix Mooneeram</a> on <a href="https://unsplash.com/s/photos/movie-theater?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>