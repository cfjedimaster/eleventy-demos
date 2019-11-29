---
layout: post
title: "Basic Node performance monitoring with Node Application Metrics"
date: "2016-04-04T13:13:00-07:00"
categories: [development]
tags: [nodejs]
banner_image: 
permalink: /2016/04/04/basic-node-performance-monitoring-with-node-application-metrics
---

While I still have a long way to go before I consider myself a "Node.js Expert", one of the areas I've been most interested in recently is performance monitoring. There are tools out there for this purpose, of course, and I work for a group that has some. [StrongLoop](https://strongloop.com) has performance tools as part of the commercial offering for Node.js applications, and while obviously I hope to get up to speed on them soon, I ran across an open-source project at IBM that I thought was rather neat - [Node Application Metrics](https://github.com/RuntimeTools/appmetrics).

<!--more-->

Node Application Metrics, or appmetrics, is a utility that adds interesting metric data to your Node.js application. Out of the box, you get support for:

* CPU metrics
* Memory metrics
* Garbage collection
* Event Loop data
* MySQL, LevelDB, MySQL, MongoDB, PostgreSQL, OracleDB, and Redis database metrics
* WebSocket monitoring
* And more of course.

appmetrics supports reporting two ways. You can either hook it up to [Health Center](https://marketplace.eclipse.org/content/ibm-monitoring-and-diagnostic-tools-health-center), a free Eclipse plugin, or you can write code to handle metric events yourself. As I don't really use Eclipse, I played around with the server-side implementation. 

Right away - I have to warn you. appmetrics is *not* currently supposed under Node v5. I got it running (in fact, the error you get when you try to npm install it will tell you what to do), but obviously your mileage will vary unless you're using v4. Apparently v5 support is coming soon so there's that. I took an existing application that uses Mongo and simply dropped this into the top of my main application file.

<pre><code class="language-javascript">
var appmetrics = require('appmetrics');
var monitoring = appmetrics.monitor();

monitoring.on('initialized', function (env) {
	console.log(chalk.yellow('[appmetric] init'));
});
monitoring.on('http', function (data) {
	console.log(chalk.yellow('[appmetric] duration='+data.duration+' ms url='+data.url));
});
monitoring.on('mongo', function (data) {
	console.log(chalk.yellow('[appmetric] duration='+data.duration+' ms query='+JSON.stringify(data.query)));
});
</code></pre>

The fist two lines simply turn on appmetrics. The first event is fired when metrics are ready. The `http` event is fired when an http request is made *to* your application. It is *not* fired when your application itself makes a HTTP request. I think that woud be a really useful metric and I've filed an [ER](https://github.com/RuntimeTools/appmetrics/issues/180) for it. The `mongo` event is - obviously - fired on Mongo operations. One thing missing from the event that I think would be super useful is a metric on how many objects are returned. You may ask - why would you need that? As a developer, don't you know what your queries are doing? And the answer is - of course not. We've all dealt with code that we didn't write and unoptimized queries. I can't tell you how many times I saw code that returned thousands of results but only worked with the first one. Having a metric report on the result count would be super useful. (And yes, I filed an [ER](https://github.com/RuntimeTools/appmetrics/issues/181) for that as well.)

In testing, it worked as expected, but the `http` event recorded *every* http request, even static resources. Luckily you can easily tweak that. Here is how that could be done:

<pre><code class="language-javascript">
appmetrics.setConfig('http', {
	filters:[
		{
			pattern:'\.jpg{% raw %}|\.css|{% endraw %}\.png{% raw %}|\.gif|{% endraw %}\.js',
			to:''
		}
	]	
});
</code></pre>

In this case, I'm simply ignoring calls to URLs that match that regex. I could also conditionally ignore stuff in my event handler too. 

Here is an example of it running.

![console output](https://static.raymondcamden.com/images/2016/04/appmetrics1.jpg)

Currently the Mongo data is a bit hard to grok. You can see a query of {} above, which represents me asking for all objects, but it should (imo) also return the fact that I was asking for all objects of type X.

All in all - this project feels like exactly the kind of metric tool I was looking for - something incredibly simple and easy to use - but with some rough edges that need to be tuned up a bit before I'd recommend it wholesale. The biggest issue right now is that I'd like to see the data that feeds the Eclipse plugin available over regular HTTP. That would allow me to build my own front end to it and skip using the console or Eclipse. (Mainly I want to skip Eclipse because, well, it's Eclipse. ;) 

But I have to be honest - most performance tools create output that is incredibly hard for me to grasp. Seeing simple, "You requested this and I took N milliseconds to process" is *night and day* easier for me to process. Don't get me wrong - I know the more complex tools are there for a reason, but stuff like this feels like a good half way point between no metrics and complex CPU memory dumps. 

Are any of my readers making use of it?