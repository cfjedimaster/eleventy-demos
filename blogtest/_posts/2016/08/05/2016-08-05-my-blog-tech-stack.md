---
layout: post
title: "My Blog Tech Stack"
date: "2016-08-05T08:34:00-07:00"
categories: [static sites]
tags: []
banner_image: /images/banners/blog_stack.jpg
permalink: /2016/08/05/my-blog-tech-stack
---

I've been running my blog as a static site for a little over half a year now and I thought it would be interesting to share what my current setup is. I've already talked about how I'm using [Hugo](http://gohugo.io/), but I've got a *lot* of little tweaks/hacks/etc that I think may be of interest to folks considering switching to a static site generator. To be clear, my use case is probably *far* from the norm, but as a real world example, I think discussing it could be useful. I also want to be clear that all the little hacks and tweaks were built to specifically fit my needs. I don't believe it would make sense for everyone. Ok, ready to go down the rabbit hole?

Before we begin - some stats. My blog has over 5,500 entries covering thirteen years of blogging. I've received over 50,000 comments and get about 125,000 to 150,000 page views per month.

My Local Environment
===

As I said - step one in my stack is Hugo. Hugo isn't my favorite SSG. Don't get me wrong - I dig it! My favorite is [Jekyll](http://jekyllrb.com/), but I wasn't able to get the performance I needed with my content. If I remember right, I saw compilation times of around 6 minutes. Totally unacceptable for my site. For Hugo, it was still a bit slow, around 70 seconds, but much better than Jekyll. 

In order to improve that, I did a couple of things.

I began by figuring out that some actions caused Hugo to regenerate every single page. So for example, editing a post impacts the number of posts, categories, and tags, and my default theme included a post count, tag cloud, and tag count. It included a few things like this. I removed them one by one, but didn't really get a good performance boost. (I've slowly added them back - like the post count.) 

I also removed pagination, since having 500+ pages of pagination is a bit silly. I added it back in a few weeks ago and described how I did so: [Adding (Limited) Pagination to Hugo](https://www.raymondcamden.com/2016/05/31/adding-limited-pagination-to-hugo/)

Then I realized I could simply modify my config to tell Hugo to ignore content. I built a new config called config_dev.toml and added this:

<pre><code class="language-markup">
ignoreFiles = ["post/2003", "post/2004", "post/2005", "post/2006", "post/2007", "post/2008", "post/2009", "post/2010", "post/2011", "post/2012", "post/2013", "post/2014"]
</code></pre>

This tells Hugo to ignore nearly 90% of my content. It speeds things up quite a bit. As far as I know, you can't do that in Jekyll. There's a setting to restrict the maximum number of posts, but I'm not sure what order that uses so it's not something I considered. With this in place, Hugo regenerates my site (well a portion of it) in about one second. The "real" build of all the content only takes about 40 seconds and I only worry about that when I deploy.

In order to use this custom configuration, I wrote a script, starthugo, to handle it:

<pre><code class="language-markup">
#!/bin/bash
hugo server --config="config_dev.toml"
</code></pre>

Why did I write a script just to handle passing an attribute? Because my memory is crap. Utter - complete - crap. I promise you that if I didn't have this script I'd need to check the CLI help for Hugo everytime I started up. 

Speaking of command lines - there's a bug in Hugo on Mac, or a bug on the Mac, involving having a large number of files open. This is a known issue (and again, I believe it is more a Mac issue than Hugo), and it is fixable via running some obscure OSX commands. I wrote up *another* script called fixmac.sh for this:

<pre><code class="language-markup">
#!/bin/bash
sysctl -w kern.maxfiles=65536
sysctl -w kern.maxfilesperproc=65536
ulimit -n 65536 65536
echo "Done"
</code></pre>

So whenever I reboot my machine, I open up iTerm and run <code>sudo ./fixmac.sh</code> and then <code>./starthugo</code>. I reboot maybe once a week so this isn't a big deal. I could probably make the stuff in fixmac.sh permanent, but I've not been motivated enough yet to do so. 

But wait - we aren't done with the scripts yet! Hugo supports the ability to quickly create new content via the <code>[hugo new](http://gohugo.io/commands/hugo_new/)</code> command. But while this worked ok, I still found myself doing additional work (outside of writing the blog entry of course) to get my file prepared for publication. I decided to write my own tool, a Node.js script, that would make this simpler. I called this genpos.js and at the CLI I can do this:

<code>./genpos.js "My Blog Tech Stack"</code>

My script handles creating a path based on the current date. It also creates a proper URL slug based on the title. Here it is - and get ready - this is some butt ugly Node.js code.

<pre><code class="language-javascript">
#!/usr/bin/env node
var fs = require('fs');
if(process.argv.length != 3) {
	console.log('Usage: genpos TITLE');
	process.exit(1);
}

var title = process.argv[2];

var now = new Date();
var year = now.getFullYear();
var month = String(now.getMonth()+1);
if(month.length == 1) month = '0' + month;
var day = String(now.getDate());
if(day.length == 1) day = '0' + day;

//2016-02-01T12:12:24-07:00
var hour = String(now.getHours());
if(hour.length == 1) hour = '0'+hour;
var minute = String(now.getMinutes());
if(minute.length == 1) minute = '0'+minute;
var date = year + '-'+month+'-'+day+'T'+hour+':'+minute+':00-07:00';

var slug = title.replace(/ /g,'-').toLowerCase();
//remove multiple -
slug = slug.replace(/-{% raw %}{2,}{% endraw %}/,'-');
//remove non alnum
//slug = slug.replace(/[^A-Za-z\-]+/g,'');
slug = slug.replace(/[^\w\-]+/g,'');

//default template
var template = `
{
	"title": "${% raw %}{title}{% endraw %}",
	"date": "${% raw %}{date}{% endraw %}",
	"categories": [
		"Uncategorized"
	],
	"tags": [],
	"url": "/${% raw %}{year}{% endraw %}/${% raw %}{month}{% endraw %}/${% raw %}{day}{% endraw %}/${% raw %}{slug}{% endraw %}"
}`;

//console.log(template);

//Try to make the folder
var path = './content/post/'+year+'/';
//console.log(path);
try {
	fs.accessSync(path,fs.F_OK);
} catch(e) {
	if(e.errno === -2) {
		fs.mkdirSync(path);
	}
}

path = './content/post/'+year+'/'+month+'/';
try {
	fs.accessSync(path,fs.F_OK);
} catch(e) {
	if(e.errno === -2) {
		fs.mkdirSync(path);
	}
}

path = './content/post/'+year+'/'+month+'/'+day;
try {
	fs.accessSync(path,fs.F_OK);
} catch(e) {
	if(e.errno === -2) {
		fs.mkdirSync(path);
	}
}

var fileName = slug + '.md';
fs.writeFileSync(path+'/'+fileName, template,'utf8');

console.log('Created '+path+'/'+fileName);
</code></pre>

Yeah, not pretty, but it works. Pretty much the only thing I tweak (outside of the actual article text) are my categories and tags.

Deployment - Part 1
===

Alright - now for the fun part - deployment. I use [Surge](https://surge.sh/) to both handle the physical moving of files and hosting. I [pay](https://surge.sh/pricing) for Surge Plus (13 bucks a month) specifically to get custom SSL and custom redirects. I went into more detail about the https process here: [How I added https to my blog](https://www.raymondcamden.com/2016/04/15/how-i-added-https-to-my-blog/). I wrapped up the Hugo compilation and Surge deploy in yet another simpe script, build.sh:

<pre><code class="language-markup">
#!/bin/bash
echo "Running Hugo..."
hugo
echo "Running Surge..."
surge -p /Users/raymondcamden/Dropbox/websites/2016.raymondcamden.com/hugo_dynamic/public
</code></pre>

Currently this is the slowest part of my process. Surge takes about 5-6 minutes to deploy to the server. It was about twice that, and thats when I figured out that I could about 60% of my content (images and attachments) to S3.

Deployment - Part 2
===

So Surge handles my blog files, but not my media or demos. For that - I decided to use static hosting with Amazon S3 and CloudFront. Initially it was just S3, but you need to use CloudFront for https. The S3 part was simple. I just use a FTP tool to upload new images for a blog post. (And not every post has pictures.) The CloudFront part was confusing as heck, but I got it working, and the only issue I run into there is when I need to clear the cache. You have to create an "invalidation" of the asset and it can take five to ten minutes to clear. There's good reasons for all this of course, but in general, I try to avoid screwing up what I send to S3 and if I do, sometimes I'll just upload a fix with a new name.

My Amazon bill averages about 10-15 cents per month. I think I can handle that. 

So the end result is two servers - www.raymondcamden.com being run by Surge and static.raymondcamden.com being run by Amazon. Surge has not been perfect. About two months ago a DCMA sent by the NRA shut down the *entire* Surge network, including my blog. (["NRA Complaint Takes Down 38,000 Websites"](http://motherboard.vice.com/read/nra-complaint-takes-down-38000-websites)) The Surge folks worked their butts off to get it corrected and frankly I think they could fix issues like this much quicker than I could diagnose MySQL and PHP issues on my last blog engine. Ditto for anything going wrong with S3.

But wait - there's more
===

For the final bits - here's a few more things I use to blog - although not necessarily part of the stack.

* I use [Visual Studio Code](https://code.visualstudio.com/) for nearly all of my development now. I've added some snippets specifically related to my blog to make it quicker to add images and code snippets. I could also easily deploy from Code but that didn't occur to me till just now. I'll add that just because it will be fun. 

* I use Disqus for comments. In general, this is a great service, although I went through a lot of trouble when I migrated to it. Also, Disqus is a bit weird in it's admin. I just realized that I can't get a *current* count of the total number of comments. That seems stupid. Surely I'm just missing it. 

* I use [Buffer](https://buffer.com) to schedule tweets about my posts. It has a nice Chrome extension to make this easy to use. They have a paid tier, and it looks good, but I'm cheap so I stick to the free level. But it is a pretty cool service and I recommend it.

* I use [Adobe Post](https://spark.adobe.com/about/post) to create blog graphics. This is a kick ass visual design tool that makes even a developer like myself look good. Initially it was just an iPhone app, but they now support web and iPad. One nit with them: They have a super lame rule that says you must include their watermark on your items unless you share at least one post online. For me, this didn't make sense. I'm creating blog headers - not items just for a tweet. There is a *long* support thread about this. Most folks feel that if they pay for the service then it should be easier to remove. And other folks, like myself, feel like if you just require one share, why not just remove it altogether? That being said - it is a small annoyance and nothing more. 

* Even though I don't worry about my blog being up, I use [Uptime Robot](http://uptimerobot.com/), a free service that monitors web sites and can contact you as soon as something goes wrong. It gives me that extra layer of comfort that helps me sleep at night. 

* My contact form is driven by [Formspree](https://formspree.io/), a simple service for handling form submissions with static sites.

* Search is done via a Google Custom Search Engine. I detailed the process here: [How I added search to my static blog](https://www.raymondcamden.com/2016/03/07/how-i-added-search-to-my-static-blog/)

Really - that's it
===

So... yeah. For "simple", my little blog here isn't quite so simple. But here's the thing. I moved my complexity from a server that the public sees to my local machine. I fine tuned my process to *exactly* what I like and when my content leaves my laptop, I don't have to worry. (Ok, yes, my site can go down as I described above, but it wasn't my job to fix it.) Phil Hawksworth makes this point in the [video](https://www.youtube.com/watch?v=_cuZcnJIjls) on static sites I linked to yesterday. I'd rather have the complex bits here with me as opposed to out in the public where it can fail - well - publicly. ;)