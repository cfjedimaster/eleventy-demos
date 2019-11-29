---
layout: post
title: "CFLib moves to Node.js"
date: "2015-01-05T16:04:22+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2015/01/05/cflib-moves-to-node-js
guid: 5515
---

This isn't necessarily <i>new</i> per se, but as I just completed some small tweaks I figured I'd share that I've migrated <a href="http://www.cflib.org">CFLib</a> to Node.js. For the most part the conversion was fairly simple, but I thought I'd share some of the highlights (and issues) of the new code base. 

<!--more-->

First, let's talk about the old stack. The code base was <i>very</i> old. The last revision was written in 2008. It used ModelGlue and Transfer. MySQL was used as the database. For the most part, the site ran fine. I ran into issues with Transfer if I accidentally saved a UDF with the same name as another but as that was pretty rare I never got around to investigating it or even fixing it. I started on a FW/1 rewrite over a year ago and actually got everything but the admin done, but I hate writing admins so much I never got around to finishing it. (Yes, that is lame. And guess what part I just finished in the Node version?) 

Content submissions have slowed down quite a bit, but honestly, I put the blame on me for that. <a href="http://blog.adamcameron.me/">Adam Cameron</a> helped out a bit for a while, as have others, but at the end of the day, I was the sticking point for things getting released, no one else. I apologize for that. The site still gets "ok" traffic, nearly 100K page views last year, so I'm hoping that having a new home for it will give me less of an excuse to ignore it. Y'all can nag me if I don't do a better job this year.

For the new site, my stack couldn't be more different:

<ul>
<li>Node.js, of course.</li>
<li>Express 4.X</li>
<li>MongoDB</li>
<li>Mongoose (a wrapper for Mongo)</li>
</ul>

As I rebuilt the site, I decided to kill off some features, the biggest being ratings (there were maybe 200 ratings) and author pages. I can return author pages if people feel strongly enough about it. I also switched the code renderer to <a href="http://prismjs.com/">PrismJS</a>, my favorite library for code coloring. 

You can see all the code up on GitHub: <a href="https://github.com/cfjedimaster/cflibwww">https://github.com/cfjedimaster/cflibwww</a>. Before you look at the code, <strong>please be aware that I'm a Node noob!</strong> I've played around a lot with Node and have released multiple sites, but I still feel like a first year freshman with it. I'd say my code is slightly better than my first year ColdFusion code, but only slightly. 

This is - I think - the largest site I've built in Node.js so far. I feel like the biggest issue is my core application file, index.js. It isn't too big (323 lines currently), but it feels messy. When I began working on an Admin controller, I moved code for those routes (think code that handles a particular request) into a unique file, and I'd like to do the same with the main views as well. Ditto for all the helpers I wrote in Handlebars. 

Basically - I can look at my code and at least "smell" the things that seem wrong. I think that's good. 

Mongo is - of course - a pleasure to work with. I won't pretend NoSQL DBs are a silver bullet, but my God, if I never write another line of SQL again I'll be happy. Working asynchronously can be a bit of a pain at times. So for example, I needed a way to get my libraries, and for each library, get a count of the number of UDFs in it. I used a library named <a href="https://www.npmjs.com/package/async">async</a> which allowed me to take those N async calls and listen for them to complete:

<pre><code class="language-javascript">
this.find().sort({% raw %}{name:1}{% endraw %}).exec(function(err, libs) {
	async.map(libs, getUDFCount, function(err, result) {
		for(var i=0, len=libs.length; i&lt;len; i++) {
			libs[i].udfCount = result[i];	
		}
		locals["libraryCache"] = libs;
		cb(null,libs);
	});
});
</code></pre>

The thing that bugged me the most, and I never really realized it before, is how limited Handlebars can be at times -- specifically in terms of doing anything in logic. Handlebars wants to minimize the amount of logic you include in your views, and I can get that, but it really bit me in the rear at times. As an example, when editing a UDF, I need to display a list of libraries the UDF can belong to, and then set the current library as the selected item. Handlebars supports IF clauses, but the expression must be simpler. So you can't do: {% raw %}{{if something is something}}{% endraw %}. Nope. You have to actually write a helper function for it:

<pre><code class="language-javascript">
selected:function(option,value) {
	if(option == value) {
		return ' selected';
	} else {
		return '';
	}
}
</code></pre>

Here's how that looks in the Handlebars template:

<pre><code class="language-markup">
&lt;tr&gt;
	&lt;td&gt;&lt;b&gt;Library:&lt;&#x2F;b&gt;&lt;&#x2F;td&gt;
	&lt;td&gt;
	&lt;select name=&quot;libraryid&quot;&gt;
	{% raw %}{{#each libraries}}{% endraw %}
		&lt;option value=&quot;{% raw %}{{this.id}}{% endraw %}&quot; {% raw %}{{selected this.id ..&#x2F;udf.library_id}}{% endraw %}&gt;{% raw %}{{this.name}}{% endraw %}&lt;&#x2F;option&gt;
	{% raw %}{{&#x2F;each}}{% endraw %}
	&lt;&#x2F;select&gt;
	&lt;&#x2F;td&gt;
&lt;&#x2F;tr&gt;
&lt;tr&gt;
</code></pre>

Not horrible, but not ideal either. Also, ColdFusion spoiled me. Being able to do this: <code>dateFormat(something, mask)</code> is nice compared to how I did it in the new site. First I got the MomentJS module. I then used it in a Handlebars helper. Finally I called it from my template like so: <code>{% raw %}{{fullDate udf.lastUpdated}}{% endraw %}</code> That's readable at least, but not necessarily simple.

All in all though, I'm happy with this new version, and I've got three UDFs waiting to be released. I'm going to release those later in the week. For those of you who are Node/Express experts, I will <strong>gladly</strong> take your feedback. For those who don't know Node and have specific questions about the code base, ask away!

It's come a long way from this...

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/01/cflib2.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/01/cflib2.png" alt="cflib2" width="600" height="408" class="alignnone size-full wp-image-5518" /></a>

By the way - that wasn't the first version. Unfortunately I couldn't find it via the Wayback Machine.

p.s. This new version will have broken the API used by the ColdFusion Builder extension. If anyone actually made use of that, speak up, and I'm sure I can get it working again.

p.s.s. The next conversion will be <a href="http://www.coldfusionbloggers.org">ColdFusion Bloggers</a>.