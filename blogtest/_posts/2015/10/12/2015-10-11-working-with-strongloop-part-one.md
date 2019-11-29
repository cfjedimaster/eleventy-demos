---
layout: post
title: "Working with StrongLoop (Part One)"
date: "2015-10-12T10:26:21+06:00"
categories: [development,javascript]
tags: [bluemix,strongloop]
banner_image: 
permalink: /2015/10/12/working-with-strongloop-part-one
guid: 6893
---

A few weeks back when I was shuttling back and forth between this side of the planet and the other, IBM purchased <a href="http://www.strongloop.com">StrongLoop</a>. I'll be honest and say that before this purchase, I had never heard of them. A quick perusal of their home page will tell you this:

<!--more-->

<blockquote>Built on top of the open source LoopBack framework, StrongLoop allows you to visually develop REST APIs in Node and get them connected to your data. StrongLoop also features built-in mBaaS features like push and offline sync, plus graphical tools for clustering, profiling and monitoring Node apps.</blockquote>

This seemed interesting to me. Right now I'm at an interesting point in my Node.js development. I can write code. Not great code, and I need to copy and paste quite a bit, but I can build an application. On the hosting side, I've got multiple different ways of moving my application to production, including, of course, <a href="https://ibm.biz/IBM-Bluemix">Bluemix</a>. 

What I haven't really gotten yet is the ecosystem around tools to help me build Node.js apps quicker as well as debugging and performance tuning. I feel like I'm just now getting to the point where it makes sense for me to learn more about this area and the StrongLoop acquisition is the perfect opportunity for me to do so. 

StrongLoop has a number of features related to Node.js development, but for today's post, I'm going to focus on just one - the API Composer. At the simplest level, this is "just" a code generator, and I've got a bad history with code generators in general. I tried like heck to get behind Yeoman, but it simply never clicked for me and how I develop web apps. StrongLoop's tooling though works really well (as I hope you'll see) and so far I'm incredibly impressed.

The API Composer (and technically, I'm going to be showing the CLI as well as the graphic interface) is focused around building APIs. This is especially appealing to me because the more I work on the client-side, the leaner my server becomes. This is why I've been moving away from ColdFusion. I simply don't need my server to do much beyond simply proxying of API calls to various data sources. The more intelligent my front-end becomes the less intelligent (and complex) my back-end becomes. Let's consider a simple demo of what I'm talking about. 

As a quick aside, if you are following along and actually doing these steps, you will eventually need to register at StrongLoop. You can do so <a href="https://strongloop.com/register/">here</a>. This is free, and will be required to test the graphical stuff. I'm also assuming you have Node.js installed because, well, why wouldn't you?

The first thing you'll want to do is install StrongLoop itself. This can be done via npm:

<code>npm install -g strongloop</code>

This gives you the CLI tools as well as everything required to run the graphical portion as well.

Now, we'll build a sample app. At the command line, run this:

<code>slc loopback</code>

<a href="http://loopback.io/">LoopBack</a> is an open source Node.js framework that StrongLoop created, and their tooling runs on top of it. Some of what you'll see below is available in LoopBack and some just within StrongLoop itself. Running the above command will begin the app creation process.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot13.png" alt="shot1" width="750" height="398" class="aligncenter size-full wp-image-6895" />

After naming your app and entering a directory, the CLI will layout the app and end with this:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot23.png" alt="shot2" width="750" height="317" class="aligncenter size-full wp-image-6896" />

Fire up the application and you'll get two endpoints:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot32.png" alt="shot3" width="750" height="83" class="aligncenter size-full wp-image-6897" />

The home page just reports some startup info, but the explorer is where things get cool.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot41.png" alt="shot4" width="750" height="213" class="aligncenter size-full wp-image-6898 imgborder" />

What you are seeing is automatic documentation for a simple modal called user. This is baked into the sample code and obviously you can rip this out if you don't need it. Clicking User expands the full list of methods available on it.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/Screen-Shot-2015-10-12-at-09.26.17.png" alt="Screen Shot 2015-10-12 at 09.26.17" width="750" height="622" class="aligncenter size-full wp-image-6899 imgborder" />

And you can then expand one particular method for more detail:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot5.png" alt="shot5" width="750" height="416" class="aligncenter size-full wp-image-6900" />

Notice that not only do you get quite a bit of information, you also get the ability to <i>test</i> the API directly on the page too. This is all really slick and well done, but let's actually make a proper model for our new application. We'll use the CLI first.

You begin by typing <code>slc loopback:model</code>. You'll be asked for the name of the model. Be sure to use the singular version as a later question will be what the plural should be. After entering the name of the model, you'll be asked about the data-source. Out of the box, you can use an in-memory database for testing. This is slick, but remember that every time you stop the Node.js app, the data will be cleared. (Not your models, they are store as files, but instances I mean.) If you want to play with the models and keep your data around, you may want to use one tab to run the application and one to use the CLI. You'll be asked a few more questions that you can just accept as default. StrongLoop supports things like MySQL and Mongo, and can be extended to support other data providers like Cloudant. (You'll see this in the next post!)

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot6.png" alt="shot6" width="750" height="214" class="aligncenter size-full wp-image-6901" />

You're next asked to enter properties. Obviously this will depend on what your data is exposing. In the screen shot below I added three properties - name, gender, and color. I set these as strings, but I could have used different data types.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot7.png" alt="shot7" width="750" height="620" class="aligncenter size-full wp-image-6902" />

(Note - the deprecation warnings there aren't important and can be ignored.)

When done, I simply hit enter. Before we even look at the code, let's look at the API explorer again. As you can see, cat has been added as a model, and the properties match what I set up.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot8.png" alt="shot8" width="750" height="530" class="aligncenter size-full wp-image-6903 imgborder" />

Cool. I scrolled down to the Put command and decided to build a cat (surprisingly easy to do compared to building a real cat):

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/Screen-Shot-2015-10-12-at-09.43.56.png" alt="Screen Shot 2015-10-12 at 09.43.56" width="750" height="752" class="aligncenter size-full wp-image-6904" />

The final test though was the raw API itself. I hit the GET API at http://localhost:3000/api/cats and got a list of my cats:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot9.png" alt="shot9" width="750" height="172" class="aligncenter size-full wp-image-6905 imgborder" />

The API also has a butt-ton (marketing term) of filtering, sorting, limiting options built in too. We haven't yet looked at the code, so let's check it out. The core file for the Node.js app is really simple. Obviously a lot is going on behind the scenes, but the initial file is simple and not overwhelming.

<pre><code class="language-javascript">var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at {% raw %}%s%{% endraw %}s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});</code></pre>

This is all boiler plate, so let's look at how "cat" was added to the application. After I ran the CLI, two files were added to my <code>common/models</code> folder: cat.js and cat.json. cat.js is blank, well, mostly blank:

<pre><code class="language-javascript">module.exports = function(Cat) {

};</code></pre>

The idea here is that you can add customized logic for your API calls. Perhaps the "free" version of your application only returns male cats. Whatever you want - you can easily add here. cat.json is the actual definition:

<pre><code class="language-javascript">{
  "name": "cat",
  "plural": "cats",
  "base": "PersistedModel",
  "idInjection": true,
  "options": {
    "validateUpsert": true
  },
  "properties": {
    "name": {
      "type": "string",
      "required": true
    },
    "gender": {
      "type": "string",
      "required": true
    },
    "color": {
      "type": "string",
      "required": true
    }
  },
  "validations": [],
  "relations": {},
  "acls": [],
  "methods": {}
}</code></pre>

As you can see, this is all rather simple and easy to modify if you want to skip the CLI. You can also see optional items like validation support. I'm just barely scratching the surface here for the blog post.

At this point - I think we have something really freaking cool. Again, if you imagine a scenario where your server app is just a proxy between the client and databases, then what you've seen gets you a heck of a long way towards the finish line. Heck, you can build out a proof of concept server in minutes! Now let's take it a step further and look at the API Composer.

Technically what I'm going to show here is called <a href="https://strongloop.com/node-js/arc/">Arc</a>. Arc is a set of visual tools for your Node.js application. The API composer is just one small part of it. You begin by firing up the server:

<code>slc arc</code>

This opens up the web site in your default browser.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot10.png" alt="shot10" width="750" height="721" class="aligncenter size-full wp-image-6906" /> 

Now - I warned you above but it may be easy to forget. Even though this is your local server, you need to <a href="https://strongloop.com/register/">register</a> at StrongLoop before you login here. I tried admin/admin which did not work. Once you login, just click the Composer link. The Composer gives you the ability to work with your model just like the CLI did. Here you can see the Cat model we just built.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/Screen-Shot-2015-10-12-at-09.59.54.png" alt="Screen Shot 2015-10-12 at 09.59.54" width="750" height="368" class="aligncenter size-full wp-image-6907" />

I can then easily add a whole new model:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/Screen-Shot-2015-10-12-at-10.02.02.png" alt="Screen Shot 2015-10-12 at 10.02.02" width="750" height="352" class="aligncenter size-full wp-image-6908" />

After saving the model, I can use the little Play icon the UI to restart the app so it picks up on the changes:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot111.png" alt="shot11" width="750" height="540" class="aligncenter size-full wp-image-6909" />

I built my - admittedly - simple dog model in about 60 seconds - restarted and then was able to hit <code>http://localhost:3000/api/dogs</code> and it freaking <i>worked</i> and that is awesome. I mean, I like visual building tools even less than I do generators and I'm 100% sold on this. (And to be clear, yes, I work for IBM, I'm supposed to like our stuff, but I hope my honest appreciation for this is coming through.) 

As I said in the beginning, this is only one part of what StrongLoop offers. As I learn these tools I'm going to share my experience on the blog. If you have used StrongLoop, or LoopBack, I'd love to hear about your experiences below. Leave a comment and let me know what you think.