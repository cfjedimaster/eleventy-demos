---
layout: post
title: "Node.js for the Non-Node.js Developer"
date: "2018-08-10"
categories: ["javascript","coldfusion"]
tags: ["nodejs"]
banner_image: /images/banners/enlightenment.jpg
permalink: /2018/08/10/nodejs-for-the-nonnodejs-developer
published: true
---

*Quick note: When I first wrote this article, it was entirely meant for ColdFusion developers who were interested in learning Node. After talking to my buddy [Brian Rinaldi](https://www.remotesynthesis.com/), he felt it would be useful for folks interested in learning Node in general. So I changed the title and URL, but kept the rest of the text as is. I think he is right and if you're doing web dev in any server-side language, I think this might be very useful helping you grok some of the peculiarities in how Node works!*

Last year at what is - most likely - the last [cfObjective](http://www.cfobjective.com/), I gave a presentation on Node.js specifically for ColdFusion developers. As a former (except for some minor side work from time to time) ColdFusion developer myself, I shared what I liked, what I didn't, and what confused the heck out of me when learning Node. My intent was not to provide an "intro to Node", since so many of those resources exist, but rather to focus on the particular things that stood out to me when I was learning. I am still learning Node and probably have a good decade ahead of me before I consider myself an expert. But I'm certainly happy I've made the switch and I'd like to help others as well. I've been meaning to create a written version of my slide deck for some time, and when a reader emailed me a few days ago asking about Node from a ColdFusion perspective, I thought it was time to get off my rear and actually do it.

<img src="https://static.raymondcamden.com/images/2018/08/cfn1.jpg" class="imgcenter" alt="Burning Bridges">

### What this isn't...

To be clear, this is not meant to be an attack on ColdFusion. ColdFusion provided an income for my family and I for *many* years. For a long time it was one of the most powerful, most practical, and most easy platforms to use. I have certain feelings about how Adobe is running the platform and I have certain feelings about whether it makes sense for people to *start* using ColdFusion, but that isn't the point of this. Feel free to hit me up privately, or heck, in the comments, and I'll be glad to share. But if you are making your clients happy and putting food on the table with ColdFusion, by all means, carry on!

Also note that JavaScript, and Node, is not a perfect language/platform. While I've had frustrations with CFML in the past, ColdFusion developers should be prepared to deal with the... idiosyncrasies of JavaScript as well. Go visit [wtfjs.com](https://wtfjs.com/) sometime for a good example of how JavaScript can surprise you from time to time. Personally my favorite issue with JavaScript, and this isn't an oddity or bug at all, is forgetting when a value is a string and performing some arithmetic operation on it. That's easily correctible but something that trips me up still today.

### So what is Node?

Ok, Node.js experts (and yes, I go back and forth between Node and Node.js, sue me), please do not get too angry here. I'm going to define Node in a way that made sense to me when I learned. There are better, deeper explanations, but I want to keep this simple. 

Node is - for all intents and purposes - using JavaScript on the server. It was created in 2009 (although Netscape had an earlier version no one seems to remember) and is powered by V8. Not the drink (although that would be awesome), but Chrome's JavaScript engine. It is open source (ahem, Adobe) and supported by a lot of large companies. Basically you don't have to worry about it going away or having a huge price jump. 

It is the JavaScript you are used to, warts and all, although in a different environment. So doing things like `$("someFormField").val()` doesn't make sense. You aren't writing code that runs in a browser but code that runs in a server. On the flip side, you have access to the file system of the server and can do file system CRUD and database operations to a server.

Like ColdFusion, the end result of calling a Node server is some kind of text or binary output. Ie, HTML, JSON, dynamic images, etc.

So yea! A lot like ColdFusion!

<img src="https://static.raymondcamden.com/images/2018/08/cfn2.jpg" class="imgcenter" alt="Woot! Dancing cats!">

### Except...

Node is very bare bones. Out of the box, you don't get a web server. Don't get anything like `<cfquery>`. Not much of anything really related to web development, and that's fine. Node isn't just a web platform (more on that later). But the good news is that you can build anything you want. And people have. Lots of people.

NPM, or Node Package Manager, makes it easy to install utilities. Hosted at [npmjs.org](https://www.npmjs.com/), the NPM tool not only lets you search for code but also install it and any dependency. What's cool then is that if you install some utility Foo, and it needs Booger, and then later install Goo which also needs Booger, NPM will be smart enough to recognize this and not download it again. This ability has been a *huge* missing piece of ColdFusion since - well - day one. You have it now with [CommandBox](https://www.ortussolutions.com/products/commandbox) which is good, and frankly the people behind it (Ortus Solutions) are probably the best thing to happen to ColdFusion ever. 

Unfortunately, while having NPM is awesome, it can also be overwhelming. You search for something like "rss" to add RSS parsing and you may be over a hundred results. That's... great. It's also something that can freeze you in the spot if you aren't prepared for it. You need to figure out what library looks to have the best features, best support, and best meets your business needs.

It may sound like I'm criticizing open source (oh my god, the nerve!) and I'm not, but I do think people who are used to this ecosystem and way of building may not recognize how overwhelming and scary this can be for folks new to it. Yes, free and open code is awesome. But that doesn't always means it's easy. That's fair, development is work after all, but just don't go into it thinking, "Oh, I need to do X in Node? No problem - I'll just find a random npm package!"

Ok, ready? Nope? Too bad.

### Step One

First, you install it. Head to [nodejs.org](https://nodejs.org/en/) and find the installer for your platform. If you are using WSL (Windows Subsystem for Linux), you'll want to follow Ubuntu directions, or consider `nvm` or `n` (yeah, good luck trying to Google that one). Once installed, just go into your terminal and confirm you can run `node -v`:

<img src="https://static.raymondcamden.com/images/2018/08/cfn3.jpg" class="imgcenter" alt="node -v at the terminal">

Congratulations - you're a Node developer. Go update your LinkedIn profile. 


### Oh Hey - Node Versions are Awesome!

Notice the version of Node I'm using above? Now is a great time to talk about Node versioning, cuz it's *so darn simple* and not confusing at all. Really.

<img src="https://static.raymondcamden.com/images/2018/08/cfn4.jpg" class="imgcenter" alt="Stupid meme gif about node versioning">

When you went to the Node.js page, you probably noticed this fun choice:

<img src="https://static.raymondcamden.com/images/2018/08/cfn5.jpg" class="imgcenter imgborder" alt="LTS versus Current">

Ok... so first off, my version (9.x) isn't even mentioned. But am I behind (10.8.0) or ahead (8.11.3)?

Yeah I've got no bloody clue myself. Let's go to Google where the first (and best afaik) answer comes from StackOverflow:

<blockquote>
To understand the difference you need to understand why a Long Term Support (LTS) version of Node exists.
<br/><br/>
Node LTS is primarily aimed at enterprise use where there may be more resistance to frequent updates, extensive procurement procedures and lengthy test and quality requirements.
<br/><br/>
(some deleted stuff)
<br/><br/>
Generally if you are able to keep up with the latest stable and future Node releases you should do so. These are stable and production ready releases with excellent community support. Unstable and experimental functionality is kept behind build and runtime flags and should not affect your day to day operations
</blockquote>

Source: <https://stackoverflow.com/a/34655149/52160>

My take from this is lean towards using the <strong>Current</strong> version but check where you'll be deploying your code to see what they support. 

One thing I've noticed about Node versus ColdFusion - I just don't generally run into version issues. That isn't to say Node doesn't change, it does, but it isn't like ColdFusion where you may work locally and use some random tag only to discover later on that your client is on an older version of ColdFusion and you're screwed. It just doesn't, or rarely, impact me when working with Node. That could be me simply not being advanced enough, but I'd say don't worry about it and grab the current version. (Yes, I need to update.) One cool thing is that you'll be able to use all those cool hipster ES6 stuff in your code and not give a dang about older browsers.

### Let's Code!

So given you have Node installed, how can we do a basic Hello World? 

* First you make a file (ok, that's probably obvious)
* You write your code
* Then `node filename` in your terminal
* And that's it.

An example:

```js
x = new Date();
y = 1;
z = 'Hello World';

console.log(x, y, z);
```

This creates a few variables and then logs them to the console. 

"But Ray, you said this wasn't the same JavaScript you use in the browser? How does console.log work?"

It just does. Go with it. No seriously, there's other ways to "write" string out but when debugging, you can use the same familiar `console.log` command we all love. 

<img src="https://static.raymondcamden.com/images/2018/08/cfn6.jpg" class="imgcenter imgborder" alt="Running hello world">

### Adding Features

Ok, so given that Node doesn't ship with a lot of things ColdFusion has out of the box, how do we add it? 

As I said above, most likely if you want to find a solution for X, you'll find about a thousand or so solutions. Once you figure out which is best for you, you've got a few options for how to get that code.

#### Option 1 - Copy and Paste

If we're talking about 10 lines of code or so, something you may find on StackOverflow for example, then sure, just copy and paste that code right into your app. Done!

#### Option 2 - Modules

There's a lot of technicalities here I'm going to ignore for now, but at the simplest level, a module is a packaged up set of functionality you can include in your code. The best comparison to ColdFusion would be a CFC. 

You figure out the module you need - install it - require it in your file - and then use it.

That "requirement" part will be new to you. In ColdFusion, once a CFC is in the file system (and in a few particular folders), we can just instantiate it. For Node, even if we have the module available we still need to tell our particular file to load up the functionality. This is all of one line of code so it's not a big deal.

Let's consider a simple example. The [Wordnik API](https://developer.wordnik.com/) is an incredibly cool API related to dictionary data. Let's look at a demo of using that API via Node.

```js
const request = require('request');

let apiKey = 'secret key';
let word = 'fear';
let url = `http://api.wordnik.com:80/v4/word.json/${word}/definitions?limit=20&useCanonical=false&includeTags=false&api_key=${apiKey}`;

request(url, (err, resp, body) => {

	if(err) {
		throw new Error(err);
	}

	let result = JSON.parse(body);
	
	console.log(result[0].text);
});
```

The first line in this program is an example of how I load a module, in this case, [request](https://www.npmjs.com/package/request). You can perform HTTP operations in Node without adding any additional libraries, but request makes it a bit easier. There are other options as well, for example, [axios](https://www.npmjs.com/package/axios), so you have options, but request is one of the more popular and most used ones.

I define a few variables and then use the request API to hit that URL. I check and see if I have an error, and if not, I parse the JSON result (oh, and by the way, you know how ColdFusion hasn't been able to get JSON parsing right for like a decade? yeah - that's not a problem here) and then print it to screen. The docs for the Wordnik API let's me know the result is in `text`, but I didn't read the docs, I simply did this first: `console.log(result)`. 

You will also note that I'm using some fancy ES6 (err 7 I can never remember) JavaScript-isms. That is totally optional. Here is a simpler version that may look more familiar:

```js
var request = require('request');

var apiKey = 'secret key';
var word = 'fear';
var url = 'http://api.wordnik.com:80/v4/word.json/'+word+'/definitions?limit=20&useCanonical=false&includeTags=false&api_key='+apiKey;

request(url, function(err, resp, body)  {

	if(err) {
		throw new Error(err);
	}

	var result = JSON.parse(body);
	
	console.log(result[0].text);
});
```

Node doesn't care if you are a JavaScript noob or wizard - code as you will.

What do we need to do in order for this code to work? First, we have to install `request`. At the command line, you can do so via: `npm install request`. The npm CLI will handle downloading and installing request plus anything it needs. It will drop this in a folder called `npm_modules`. This is the largest directory in the universe. Sorry. However, doing so will throw this error:

	npm WARN saveError ENOENT: no such file or directory, open '/mnt/c/Users/ray/package.json'

This is followed by other more scary errors that basically boils down to a simple issue - the lack of package.json.

### Ok, but what's package.json?

Once your Node application begins using things downloaded from npm, you need to add a package.json file to your directory. This file defines your application at a high level including things like the name, how to interact with it, and most important, what it depends on. It is a JSON file so it's easy to read/modify, but normally you don't have to actually touch the file. You can create a new one by running: `npm init`. This will ask you a series of questions that you can simply accept the defaults and just hit enter. Here is an example:

```js
{
  "name": "request_demo",
  "version": "1.0.0",
  "description": "",
  "main": "wordnik.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
  }
}
```

Now if you install the request module, you end up with:

```js
{
  "name": "request_demo",
  "version": "1.0.0",
  "description": "",
  "main": "wordnik.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "request": "^2.87.0"
  }
}
```

Now here's the cool part. Remember how I said that the `node_modules` folder was a bit large? Like size of the universe large? With this one file, you can share your code with others and exclude that particular folder. If a developer than simply runs `npm install`, it will read the `dependencies` part of the JSON file and include everything.

There's a lot more to this that I'm skipping over, but this will get you started initially.

In case you're curious, it's easy to work with arguments to a script as well. Node passes this to an object called `process.args`. This is an array of arguments where the first item will be `node` and the second the name of the file, so typically you begin checking for arguments at the third item. This version of the script simply removes the hard coded word from the demo above:

```js

const request = require('request');

let apiKey = 'super secret key';

let word = process.argv[2];
let url = `http://api.wordnik.com:80/v4/word.json/${word}/definitions?limit=20&useCanonical=false&includeTags=false&api_key=${apiKey}`;

request(url, (err, resp, body) => {

	if(err) {
		throw new Error(err);
	}

	let result = JSON.parse(body);
	
	console.log(result[0].text);
});
```

### Enter the Web!

<img src="https://static.raymondcamden.com/images/2018/08/cfn7.jpg" class="imgcenter imgborder" alt="Microsoft's old home page">

So - first - the bad news. If you want to build a web app, you'll need to craft it by hand. Node supports everything required to do that - it can fire up a HTTP server and listen to a port. It can fire off code on a request and check to see what path was requested and then do - well - whatever makes sense. Compared to ColdFusion where you simply make a file called foo.cfm, and if it's in a directory called snakes, it would be available at yoursite.com/snakes/foo.cfm, Node doesn't have a built-in related of files to URLs in terms of building your web app.

The good news is that this was fixed a long, long time ago. While you have choices, the most popular framework for building a web app in Node is [Express](http://expressjs.com/). It does most of the boilerplate work for you and really makes it much easier to actually create an app. When I was first learning Node some time ago, seeing Express is what convinced me it was time to learn Node. Before that, I had sat in multiple Node.js intro sessions where at the end we had built a web server by scratch and I decided there was no way in hell that made sense to me.

While I'm not going to teach you Express here (I'll be sharing the best resource for that later), here is a simple Express application:

```js
// Taken (and modified) from Express docs

const express = require('express');
const app = express();

app.use(express.static('public'));


// Routes, on url x do y
app.get('/', function (req, res) {
  res.send('<h1>Hello World!</h1>');
});

app.get('/meow', function (req, res) {
  res.send('<h1>Meow</h1>');
});

app.get('/woof', function (req, res) {
  res.send('<h1>Im so not a cat, sorry</h1>');
});

//start up
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
```

This app responds to 3 different URLs - `/`, `/meow`, and `/woof`. This line: `app.use(express.static('public'));` is rather cool. It lets you define a folder for static assets like CSS, images, and JavaScript. In this case if I have public/app.css, then I can simply link to /app.css in my code and it will be loaded properly. 

### Dynamic Pages

So - you love ColdFusion because you can mix a bit of logic into your layout, right? (Be honest, you know you do.) Node has a system for that as well. All of the above pages (technically "routes") are returning a hard coded string. You could do a bit of logic like so:

```js
app.get('/cats', function(req, res) {
	let cats = ["Luna","Pig"];

 	let html = '<h1>Cats</h1>';
	html += '<p>' + cats.join(',') + '</p>';
	res.send(html);

}
```

But writing HTML in JavaScript is messy. Luckily Express lets you define a "template" engine for your site. Basically a way to use tokens and such to add basic logic and variable substitution in your HTML. As a simple example, and this is using the Handlebars template engine (there are many more), here is a page that will render a few simple variables:

```markup
<p>
	Title = {{title}}
</p>

<p>
	Time = {{time}}
</p>
```

And here is the Node code that defined the path to this file:

```js
// Taken (and modified) from Express docs

const express = require('express');
const app = express();
const hbs = require('express-hbs');

app.use(express.static('public'));

app.engine('hbs', hbs.express4());
app.set('view engine', 'hbs');

app.get('/', function (req, res) {

	let time = new Date();

	res.render('index', {
		title:'Hello World',
		time:time
	});

});

//start up
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
```

In this case, my template would be named index.hbs. Handlebars also does basic looping and conditionals, but for the most part, template engines want you to do *logic* in your JavaScript and just rendering in your templates. That's frustrating at first, but a really good idea in general.

### What about all the other stuff ColdFusion gives you?

Here's a quick rundown of other things you can do in Node that may not be immediately obvious:

* URL and Form values: URL values are available in `req.query` where `req` is a HTTP request body with a lot of interesting stuff in there besides query string stuff. Forms require a bit more work (a line of code) but then can be made to set up a `req.body` object that has the same values as the Form scope in ColdFusion.
* File Uploads: Yeah, this one's kinda messy at first. Again, Node gives you everything out of the box to process them yourself, but you really want to use a good library for that and I recommend [Formidable](https://github.com/felixge/node-formidable). Here's an example of how code using Formidable looks:

```js
app.post('/something', (req, res) => {
  let form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    console.log('received files', files);
  });
});
```

* Sessions: Yep, you have em, with nicer options than ColdFusion too. My favorite is the option to *not* use sessions for a user until you actually store a value for them.
* Databases: Yep, you have em too, and you'll need to find a library that supports your database of choice. ColdFusion does this better, I'll be honest, but it isn't too hard at all to work with a database in Node.
* Error handling: Yep, built in, and Express has nice support too, both for 404 and regular errors. Also, it's easy to write code where in development you get a stack trace and in production a nice message instead.

### Going Live

I can remember playing with Node for a month or two and deciding... "Hey - I want to show off this cool cat demo!" Then I realized - I had no idea how to do that. Luckily, this is *incredibly* easy now. 

While you can use NGINX or Apache and proxy requests to a running a Node app. But the better solution is to use one of the many "PaaS" services - Platform as a Service. With [Zeit](https://zeit.co/) for example, you can go into a Node app folder, type `now`, and that's it. You can then show off your code. Seriously, one command. (Of course real world production will be slightly more complex, but honestly, not much more.)

### Final Tips

These are in no particular order, but I did save the best for last.

#### nodemon

Install and use [nodemon](https://nodemon.io/). This little utility will run a Node web app and reload it when you make changes. Oh, I didn't mention that as a problem with web apps? Ok, so yeah, don't worry and just use nodemon. 

#### Simple Scripts

Don't forget when building a web app, if you get into a tricky bit, you can write your code as a script. That may not make much sense, but imagine this scenario. You've built a web app with login, and after logging in, the user can click a link to load a page of cats that's loaded from the database. You found a good database package but it's a bit tricky to use. You write code, screw up, reload the web app and have to log back in, click the links, etc. 

Instead of doing that, just make a new file, like test.js, and put some code there to test querying from the database with some hard coded values and get it working. You can then integrate it back into your code. 

I had the same realization when working with serverless as well. When doing something complex, I'll first build a test script to run stuff locally before I try to deploy it as a serverless application.

Every Node developer out there knows this and I didn't so they are all probably laughing at me now. 

#### NodeSchool

[NodeSchool](https://nodeschool.io/) is an awesome resource. Via a simple CLI tool you're given a series of exercises to help you learn various topics in Node. The CLI then verifies your code is correct by running it and checking the output. 

#### My Junk

You can find my Node junk here - <https://www.raymondcamden.com/tags/nodejs>. 

#### And finally....

Buy the book! Yes, this book here... (and if you do I get a few cents):

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=qf_sp_asin_til&ad_type=product_link&tracking_id=raymondcamd06-20&marketplace=amazon&region=US&placement=1491949309&asins=1491949309&linkId=aaabe8497495881b7850161f9ff63aaf&show_border=true&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff">
    </iframe>

I will warn you. This book is old and a new version is coming sometime soon. However, this book is so damn good - I'm serious - that I'd buy it even if out of date. I have a physical and ebook copy - that's how good it is. It was *perfect* for me as a ColdFusion developer because it focused heavily on how to do 'web stuff' in Express and used terminology I was already familiar with. I can't recommend this enough - so buy a few copies today!

<i>Header photo by <a href="https://unsplash.com/photos/V3DokM1NQcs?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Nghia Le</a> on Unsplash</i>
