---
layout: post
title: "Front-End Interview Questions – Part 4"
date: "2015-02-03T06:46:11+06:00"
categories: [development]
tags: [front-end-interview-questions]
banner_image: 
permalink: /2015/02/03/front-end-interview-questions-part-4
guid: 5635
---

This post is part of a series I’m writing where I attempt to answer, to the best of my ability, a set of <a href="https://github.com/h5bp/Front-end-Developer-Interview-Questions">Front-End developer questions</a>. I expect/hope my readers will disagree, augment, and generally hash out my answers in the comments below.

<strong>Can you describe the difference between progressive enhancement and graceful degradation?</strong>
Progressive enhancement refers to a feature of your web site that enhances the experience for browsers that support it, but has no impact if your browser does not. As an example - consider IndexedDB. It lets you store data in a client-side database. If my web site made use of Ajax to load a large amount of data, I could use IndexedDB to cache data. If your browser doesn't support IndexedDB, then we just do Ajax to load that data. Modern browsers get a benefit, older browsers don't get screwed.

On the flip side, graceful degradation takes that modern feature and acts as if it is the default, but will not completely break the older browser. So in this case, the use of IndexedDB would be considered "normal", not the additional benefit for the modern browser. 

In my opinion, it comes down to one side where you build for a certain base and provide additional, not-required features for better browsers (progressive enhancement) versus building for the more modern browser that assumes certain features, but assuring they "break" well.

<strong>How would you optimize a website's assets/resources?</strong>
I can think of a few things here.

First - I'd optimize my images. In the past, I've used a Grunt script for this which makes it brain dead easy. You can point to a set of images, specify an optimization level, run it, and check the output to ensure it still looks good. 

Another option for images is to use CSS sprites for related icons and the such. That reduces the network requests.

You can use a CDN that supports knowing and responding to a user's location to better serve up the assets.

For text files, you can minify, both CSS and JavaScript. For CSS, you can remove unused CSS (<a href="https://github.com/addyosmani/grunt-uncss">https://github.com/addyosmani/grunt-uncss</a>). 

I'm sure I missed a few more options here.

<strong>How many resources will a browser download from a given domain at a time?</strong>
I'm going to answer this <i>before</i> I check Google to confirm: 8.

Looks like I was wrong - kinda. I figured there was some variation per browser, but check this StackOverflow answer: <a href="http://stackoverflow.com/a/14768266/52160">http://stackoverflow.com/a/14768266/52160</a>. For Chrome it is 6, Firefox 6, IE11 is 8 though. I'd assume 6 then as a good average. Here is another good table on this stat: <a href="http://www.browserscope.org/?category=network&v=1">http://www.browserscope.org/?category=network&v=1</a>

<strong>What are the exceptions?</strong>
So the limits are per domain, so in theory, you could use a wildcard DNS where *.foo.com points to the same IP address. Seems like something I'd use with caution though. I think if you are at this point (of trying to get around the limit) then maybe you are doing a bit too much.