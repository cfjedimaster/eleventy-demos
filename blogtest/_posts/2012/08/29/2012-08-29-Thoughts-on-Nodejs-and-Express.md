---
layout: post
title: "Thoughts on Node.js and Express"
date: "2012-08-29T12:08:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2012/08/29/Thoughts-on-Nodejs-and-Express
guid: 4718
---

A while back I <a href="http://www.raymondcamden.com/index.cfm/2012/5/30/Seeing-the-light-at-the-end-of-the-Node">posted</a> about how I had begun to see Node in a new light. (Do folks refer to it as "just" Node or do you always include the JS at the end?) I had some time this week and decided to try building a real, if simple, application. Since I had plenty of data for my blog, I thought a simple blog viewer would be a good application to try building. Here are some random, scattered thoughts on what the process was like.
<!--more-->
First and foremost - I had decided to use <a href="http://expressjs.com/">Express</a> to build a web application. Express is a Node application framework specifically built for web applications. I had seen <a href="http://www.simb.net/category/technology/">Sim Bateman</a> demo this at cfObjective this year and it had looked pretty cool. What I liked right away is how I had complete control over how requests were handled. I was easily able to specify a folder for static crap, like CSS and JavaScript. I then could specify URLs and how to handle them. In ways this is a bit like ColdFusion's onRequestStart, but at a much deeper level. You get the ability to say, for example, when a request comes in for /ray/bio, run so and so code. But you can also easily add dynamic patterns as well. If I wanted to match /display/X where X was dynamic, I could set up the code easy enough and Express would automatically give me access to the dynamic portion as a variable. (Before I go any further - let me point out that I may confuse what Express gives you versus what is just plain there in Node. Please forgive me if I make that mistake.) 

Here is an example of all three above. From what I know, the patterns are checked in order of how I coded them. 

<script src="https://gist.github.com/3514408.js?file=gistfile1.js"></script>

As I said, the first block handles my static stuff. I've specified a folder called public and inside of there I'd place my CSS and JS files. Once I drop in a style file I'd address it by just pointing the URL to /public/style.css. 

The second block handles the home page request. Don't worry about "blog" just yet, I'll explain it in a bit. But basically, you can see that I'm calling for some data and then rendering it. (Again, more on that in a second.)

Finally - I added support for loading one particular blog entry. Note that I was able to precisely define a URL pattern of /entry/X. I could have done <i>anything</i> here at all. I love that freedom. To be clear, you can do the exact same in ColdFusion if you add in a URL rewriter like what's built into Apache. But I like having it right here in my application. It makes it a bit easier to mentally grasp what is going on in the application.  

If you visit my blog often, you know that I use a slightly slicker URL scheme. It took me then 5 minutes to add this to my application:

<script src="https://gist.github.com/3514509.js?file=gistfile1.js"></script>

Ok, so that's some examples of responding to URLs. I've got more coming up, but let's talk about something else - rendering the pages. I love JavaScript, but there is no way in heck I'm going to build out HTML views in JavaScript. As much as possible I've been trying to use templating engines lately. As I was researching, I discovered that a library called <a href="http://embeddedjs.com/">EJS</a> worked with Express. Hooking it up to Express was rather simple. I told my app I needed EJS and told Express to use it to parse HTML files. Honestly I don't 100% understand this portion, but it worked:

<script src="https://gist.github.com/3514561.js?file=gistfile1.js"></script>

If you look at the app.get("/") block above, you can see where I run res.render(). The first argument is the name of a template to run. By default this will be in a subdirectory called views. The second argument is data I'm passing to the view. Here is what home.html looks like - and remember - I did this very fast and kinda ugly. Normally you would have a bit more HTML in there:

<script src="https://gist.github.com/3514583.js?file=gistfile1.html"></script>

I am <i>not</i> a fan of the template syntax. Frankly it felt like I was writing classic ASP. That being said - it did work. Note that I'm doing a bit of work to create the fancy URL. EJS supports (I believe) writing your own helper functions. Normally I'd have built something to simplify that so that the view had much less logic in it. Just assume that as my first view I didn't write this as nicely as I would if given more time. As a comparison, here is the view for an individual blog entry:

<script src="https://gist.github.com/3514621.js?file=gistfile1.html"></script>

As I mentioned, I'm not really a fan of EJS. There are other alternatives. Right now I'm considering Dust, but as I ran into problems with that, I couldn't actually use it. 

Hopefully at this point you have a rough feel for how Express lets you handle requests and specify views to actually render them. Let's talk about the database layer. After I figured out how to do my views and pass parameters around, I needed to get database support. This is where I got to play around more with NPM. NPM, or the Node Package Manager, is an incredibly powerful tool and probably one of the main reasons Node is so popular. (Other platforms have similar support.) From the command line you can tell Node to get a package (think open source project focused on adding a particular feature) and install it to your system. You can also tell your application itself that it requires a package. So for example, my application needs Express and MySQL support. I can use a special file (package.json) to note these requirements, run one command, and all the supporting libraries just magically come in.

But... this isn't all rainbows and unicorns. When I decided to add RSS support to my application, I used NPM to search for an RSS library. If I remember right, about 30 or so packages showed up. I froze like a deer in headlights. Don't get me wrong, I like options, but I had absolutely no idea which one to pick. This is very much like the problem you may have with jQuery plugins. You can almost always count on jQuery having a plugin to do X, but finding out what the "best" one is can be a laborious process. I feel like I'm going to get some criticism on this, but I do wish people would keep this in mind when praising Node. For me, I picked the package with the name "rss" just because it had the simplest name. Luckily, the one I chose worked great. I was able to add RSS support soon after:

<script src="https://gist.github.com/3514834.js?file=gistfile1.js"></script>

But it didn't always work out well. I mentioned above that I tried to use another templating engine. The first one I tried, Dust, didn't work because it wasn't supported on Windows. That <i>really</i> surprised me. Shouldn't JavaScript work everywhere? To be fair, the reason the project wasn't supported on Windows was because the author didn't have an environment to test with (and he did the right thing then in marking it not supported), but I ended up getting stuck for a while.

So going back to database support, it turns out there are a few options for working with MySQL. Unfortunately, none of them really instilled a great deal of confidence in me. In fact, the solution I went with didn't even support bound parameters! Yes, you could use them in your code, and yes, your data would be escaped, but it wasn't truly using a bound parameter in its communication to the database. And frankly - as much as I like JavaScript, I'm not sure how much I'd trust a database library written in it. I haven't done any performance tests, but out of everything I did, this was the one area that gave me the most doubt. 

With all that being said, using MySQL was pretty easy. I began by just setting up the connection like so:

<script src="https://gist.github.com/3514788.js?file=gistfile1.js"></script>

I then created a module called blog that would handle my service layer. Since I had a "con" object that represented my database connection, I exposed an API where I could pass it in to the blog:

<script src="https://gist.github.com/3514798.js?file=gistfile1.js"></script>

Here then is my blog module. A 'real' blog engine would have quite a bit more of course but you get the idea.

<script src="https://gist.github.com/3514806.js?file=gistfile1.js"></script>

So what do I think? I love it. Once I got my environment running (and be sure to use <a href="https://github.com/remy/nodemon">nodemon</a> to make reloading automatic) I was able to rapidly build out a simple application. I loved the level of control I had over the request and how quick it was to get up and running. I didn't love the fact that the quality wasn't quite consistent across various modules. 

p.s. One more code snippet. I demonstrated the RSS support above. But I also built in a quick JSON view as well. It was incredibly difficult. Honest. This took me hours to write. (Heh...)

<script src="https://gist.github.com/3514933.js?file=gistfile1.js"></script>