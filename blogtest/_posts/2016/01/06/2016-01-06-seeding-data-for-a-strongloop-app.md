---
layout: post
title: "Seeding data for a StrongLoop app"
date: "2016-01-06T15:21:03+06:00"
categories: [development,javascript]
tags: [nodejs,strongloop]
banner_image: 
permalink: /2016/01/06/seeding-data-for-a-strongloop-app
guid: 7366
---

<div style="border-style:solid;border-width:thin;padding:5px"><strong>Please Read! A few hours after posting this, a member of the StrongLoop team pointed out an alternative that did exactly what I wanted to accomplish in about one second of typing. I still think the <i>core</i> of this blog entry makes sense as is so I'm not editing it, but see the note at the bottom!</strong></div>

This is just a quick post as a followup to something I mentioned in my <a href="http://www.raymondcamden.com/2016/01/05/playing-with-strongloop-building-a-blog-part-one">post yesterday</a> on building a blog with <a href="http://www.strongloop.com">Strongloop</a>. I mentioned that while working on my application, I kept losing my temporary data as I was using the "In Memory" datasource that is the default persistence method for data. That's not a bug - in memory means exactly that - in memory - and as I restarted the app (using <a href="http://nodemon.io/">nodemon</a>), I had to re-enter fake data to test.

While it takes all of three minutes to connect your app to Mongo, if you don't have Mongo (or MySQL, or a db in general), it would be nice to be able to stick with the simple RAM based system while prototyping.

<!--more-->

One of the things I realized is that Strongloop will run a set of scripts inside the boot directory on startup. In theory, that could be used to set some seed data. <a href="https://jordankasper.com/">Jordan Kasper</a> (evangelist for StrongLoop, which sounds like a fun job, ahem) shared this script with me as an example:

<a href="https://github.com/strongloop-training/coffee-time/blob/master/server/boot/create-sample-model-data.js">https://github.com/strongloop-training/coffee-time/blob/master/server/boot/create-sample-model-data.js</a>

<pre><code class="language-javascript">
var async = require('async');
var mysqlDatasourceName = 'mysql_dev';
var mongoDatasourceName = 'mongodb_dev';

module.exports = function(app) {
  //data sources
  var mongoDs = app.dataSources[mongoDatasourceName];
  var mysqlDs = app.dataSources[mysqlDatasourceName];
  //create all models
  async.parallel({
    reviewers: async.apply(createReviewers),
    coffeeShops: async.apply(createCoffeeShops),
  }, function(err, results) {
    if (err) throw err;
    createReviews(results.reviewers, results.coffeeShops, function(err) {
      if (err) throw err;
      console.log('&gt; models created sucessfully');
    });
  });
  //create reviewers
  function createReviewers(cb) {
    mongoDs.automigrate('Reviewer', function(err) {
      if (err) return cb(err);
      var Reviewer = app.models.Reviewer;
      Reviewer.create([
        {% raw %}{email: 'foo@bar.com', password: 'foobar'}{% endraw %},
        {% raw %}{email: 'john@doe.com', password: 'johndoe'}{% endraw %},
        {% raw %}{email: 'jane@doe.com', password: 'janedoe'}{% endraw %}
      ], cb);
    });
  }
  //create coffee shops
  function createCoffeeShops(cb) {
    mysqlDs.automigrate('CoffeeShop', function(err) {
      if (err) return cb(err);
      var CoffeeShop = app.models.CoffeeShop;
      var shops = [
        {% raw %}{name: 'Bel Cafe',openingHour:10, closingHour:18}{% endraw %},
        {% raw %}{name: 'Three Bees Coffee House',openingHour:6, closingHour:15}{% endraw %},
        {% raw %}{name: 'Caffe Artigiano',openingHour:17, closingHour:24}{% endraw %},
      ];
      //add city if it's in the model
      if(CoffeeShop.definition.properties.hasOwnProperty('city')){
        var cities = ['Vancouver', 'San Mateo'];
        shops.forEach(function(shop, idx){
          shop.city = cities[idx%2];
        });
      }
      CoffeeShop.create(shops, cb);
    });
  }
  //create reviews
  function createReviews(reviewers, coffeeShops, cb) {
    mongoDs.automigrate('Review', function(err) {
      if (err) return cb(err);
      var Review = app.models.Review;
      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
      Review.create([
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 4),
          rating: 5,
          comments: 'A very good coffee shop.',
          publisherId: reviewers[0].id,
          coffeeShopId: coffeeShops[0].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 3),
          rating: 5,
          comments: 'Quite pleasant.',
          publisherId: reviewers[1].id,
          coffeeShopId: coffeeShops[0].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 2),
          rating: 4,
          comments: 'It was ok.',
          publisherId: reviewers[1].id,
          coffeeShopId: coffeeShops[1].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS),
          rating: 4,
          comments: 'I go here everyday.',
          publisherId: reviewers[2].id,
          coffeeShopId: coffeeShops[2].id,
        }
      ], cb);
    });
  }
};
</code></pre>

I'm still new to Strongloop and Loopback in general, but this makes sense. My needs were far simpler, so here is a script I came up with (and again, Jordan helped me make it better) that just writes to a model in the in-memory datasource.

<pre><code class="language-javascript">
var chalk = require('chalk');

console.log(chalk.magenta('Lets seed this app!'));

/*
This script is based on: 
https://github.com/strongloop-training/coffee-time/blob/master/server/boot/create-sample-model-data.js
*/

module.exports = function(app) {

	//sample data
	var data = [
		{
			title:'Content One', 
			body:'Body One',
			posted:new Date()
		},
		{
			title:'Content Two', 
			body:"Body Two",
			posted:new Date()
		},
		{
			title:'Content Three', 
			body:'Body Three',
			posted:new Date()
		}
	];
	
	app.models.TestContent.create(data, function(err, records) {
		if (err) {% raw %}{ return console.log(chalk.red(err.message)); }{% endraw %}
		console.log(chalk.magenta('Done seeding data, '+records.length+' records created.'));
	});
	
}
</code></pre>

Pretty simple, and it works nicely.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/shot1-1.png" alt="shot1" width="550" height="385" class="aligncenter size-full wp-image-7367" />

<h2>But Wait - There's More!</h2>

So as I said up on top, a few hours after posting this, Rand Mckinney from StrongLoop shared this link with me: <a href="https://docs.strongloop.com/display/public/LB/Memory+connector#Memoryconnector-Datapersistence">Data persistence</a>. In  this doc they mention that you can simply specify a JSON file for the datasource and the in memory data will persist to it. Like, seriously, <i>exactly</i> what I had wanted. Here is an example:

<pre><code class="language-javascript">
{                                                                                       
  "db": {
    "name": "db",
    "connector": "memory",
    "file": "mydata.json"
  }
}
</code></pre>

Still - probably - a bad idea in production - but as I said - this would be incredibly useful when prototyping!