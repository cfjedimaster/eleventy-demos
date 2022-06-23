---
layout: post
title: "Eleventy Hack/Tip/Possibly Bad Idea - Dynamic Theme Testing"
date: "2021-10-11T18:00:00"
categories: ["jamstack"]
tags: ["eleventy"]
banner_image: /images/banners/mask.jpg
permalink: /2021/10/11/eleventy-hacktippossibly-bad-idea-dynamic-theme-testing.html
description: How to test a new theme in an Eleventy site
---

As I've done every few years, I'm in the process of working on a new look for this blog. I figure it's going to take a while to get it set up properly. In the past I've simply made a copy of my site and worked there when I had free time, but today another idea occurred to me. As the title says, this *may* be a bad idea, but hey, it worked on my machine so surely I should share with everyone, right? 

<p>
<img data-src="https://static.raymondcamden.com/images/2021/10/surely.jpg" alt="Don't Call Me Surely" class="lazyload imgborder imgcenter">
</p>

The idea I had was to see if I could operate my site with two layouts. By default, Eleventy will use the `_includes` folder for included documents and layouts. You can specify a new folder for includes and for layouts if you wish. What I thought would be interesting was if I could use a completely new folder for my new theme and simply tell Eleventy to use it when I wanted to work on it.

The first step is to return a configuration object in your `.eleventy.js` file. I already had one where I did various things, but I wasn't returning an object. I added it like so:

```js
return {
	dir: {
		includes
	}
}
```

By the way, in the sample above I'm using the new(ish) JavaScript shorthand where if you are returning an object key and variable with the same name, you can skip the colon. So instead of `{ includes: includes }` you can just do `{ includes }`. I love you JavaScript, warts and all. 

To handle changing the value of `includes`, I used an environment variable and just checked for it before my return. Here's what I had initially:

```js
// Testing new layout
let includes = '_includes';
if(process.env.NEWTHEME) {
	includes = 'theme';
} 
return {
	dir: {
		includes
	}
}
```

I'm using WSL (Ubuntu), so I was able to test this like so:

```bash
NEWTHEME=youbetcha eleventy --serve
```

The value I used was completely arbitrary as I just check for the existence. This worked, but I noticed errors being thrown when Eleventy tried to parse `_includes` like "regular" files. Because I'm on the 1.0 beta, I was able to dynamically add to the ignores setting:

```js
// Testing new layout
let includes = '_includes';
if(process.env.NEWTHEME) {
	includes = 'theme';
	eleventyConfig.ignores.add('_includes');
} else eleventyConfig.ignores.add('theme');

return {
	dir: {
		includes
	}
}
```

Basically I flip what I'm ignoring. If you aren't on 1.0, you could manually add to your `.eleventyignore` file and manually remove it once done. 

This worked well (so far) and let me do some initial work on my new theme. I did run into some issues with ensuring I copied the themes assets so it's not quite as simple as described above, but for now I've got a way to keep blogging while also work on getting the new theme ready. As always, I'd love feedback/opinions/arguments on this so let me know what you think.

Photo by <a href="https://unsplash.com/@theonlynoonan?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">John Noonan</a> on <a href="https://unsplash.com/s/photos/mask?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  