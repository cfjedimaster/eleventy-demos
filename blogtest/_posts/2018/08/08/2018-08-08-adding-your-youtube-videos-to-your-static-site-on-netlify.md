---
layout: post
title: "Adding Your YouTube Videos to Your Static Site on Netlify"
date: "2018-08-08"
categories: ["javascript","static sites"]
tags: []
banner_image: /images/banners/yt-video-list.jpg
permalink: /2018/08/08/adding-your-youtube-videos-to-your-static-site-on-netlify
---

Earlier this month I wrote up a blog post demonstrating how to use client-side JavaScript to render a list of your YouTube videos on your site (["Adding Your YouTube Videos to Your Static Site with Vue.js"](https://www.raymondcamden.com/2018/08/01/adding-your-youtube-videos-to-your-static-site-with-vuejs)). This works well and didn't use any "fancy" JavaScript that would be problematic for older browser (ok technically `fetch` is a bit modern but you could have replaced that with any other HTTP call) but I was curious to see if there was a way to do within my static site built with [Jekyll](https://jekyllrb.com/).

While it would be possible to build a plugin to do HTTP calls to generate output, I didn't want to pursue this route because, well, Ruby, and then I remembered something [Phil Hawksworth](https://www.hawksworx.com/) had demonstrated a while back. Phil is a developer advocate for [Netlify](https://www.netlify.com/), the service I use to host and deploy this site. I've raved about them often on this blog (and on Twitter) so I'm somewhat of a fanboy. Phil wrote up a great article about how he added comments to his static site: [Adding a Static Comments System to My Jekyll Build](https://www.hawksworx.com/blog/adding-a-static-comments-system-to-my-jekyll-build/).

His idea was pretty brilliant. He wrote a Gulp script to get his comment data via a simple API, wrote it out to a Jekyll data file, and then when his site is built the data file is used to drive the content for his comments. Netlify lets you specify a build command when deploying and normally I just use `jekyll`, but by using a Gulp script, you could do a lot more.

Here is a quick example of this in action. I did *not* do this for my own site as I was a bit chicken, so I simply generated a default new blog for Jekyll at the command line. Next, I wrote my Gulp script. (I haven't written Gulp scripts in years, so forgive any mistakes. Anything here good is from Phil's original script.)

```js
var gulp        = require('gulp');
var gutil       = require('gulp-util');
var shell       = require('gulp-shell');
var yaml        = require('json2yaml');
var fs          = require('fs');
var runSequence = require('run-sequence')

var paths = {
	source:'site/',
	deploy: 'site/dist'
};

// build jekyll
gulp.task('jekyll', function() {
	return gulp.src('', {quiet: false})
	.pipe(shell([
		'rm -rf ' + paths.deploy,
		'jekyll build -s '+paths.source + ' -d '+paths.deploy
	]));
});

// Get YT videos
gulp.task("get:videos", function() {

	console.log("Getting YT videos");
	//rss url for your videos
	const url = 'https://www.youtube.com/feeds/videos.xml?channel_id=UC8KROrnEHSnnV3z5J_FoSIg';

	let Parser = require('rss-parser');
	let parser = new Parser();

	let videos = [];

	(async () => {
		let feed = await parser.parseURL(url);
	
		feed.items.forEach(item => {
			//create a videoId from id
			item.videoId = item.id.split(":").pop();
			videos.push(item);
		});

        let ymlText = yaml.stringify(videos);

		fs.writeFile('./site/_data/videos.yml', ymlText, function(err) {
			if(err) {
				console.log(err);
			} else {
				console.log("Video data saved.");
			}
		});

	})();

});

gulp.task('build', function(callback) {
  runSequence(
    'get:videos',
    'jekyll',
    callback
  );
});

// The default task.
gulp.task('default', ['build']);
```

The important bit here is the `get:videos` task. I use a RSS parser from npm called, wait for it, `rss-parser`, which worked well except it didn't seem to pick up one of the properties my own code did in the [client-side version](https://www.raymondcamden.com/2018/08/01/adding-your-youtube-videos-to-your-static-site-with-vuejs), specifically `videoId` which is used in the embed. Luckily I could get it manually as you see here:

```js
//create a videoId from id
item.videoId = item.id.split(":").pop();
```

I especially like how easy it was to output YAML for Jekyll:

```js
let ymlText = yaml.stringify(videos);
```

Once it's written out as a data file then it's easy to use in a template:

{% raw %}
```markup
---
layout: page
title: Videos
permalink: /videos/
---

{% for video in site.data.videos %}

<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/{{video.videoId}}?autoplay=0&origin=http://example.com" frameborder="0"></iframe>

{% endfor %}
```
{% endraw %}

The final step is specify the gulp task in my Netlify settings for my site:

<img src="https://static.raymondcamden.com/images/2018/08/netlify1.jpg" alt="Netlify settings" class="imgborder">

And that's it! If you want to actually see this, you can view the live site here: <https://fervent-beaver-e5dc28.netlify.com/videos/>. The source code for this demo is here: <https://github.com/cfjedimaster/jekyllnetlifydemo>