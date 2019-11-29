---
layout: post
title: "Using Generators with Harp"
date: "2015-08-25T00:58:32+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2015/08/25/using-generators-with-harp
guid: 6692
---

I've blogged (and presented) on <a href="http://www.harpjs.com">Harp</a> before as well as <a href="http://jekyllrb.com">Jekyll</a>. In general, I think Harp is much simpler to use, but Jekyll is more powerful. One of the ways Jekyll surpasses Harp is with <a href="http://jekyllrb.com/docs/plugins/#generators">generators</a>. This is a script you can write that automates the creation of files during the generation phase. I blogged about this a few months back (<a href="http://www.raymondcamden.com/2015/03/05/my-experience-working-with-jekyll">My experience working with Jekyll</a>), but in case you don't feel like reading the entire blog post, let me explain what problem a generator can solve.

<!--more-->

Most static site generators have a one to one mapping between the templates and final pages on your site. So I may have about.handlebars, for example, that maps to about.html when the site is generated. Your generator may create about.html by taking about.handlebars, layout.whatever, and various includes, but you have at minimum one file associated with one URL.

This works fine except in a few cases. Categories is a great example of this. If you want to represent categories in your static site, you'll need to create one file for each category, so for example: bluemix.handlebars, phonegap.handlebars, kittens.handlebars. You'll probably include the exact same code in each (or better yet, use an include), but the point is you need to create a physical file for each item. 

This isn't horrible, and to be honest, you probably don't want to willy nilly change categories (or tags, or topics, etc) on the fly, but it is kind of a pain to remember to have to update these files. As I wrote about in the other blog post, Jekyll resolves this problem by letting you use a generator. I was able to use Ruby to look at my data and create category pages on the fly.

I was thinking about this in regards to Harp recently and it occurred to me that there was a rather simple way for me to get the same behavior. I tend to think of Node.js in terms of web apps/site, but you can also use Node.js for simple scripts. Yeah, everyone else knows this, I know this, I just don't <i>think</i> about it very often. So given that I'm using Harp and have my data available in a JSON file, there's no reason why I can't use a simple Node.js script to do much of the same stuff Jekyll's generators do. It won't be automatic, in other words I have to run it manually, but I could make it part of a build script (Grunt, Gulp, etc) so I can automate the entire thing.

Here is a real example. In my test, I was working on a Harp version of <a href="http://www.cflib.org">CFLib</a>. It has various categories that I've encoded into JSON:

<pre><code class="language-javascript">{
	"CMFLLib":{
		"desc":"A library that mimics CFML tags. This allows for CFML tags inside of cfscript. This is primarily a CFMX only library."
	},
	"DataManipulationLib":{
		"desc":"DataManipulationLib is a ColdFusion UDF library containing data manipulation functions. This is a general purpose data \"munging\" type library."
	},
	"DatabaseLib":{
		"desc":"A library containing database specific functions (written in CFML), organized by DB platform."
	},
	"DateLib":{
		"desc":"This library is for date/time related function. Specifically, items that work on date or time based objects."
	},
	"FileSysLib":{
		"desc":"FileSysLib is a ColdFusion UDF library containing functions that interact with the file system at various levels. These levels typically include drives, directories, and files."
	},
	"FinancialLib":{
		"desc":"This library contains a set of UDFs that support financial type operations, including things like loan and interest calculations."
	},
	"MathLib":{
		"desc":"A set of mathematical functions. This includes geometry, trig, statistical, and general math functions. These functions typically perform calculations."
	},
	"NetLib":{
		"desc":"A library for Internet related UDFs. This library includes UDFs that retrieve pages from web servers, translate host addresses, and other operations related to Internet operations."
	},
	"ScienceLib":{
		"desc":"A set of UDFs dedicated to scientific equations. This includes weather, astronomy, and other science fields."
	},
	"SecurityLib":{
		"desc":"A set of security related functions."
	},
	"StrLib":{
		"desc":"StrLib is a ColdFusion UDF library containing string (parsing, formatting) functions not included in the core CFML language. These functions typically will translate/verify strings."
	},
	"UtilityLib":{
		"desc":"A set of utility functions for dealing with miscellaneous tasks such as state management, etc."
	}
}</code></pre>

I'm using this data on the front page to dynamically list out libraries. But I can also use it in a Node.js script:

<pre><code class="language-javascript">var fs = require("fs");

console.log("Generating libraries");
var libs = require("../public/library/_data.json");

var libraryTemplate = fs.readFileSync(__dirname+"/templates/library.html", "utf8");

for(var key in libs) {
	var newFile = __dirname+"/../public/library/"+key+".ejs";
	var data = libraryTemplate;
	console.log("Creating "+newFile);
	fs.writeFileSync(newFile, libraryTemplate);
}</code></pre>

So all this does is read in my JSON, read in a template I built to represent a specific library page, and then write it out in physical files so Harp can use it when generating the site. In my case, my template is just an include:

<pre><code class="language-markup">&lt;{% raw %}%- partial("_library.ejs") %{% endraw %}&gt;</code></pre>

In which I've built in the code to handle generating a library display. Yeah, so this is pretty obvious, and I'm pretty sure some Harp users are already doing this, but I thought it was kind of neat, and it made me re-evaluate when I'd use Harp compared to Jekyll. (I just wish they would support more than Jade and EJS. ;)