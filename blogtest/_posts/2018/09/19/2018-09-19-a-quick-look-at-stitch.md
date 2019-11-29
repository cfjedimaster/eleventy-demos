---
layout: post
title: "A Quick Look at Stitch"
date: "2018-09-19"
categories: ["serverless"]
tags: ["stitch"]
banner_image: /images/banners/stitch.jpg
permalink: /2018/09/19/a-quick-look-at-stitch
published: true
---

As a developer, it can be quite overwhelming keeping up with all the cool platforms and technologies available to you. The flip side of that coin is that sometimes you discover *really cool* stuff and frankly you don't mind that you're a bit late. For example, a few days ago I was introduced to [Stitch](https://www.mongodb.com/cloud/stitch) by MongoDB. This is a quite large product so I'm not going to over every detail, but it has some incredibly cool features that I'd like to share.

At a high level, Stitch covers three main functions:

* "Stitch QueryAnywhere", which is a fancy way of saying a simple way to access your MongoDB from various development platforms. I was seriously impressed by how this worked and you'll see a demo in a moment. Given that a lot of my work in the past has been "provide access to a backend database", anything that makes this simpler is a *really* good thing.
* "Stitch Functions", a serverless function as a service feature. In some ways this is a basic FaaS option but they provide some neat integrations here that make it stand out from others.
* "Stitch Triggers", which is basically a way to write functions that happen on certain events with your database.

Now along with all of this, you may have missed that they launched a cloud-based MongoDB service called [Atlas](https://www.mongodb.com/cloud/atlas/lp/general/try). I gave it a try as well and it worked well enough for me to consider not worrying about running MongoDB locally again. It has a good free teir as well so that's a plus. For the demo code I'm going to share below, I used Atlas to quickly create a MongoDB collection of cats, because cats:

<img src="https://static.raymondcamden.com/images/2018/09/stitch1.jpg" alt="Atlas interface" class="imgborder">

The interface pretty much just worked as you would expect, but I liked that they had a "Clone Document" feature as it made it easier to create sample data.

Let's first take a look at QueryAnywhere. This is a set of SDKs (JavaScript, React Native, Android, iOS, Node) that provides access to CRUD (read, write, update, delete, filter too of course) your data via a simple library. There is a full authentication system that handles anonymous users as well. Basically they make it easy to set your rules up (anyone can read, this type of user can add, etc) on their side such that your client side code is safe. Here is an example of the configuration I did for my Stitch app to allow anonymous users (default) to read my important cat data:

<img src="https://static.raymondcamden.com/images/2018/09/stitch2.jpg" alt="Access configuration" class="imgborder">

Once you have your data, and have setup access, their portal provides sample code for JavaScript, Android, and iOS (Swift) so you can quickly copy and paste in stuff to get going. Here is a simple Vue application I wrote:

```js
const client = stitch.Stitch.initializeDefaultAppClient('app1-togyt');

const db = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('cats');

const app = new Vue({
  el:'#app',
  data() {
    return {
      cats:[]
    }
  },
  created()  {
    client.auth.loginWithCredential(new stitch.AnonymousCredential()).then(user => 
      db.collection('cats').find({}, { limit: 100}).asArray()
    ).then(docs => {
      //console.log("Found docs", docs);
      this.cats = docs;
    }).catch(err => {
      console.error(err)
    });
    
  }
})
```

The first two lines set up my initial connection and specify that I want to work with `cats`. In my `created` hook, I do an anonymous login, find all cats, and then simply copy them to my Vue data. The front end just lists this out and if you want to see it in action, check out the CodePen below:

<p data-height="265" data-theme-id="0" data-slug-hash="gdQvXG" data-default-tab="js,result" data-user="cfjedimaster" data-pen-title="Sitch/Vue ex" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/gdQvXG/">Sitch/Vue ex</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Note that I did have to include one additional script tag to load their library. 

On the serverless functions side, what really impressed me here was the work done to make it easy to integrate with MongoDB. I guess that shouldn't come as a surprise, but given how nice it is to use a serverless function for easy access to a database, it's definitely appreciated. So for example (and I'm stealing this from their sample code):

```js
var collection = context.services.get("mongodb-atlas").db("dbname").collection("coll_name");
var doc = collection.findOne({owner_id: context.user.id});
```

They also make it easy to reach out to other serverless functions (ditto the stealing):

```js
var result = context.functions.execute("function_name", arg1, arg2);
```

They have a decent online editor with support for running tests as well. (Hopefully this won't be too tiny!)

<img src="https://static.raymondcamden.com/images/2018/09/stitch3.jpg" alt="Function Editor" class="imgborder">

The only weird awkward thing I found here was exposing a function over HTTP. For that you need to add a HTTP Service and it wasn't immediately obvious to me that that was the way you would do it. For my cats I whipped up this quick service:

```js
exports = function(payload) {

  var collection = context.services.get("mongodb-atlas").db("cats").collection("cats");
  return collection.find({}).toArray();

};
```

And if your curious - you can see the result here: <https://webhooks.mongodb-stitch.com/api/client/v2.0/app/app1-togyt/service/httptest/incoming_webhook/webhook0?arg=ray&x=1>. (Spoiler - it's cats.) 

All in all, I'm really impressed by Stitch and I plan to play more with it. I'd love to hear from my readers that are using it so please drop me a comment below if you've given it a spin.

<i>Header photo by <a href="https://unsplash.com/photos/93x6yZautvA?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Clem Onojeghuo</a> on Unsplash</i>