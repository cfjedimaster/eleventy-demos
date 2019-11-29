---
layout: post
title: "Front-End Interview Questions – Part 5"
date: "2015-04-10T13:02:13+06:00"
categories: [design,development,html5,javascript]
tags: []
banner_image: 
permalink: /2015/04/10/front-end-interview-questions-part-5
guid: 5992
---

Nearly two months to the day since my last post on this series, I'm finally starting it up again. I'll blame my new job for making me forget this for a while, but hopefully I can pick up steam again and finish all these darn questions.

<!--more-->

This post is part of a series I’m writing where I attempt to answer, to the best of my ability, a set of <a href="https://github.com/h5bp/Front-end-Developer-Interview-Questions">Front-End developer questions</a>. I expect/hope my readers will disagree, augment, and generally hash out my answers in the comments below.

<h4>Name 3 ways to decrease page load (perceived or actual load time).</h4>

Minimize images. I use <a href="https://github.com/gruntjs/grunt-contrib-imagemin">this grunt plugin</a> before to automate it and it worked great.

Minimize and combine JavaScript files. I haven't done this in grunt, but I'm sure plugins exist for that. The biggest issue I have with this is in development. How do I work on foo.js and goo.js such that I can test them in my browser, but in production, use all.min.js in my HTML code? That's a bit off topic I suppose, but the flip between "development mode" and "production mode" for a web application is not something I honestly have a good feel for yet.

Minimize, combine, and "prune" CSS files. By prune I mean find unused styles and remove them. Addy Omsani has a good blog post on <a href="http://addyosmani.com/blog/removing-unused-css/">removing unused CSS</a> and you can definitely automate this as well.

<h4>If you jumped on a project and they used tabs and you used spaces, what would you do?</h4>
I'd follow the project norm. I personally prefer tabs, but when working on a project, I'm going to follow the standards/guidelines/etc that everyone is following. If it was for something important and not cosmetic, I'd bring it up for discussion of course.

<h4>Describe how you would create a simple slideshow page.</h4>
Ok, two answers here. If jQuery was already being used, I'd probably find a good plugin. I feel kinda lame saying that - but - honestly - a client wants me to get the best tool for the job and would probably not want to pay me to rebuild something that has been done a thousand times over. 

Now - assuming the question really wants to know how I'd build one - this is what I'd do. I'd use simple markup to list my images. Let's say div tags. I'd wrap the entire list with one div, we'll call it slideshow. I'd use CSS to default them to hidden. Finally I'd use JavaScript to get the divs, store them as an array, and make the first one visible. I'd build some form of simple navigation (and "previous" and "next" button for example) such that clicking them shows/hides the appropriate image. This is probably a bit heavy as all the images are loaded at once. I'm kind of assuming though you aren't building a 90 image slide show. You could do it entirely via JavaScript. Store the images in an array and on load show the first one. (You could preload all the images, but if you do, then why not just do it in the DOM instead?) If the slide show was the main part of the page (and not just part of the rest of the page), I'd consider using hashes in the URL so someone could bookmark a particular image. (As an FYI, I actually built a mini slide show thing to demonstrate keypress events here: <a href="http://www.raymondcamden.com/2015/02/16/adding-keyboard-navigation-to-a-client-side-application">Adding keyboard navigation to a client-side application</a>)

<h4>What tools do you use to test your code's performance?</h4>
Primarily just the Network tools in my browser dev tools. I'm not making use of profiling yet so I don't have a good grasp on testing the performance of my JS in terms of how it acts on the page once it is loading. I guess you can say I've maybe got half the picture (getting crap to the browser), but need to get better and understanding the rest (how crap runs in the browser). 

I can share a story though about how I learned about network performance. Like most things learnt - it was by screwing up. I had an existing "Web 1.0" app (I don't really like that term but I think it makes sense to most of us) that I decided to update and make everything loaded via Ajax. This worked wonderfully until the content became so large that every page load was taking 4-5 seconds because of the size of the XML packets (yes, I used XML, I was still learning) going back and forth. It made me realize that just switching to Ajax doesn't suddenly make your network any less of a concern.