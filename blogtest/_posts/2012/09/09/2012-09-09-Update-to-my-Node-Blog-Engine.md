---
layout: post
title: "Update to my Node Blog Engine"
date: "2012-09-09T16:09:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2012/09/09/Update-to-my-Node-Blog-Engine
guid: 4726
---

Just a quick Sunday post (mainly so I can avoid stressing over my Saints). A week or so I <a href="http://www.raymondcamden.com/index.cfm/2012/8/29/Thoughts-on-Nodejs-and-Express">posted</a> about my first attempt to build a "real" Node.js app with Express. My goal was to build a simple front end to my blog database. This gave me a simple enough application to learn Node/Express as well as plenty of data. I've been able to update the application quite a bit and I thought I'd share what I've done. As before, please do not consider this <b>best pratice</b> Node.js/Express development. I'm still <i>very</i> early in my Node education.
<!--more-->
One of the first changes I've been able to make is with my view engine. I mentioned in the previous blog post how I wasn't a fan of the syntax that EJS used. As a reminder, here is what it looks like:

<script src="https://gist.github.com/3514583.js?file=gistfile1.html"></script>

I was able to switch my view engine to one that made use of Handlebars. The node package <a href="https://github.com/donpark/hbs">hbs</a> allows you to use you Handlebars in your HTML templates. So the above becomes something a bit nicer:

<script src="https://gist.github.com/3686699.js?file=gistfile1.html"></script>

To be fair to EJS, I also added a helper function "bloglink" to simplify the creation of the SES-style link. To make my application even more stylish (heh), I added a layout.html to my views page. This automatically wraps my views:

<script src="https://gist.github.com/3686706.js?file=gistfile1.html"></script>

Obviously that isn't a full template, but it gives you a basic idea. Two things I want to call out here. Three things actually.

First, note the use of {% raw %}{{{body}}{% endraw %}}. This is where the previously rendered view will be inserted.

Second, note the use of {% raw %}{{title}}{% endraw %} on top. As long as I set a title value when rendering my view, this will be picked up and used, so for example, check out the code that renders a blog entry:

<script src="https://gist.github.com/3686719.js?file=gistfile1.js"></script>

See the third argument passed to render? That's where I supported a dynamic title for a blog entry. 

Finally - note the CSS link. Don't forget Express makes it easy to set up a folder of static stuff your application can use. Things like CSS files and JavaScript libraries. Here's how I did it:

<script src="https://gist.github.com/3686735.js?file=gistfile1.js"></script>

So to me - being able to use Handlebars is huge. I'm a lot more comfortable with it than EJS and I found myself being a lot more productive as I built out the application. Excitement is a good thing, I think. 

I made a few more changes that I want to share. As I mentioned in my previous post, app.js is the core application file for your Node.js file. It certainly isn't your only file, but it's the critical top level commander of everything your site does. With that being said, I have this feeling that I should keep things as clean as possible. 

As an example, I built a utility library that would let me define Handlebars helpers (think formatting functions). This kept my app.js a bit cleaner. Here is the current version of it with a grand total of one helper now. I'll add more later.

<script src="https://gist.github.com/3686750.js?file=gistfile1.js"></script>

My app.js then can be a bit simpler:

<script src="https://gist.github.com/3686755.js?file=gistfile1.js"></script>

Finally, I also removed the custom RSS code from app.js. I moved it into my blog library instead. This is how it looks in app.js (and it's a good 1/5th the size):

<script src="https://gist.github.com/3686762.js?file=gistfile1.js"></script>

For folks who want to see the complete code base, I've attached it below. Obviously you need data, and if anyone wants some sample data from my blog, just ask.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2012%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fblog%{% endraw %}2Ezip'>Download attached file.</a></p>