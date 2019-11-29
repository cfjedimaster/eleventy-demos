---
layout: post
title: "Going Serverless with OpenWhisk"
date: "2016-12-23T12:49:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: /images/banners/openwhisk.jpg
permalink: /2016/12/23/going-serverless-with-openwhisk
---

Like I assume most of you have, I've been hearing a lot about "serverless" recently and while I had a passing 
understanding of what it was, I had not actually spent any time playing around with it. This week I got a chance
to play with [OpenWhisk](https://developer.ibm.com/openwhisk/), IBM's open source offering in this area and I have
to say I'm pretty blown away by how cool it is. What follows is a brief explanation of what serverless means to me, why
I think it is something to check out, and, of course, some sample code as well. Please remember that I am *incredibly* 
new to this space. What I write may be completely wrong, so take with a grain of salt. And as always, I highly 
encourage folks to chime in with their own thoughts, corrections, and questions.

What is it?
---

First off - what the hell is it? I mean, everything runs on a server, so the name doesn't make sense, right? I agree. 
I hate the name. "The Cloud" isn't necessarily accurate either, but "Serverless" feels like the complete opposite of the truth
as opposed to a fluffy (get it) marketing term like the cloud. That being said, you can think of it like this.

A typical web site, or app, or API, will run on a server. This is built in some app server tech like PHP, ColdFusion, or Node. In this code, 
you'll do something to set up *how* the data is accessed ("A GET request to path so and so will execute this code") and then
obviously write the code to actually do what the request is meant to do.

In something lightweight like Node, it may look like this:

<pre><code class="language-javascript">
var express = require('express');
var app = express();


app.set('port', process.env.PORT || 3000);

app.get('/cats', function(req, res) {
	// talk to some DB or whatevs and get a list of cats
	// then return it, what follows is pseudo-code:

	dbServer.getCats().then(function(cats) {
		res.send(cats);
	});
});

app.listen(app.get('port'), function() {
    console.log('Express running on http://localhost:' + app.get('port'));
});
</code></pre>

That's fairly simple, but of course, there's a lot going on behind the scenes. That very first line which loads
in Express is doing a lot behind the scenes. I don't necessarily have to worry about it, and this is why Express was
my gateway drug to Node, but it's still there of course. Also, the actual setup of running a server and specifying
the route isn't much work either - just a few lines. But here's where serverless can make things more interesting. Imagine
if my code was just this:

<pre><code class="language-javascript">
dbServer.getCats().then(function(cats) {
	send(cats);
});
</code></pre>

That's *hella* simple, right? Of course, I need some infrastructure to specify "On /cats, do this", but that's 
where the serverless platform comes into play.

It reminds me a lot of switching to static site generators. You may end up with similar complexity, but where that
complexity lies has moved from code to the platform I'm using to host my code. If I can trust IBM, or Amazon, or Microsoft, to 
be able to handle HTTP routing (and I'm pretty sure I can), then I can focus on just my implementation, which has become
smaller and simpler, which is pretty much always a good thing.

That's my take, the more formal, intelligent answer can be found on the OpenWhisk site: [What is Serverless Computing](https://developer.ibm.com/openwhisk/what-is-serverless-computing/) Here is the part I think makes the most sense:

<blockquote>
Serverless computing refers to a model where the existence of servers is simply hidden from developers. 
I.e. that even though servers still exist developers are relieved from the need to care about their operation. 
They are relieved from the need to worry about low-level infrastructural and operational details such as 
scalability, high-availability, infrastructure-security, and so forth. 
</blockquote>

![I like that word...](https://static.raymondcamden.com/images/2016/12/ow1.jpg)

What's in it?
---

The [OpenWhisk](https://developer.ibm.com/openwhisk/) site goes into more detail, but again, here's my take:

* An "action" - this is the actual code of what I'm trying to do.
* "Triggers" that let you specify outside sources as a way to kick off an action.
* "Rules" that simply map triggers to actions.
* "Packages" which - yeah, that's just packages. It's a combination of other actions/triggers/rules that you can link to your own stuff.

And most recently - a new feature is an API gateway to all of the above. This is still in beta, but it lets you define
an API path that points to my action.

To start using OpenWhisk, you'll want to download and install the [CLI](https://github.com/openwhisk/openwhisk/tree/master/tools/cli). You can then
start playing. Now let's say you want to build an action. I'll use JavaScript because it is perfect and has
no oddities at all. (OpenWhisk also supports Python, Swift, and even Java.)

<pre><code class="language-javascript">
function main() {
	
	return {
		payload: 'Meow!'
	};

}
</code></pre>

You need to have a main() function and you have to return an object containing a payload key. I can then upload this like so:

	wsk action create cat cat.js

In the line above, `wsk` is the CLI and `action create` is what you are doing. The next arg, `cat`, is the name of the
action and `cat.js` is the file to use. This will deploy the file. You can then run it like so:

	wsk action invoke --blocking cat

The `--blocking` part simply tells the CLI to wait for a response. You do not need to do that if you don't want to. (And you can still get
the response later.)

![Output](https://static.raymondcamden.com/images/2016/12/ow2.png)

The last bit, exposing it via a REST API, is done like so:

	wsk api-experimental create /blogapi /meow get cat

In the call above, `/blogapi` is a root path and `/meow` is the path for this specific call. `get` is the HTTP method and `cat` is the action. The result is a URL:

https://3b1fd5b1-e8cc-4871-a7d8-cc599e3ef852-gws.api-gw.mybluemix.net/blogapi/meow

Go ahead and click it - awesome, right? A small meow, but it feels more like...

<img title="Image credit: http://s699.photobucket.com/user/oak1_2009/media/godzillacat.jpg.html"
src="https://static.raymondcamden.com/images/2016/12/godzillacat.jpg">

Actions can get more complex, and obviously take arguments. You can also import packages to add more functionality. (I'll be linking to docs about all this at the end.) One of the coolest packages
is the Cloudant one. How easy was it to use?

* First - I made a new Cloudant service on Bluemix. 
* OpenWhisk (since it is tied to my account, the CLI makes you do that in
the beginning) was able to pick up on this and recognize it with one command.
* I opened the Cloudant portal, made a database, and added a few documents.
* At this point, I'm already mostly done. Since OpenWhisk has a Cloudant package and since it includes the ability to list documents, I could call an action 
on that package to get all the documents from my database. But to make it even more complete, I added a REST API path.
* And then I'm really done. I had an API to list documents from my database. Done. Like, done. I could pass any query as well. 

That was cool, but I wanted to know if I could bypass some of those arguments. You *can* specify parameters for a package at a global level, and `dbname` would make sense
for that, but I didn't want the `include_docs` to be global for everything. I got some great help from fellow IBMer [James Thomas](http://jamesthom.as/blog) and he
pointed out that I could include the OpenWhisk code itself in my action. So consider this action I built:

<pre><code class="language-javascript">
var openWhisk = require('openwhisk');
var ow = openWhisk({
	api_key:'im really a host'
});

function main() {

	return new Promise(function(resolve, reject) {
		ow.actions.invoke({
			actionName:"/rcamden@us.ibm.com_My Space/Bluemix_CatService_Credentials-1/list-documents",
			blocking:true,
			params:{
				"dbname":"cats",
				"params":
					{
						"include_docs":true
					}
			}
		}).then(function(res) {
			//get the raw result
			var raw = res.response.result.rows;
			//lets make a new one
			var result = [];
			raw.forEach(function(c) {
				result.push({% raw %}{name:c.doc.name, age:c.doc.age, gender:c.doc.gender}{% endraw %});
			});
			resolve({% raw %}{result:result}{% endraw %});
		});
	});


}
</code></pre>

I begin by getting the [openwhisk](https://www.npmjs.com/package/openwhisk) package which lets me do the same stuff
the CLI was doing. (Note that I was told that the api_key *should* have been picked up by an environment variable so that
may not be necesary.) I then simply call my action with params. What's cool is that I can then massage the response
a bit. I then set up a new API route for this here:

https://3b1fd5b1-e8cc-4871-a7d8-cc599e3ef852-gws.api-gw.mybluemix.net/catapi/allcats

Now I can use this in a mobile app and not worry about the server itself. I freaking love this. No Node.js server to 
configure with memory and the like, which, admittedly, is easy, but the less I have to worry about the happier I am. I could integrate
this into an Ionic app fairly simply since it's just REST. 

Obviously there's a lot more to learn, but I'm pretty excited about this.  To be clear, just like static 
sites don't make sense for everyone, I don't think serverless makes sense for everyone (every project) either. But it
does provide an incredibly compelling path to simplifying your deployment and that makes it something to check 
out.

More Resources
---

Here are some resources to get you started.

* First, an article by my buddy Andy Trice. This is what got me started! [Exploring the new OpenWhisk API Gateway](https://medium.com/openwhisk/exploring-the-new-openwhisk-api-gateway-4a72c132bff5#.novikve8x)
* The [Getting Started](https://console.ng.bluemix.net/openwhisk/) experience is pretty cool, and
 even better, has a browser-based version where you can write code and skip the CLI.
* The [main docs](https://console.ng.bluemix.net/docs/openwhisk/index.html?pos=2) are a wealth of 
information as well.
* There is a [Google group](https://groups.google.com/forum/#!forum/openwhisk) and [Stack Overflow](http://stackoverflow.com/questions/tagged/openwhisk) tag as well.
* Finally, the home for the open source project itself is: http://openwhisk.org