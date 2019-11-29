---
layout: post
title: "Playing with StrongLoop - Building a Blog - Part One"
date: "2016-01-05T16:16:50+06:00"
categories: [development,javascript]
tags: [nodejs,strongloop]
banner_image: 
permalink: /2016/01/05/playing-with-strongloop-building-a-blog-part-one
guid: 7350
---

This year I've decided I'm going to write the hell out of some Node code. That's both good and bad. It means I'll be learning more and more about Node as a side effect but on the flip side, I'll probably be producing a bunch of silly, not-terribly-practical examples as I go along. As always, I encourage people to remember that I am <i>not</i> an expert at this. I'm learning. So please feel free to comment about what you would do differently. On the flip side - if I actually make something kinda cool, then let's just pretend I'm brilliant, ok?

During the holiday break, I decided to work on a new demo application using <a href="http://www.strongloop.com">StrongLoop</a>. I've blogged about StrongLoop before, specifically about using it to help build APIs powered by Node. There's a lot more to StrongLoop and I hope to share that with you as the year goes on. But for now, I want to focus on the Loopback-powered aspects of StrongLoop, specifically using the ORM-like APIs to work with data. 

<!--more-->

With that in mind, I decided I'd begin by building a blog. To be absolutely clear, I'm not advocating that you go out and build a blog with StrongLoop. Just use WordPress. (Yes, even with my complaints about it, I'd just use it.) Or a static site generator. But when I'm practicing a new language, I like to build things where I can focus on the language and architecture instead of figuring out features. We all know what a blog is. That makes it easier to get started.

For the first version, I figured I'd support a home page that lists blog entries and a detail view of the blog post. That's it. I'm going to save both administration, and security, for the next update.

I created a new StrongLoop app (as simple as <code>slc loopback</code>) and then fired up StrongLoop Arc to work with the composer. I decided on two different models: entry and category. Entry, obviously, represents a blog entry. Here is how I designed it in the web app:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/shot1.png" alt="shot1" width="750" height="414" class="aligncenter size-full wp-image-7351" />

I assume most of this makes sense as is, but you may be confused by the <code>slug</code> property. The slug is what comes at the end of the URL and is typically the title minus any special characters. In a real world app the editor would default this for you and you would only modify it on rare occasions. We could also set it automatically via Loopback too. (And we're going to do something kinda like that in a few minutes.)

I then defined a category type:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/shot2.png" alt="shot2" width="750" height="356" class="aligncenter size-full wp-image-7352" />

I then went back to Entry to set up the relationship. This is where I hit my first issue. While you can define a property of another type, it is a singular property. So I could add a category field to Entry but I'd only be able to assign one category to an entry. Of course, Loopback supports all kinds of "multi" relations, but unfortunately, the web based admin doesn't support setting it. Nor will it report it either. In the first screen shot, I've already got things working fine, but there's no indication of it.

Luckily, it takes about 5 seconds to define the relationship via the CLI. You simply type <code>slc loopback:relation</code> and you are prompted for the model to modify:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/shot3.png" alt="shot3" width="539" height="193" class="aligncenter size-full wp-image-7353" />

Then the type of relation:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/shot4.png" alt="shot4" width="590" height="138" class="aligncenter size-full wp-image-7354" />

Then what to connect to:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/shot6.png" alt="shot6" width="585" height="226" class="aligncenter size-full wp-image-7355" />

And then finally - what to call the relationship:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/shot7.png" alt="shot7" width="603" height="102" class="aligncenter size-full wp-image-7356" />

I have no idea how it figured out that the plural should be categories. You can define a plural name for your models but I never did for category. If it figured it out automagically - then cool.

There's a few more prompts you can just accept, and at the end, your modal JSON is modified:

<pre><code class="language-javascript">
  "relations": {
    "categories": {
      "type": "hasMany",
      "model": "category",
      "foreignKey": ""
    }
  },
</code></pre>

Frankly, looking at that JSON, it is just as easy to type it as it is to use the CLI, so I'm not too bothered that I can't do it in the web app. (Although I still wish it was at least recognized.)

Once I had that - I went ahead and opened up the StrongLoop API explorer and made a few blog entries:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/shot8.png" alt="shot8" width="750" height="758" class="aligncenter size-full wp-image-7357" />

I don't have a proper "admin" yet, but it takes mere seconds to use the explorer. That's damn convenient. 

Ok, so just to recap - at this point I've used Loopback/StrongLoop to define my content models. I even made a bit of content. I then turned my attention to actually building the application.

A Loopback application is a Node.js app using Express. That's it. However, there's a default structure to the app that you should familiarize yourself with. This structure is nicely documented (<a href="https://docs.strongloop.com/display/public/LB/Standard+project+structure">Standard project structure</a>). A particular note is the default routes.js file. You'll find this in the <code>boot</code> directory which is automatically loaded by your application on - you guessed it - boot. I began by adding a route for my home page:

<pre><code class="language-javascript">
app.get('/', function(req, res) {
	console.log('getting blog entries');
	app.models.entry.find({% raw %}{where:{released:true}{% endraw %},order:'published desc'}).then(function(entries) {
		res.render('index',{% raw %}{entries:entries}{% endraw %});
	});
});
</code></pre>

For the most part this is boilerplate Express, but note how I can use Loopback's APIs via the models object. The find method is a powerful query tool and in this case, we're simply asking for items released and doing a sort. The result will be an array of objects that I can use as - err well - simple objects. For example, this is my view:

<pre><code class="language-markup">
&lt;h2&gt;Entries&lt;/h2&gt;

{% raw %}{{#each entries}}{% endraw %}
	&lt;p&gt;
	&lt;a href=&quot;{% raw %}{{url}}{% endraw %}&quot;&gt;{% raw %}{{title}}{% endraw %}&lt;/a&gt;&lt;br/&gt;
	Published: {% raw %}{{moment published format=&quot;MMMM D, YYYY h:mm A&quot;}{% endraw %}}
	&lt;/p&gt;
	
{% raw %}{{/each}}{% endraw %}
</code></pre>

Nothing special about that, right? Do note though that I'm using a URL property. That didn't exist in the model. How did I do that? I built an observer in my entry.js file to recognize load events:

<pre><code class="language-javascript">
module.exports = function(Entry) {

	Entry.observe('loaded', function(ctx, next) {
		if(ctx && ctx.instance && ctx.instance.released) {
			var date = ctx.instance.published;
			ctx.instance.url = "/"+date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+"/"+ctx.instance.slug;
		}
		next();
	});
	
};
</code></pre>

I'm a bit unsure about why I need to check for ctx and ctx.instance, but without that check the server crashed when I added new data. And of course, as I see the code above, it makes much more sense to do this when the data is <i>persisted</i>, not loaded. As I said, I'm learning. I'll fix this before the next blog post.

For blog entries, the code is a bit more complex. My URLs look much like what you see here on this blog: 2015/1/2/Something-Something. The idea being a unique blog entry is the year+month+date+slug. When fetching content, it is easy enough to match on the slug, but the date portion threw me for a loop at first. (See what I did there?)

In most databases, you can do a where clause against a date part of a time stamp, so for example, where the year of some column that is a date field is equal to something. As far as I know you can't do that in Loopback. But you can do a date comparison. This is what I ended up with:

<pre><code class="language-javascript">
app.get('/:year/:month/:day/:slug', function(req, res) {
	console.log('do blog entry');
	console.dir(req.params);
	//create an upper and lower date range
	var lowerDate = new Date(req.params.year, req.params.month-1, req.params.day);
	var upperDate = new Date(lowerDate);
	upperDate.setDate(upperDate.getDate()+1);
	app.models.entry.findOne({where:{
		released:true,
		slug:req.params.slug,
		published:{% raw %}{between:[lowerDate,upperDate]}{% endraw %}
	},limit:1}).then(function(entry) {
		//first - did we get any?			
		if(!entry) {
			res.redirect('/');	
		}
		res.render('entry', {% raw %}{entry:entry}{% endraw %});
	});
});
</code></pre>

You can see where I define an upper and lower range for the published property. And that's really it. Here are a few additional notes not necessarily related to the core point of this entry.

<h2>Design</h2>

For design, I tried <a href="http://www.getmdl.io/">Material Design Lite</a>, which ended up being much more complex than Bootstrap. Maybe it's just that I'm so used to Bootstrap, but I found working with MDL to be a bit overwhelming. Not so much on a component scale (which I didn't actually get around to using), but as a layout template it was confusing as heck. I got it working, but honestly, it felt like a lot of work.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/shot9.png" alt="shot9" width="750" height="445" class="aligncenter size-full wp-image-7358 imgborder" />

<h2>Persistence</h2>

One of the coolest things about Loopback is that it uses a memory storage system out of the box. That means you don't have to set <i>anything</i> up while setting stuff up. Unfortunately, as soon as I got into the server-side code (I mean outside of the Model stuff) and my server was reloading with every edit, that stopped working for me. 

Maybe I'm crazy, but I wish the memory persistance data store would support persisting to the file system. Yes, I know that's a horrible idea in production, but in testing, if I could just have it persist data a bit longer, it would have been really helpful. I have to wonder if maybe there is some way I could use the boot feature to simply add some hard coded data to my system on startup. (Yeah, I like that idea!)

<h2>Da Code</h2>

If you want to see, and criticize, the code as it stands now, check it out here: <a href="https://github.com/cfjedimaster/StrongLoopDemos/tree/master/blog1">https://github.com/cfjedimaster/StrongLoopDemos/tree/master/blog1</a>.

Ok, so what do you think? In the next entry, I'm going to lock down and secure those remote methods. Then I can start working on an admin.