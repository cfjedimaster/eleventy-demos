---
layout: post
title: "Quick Note on Azure Functions Returns and Results"
date: "2018-07-16"
categories: ["serverless"]
tags: ["azure"]
banner_image: /images/banners/rough_start_a.jpg
permalink: /2018/07/16/quick-note-on-azure-functions-returns-and-results
---

So technically I'm not really back at work. Last week I took the kids on a short vacation to Arkansas and this week (well early this week), my eldest is at orientation at the University of Alabama. His brother is doing a "sibling program" and the two year old and I are sitting in a hotel room slowly going stir crazy. Well he is. In my [last post](https://www.raymondcamden.com/2018/07/06/my-rough-start-with-azure-functions) I had talked about the initial sign up experience with [Azure Functions](https://azure.microsoft.com/en-us/services/functions/) and creating my first serverless function with it via their [tutorial](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function). My plan was to continue along the tutorial which switches to the CLI but I found some interesting tidbits I thought I'd share.

### The Return of XML

So I didn't notice this last time, and to be fair, the UI kind of mislead me. When I tested my function via the portal, this is what it displayed:

![Screenshot showing the result of the operation](https://static.raymondcamden.com/images/2018/07/af16-1a.jpg)

When I tested the URL (and to be clear, I did test the URL last time, I just didn't notice) - the result was this (I added line breaks):

```html
<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">
The cat says, Meow  ray
</string>
```

You can see this yourself here: <https://rcamden-azurefunctions.azurewebsites.net/api/HttpTriggerJS1?code=Jf2lYDGQCXwOoplK52aNyEbsLrL4wku69PVP1RCwNsq1qiT60aOZ4Q==&name=ray>

Turns out - the default result encoding for Azure Functions is XML. That is... surprising. To be clear, I'm not saying XML doesn't have it's place, but honestly, it feels like the only time I use XML now for *new* stuff is when calling some older service. I then immediately convert it to a more sensible format. 

But ok - that's what Azure chose and I'm going to assume they have a good reason for it. Luckily, it's easy to work around.

### Returning JSON - Because it's 2018

So if you remember, my function from yesterday set the result value like so:

```js
context.res = {
	// status: 200, /* Defaults to 200 */
	body: "Hello " + (req.query.name || req.body.name)
};
```

To specify a JSON response, you use the `headers` value in the result:

```js
context.res.headers = { 'Content-Type':'application/json' };
```

You can find a good reference guide for both the request and response values here: [Azure Functions JavaScript Developer Guide](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node). 

So I took the initial function and made a slight modification. By default my code will return JSON, but you can request XML by using a query parameter. Technically I should be using the `Accepts` header and I could build support for that. But for a GET request, it's a heck of a lot nicer if I let my user simply pass a query parameter. In this case I'm choosing to make my user's life easier versus following REST specifications.

```js
module.exports = function (context, req) {

    if (req.query.name || (req.body && req.body.name)) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: {msg: "The cat says, Meow  " + (req.query.name || req.body.name) }
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }

    // allow for json or xml
    context.res.headers = { 'Content-Type':'application/json' };
    if(req.query.format && req.query.format === 'xml') context.res.headers['Content-Type'] = 'application/xml';

    context.done();
};
```

That error branch should also return an object but I'm keeping it simple for now. You can test this here: <https://rcamden-azurefunctions.azurewebsites.net/api/HttpTriggerJS2?code=gQ9hykKhkaxVosuljfWQGC3p1UsshUzyhGG8OGEZTRC5kDXCUK0Wrw==&name=weston>. And if you really want XML, you can test that here: <https://rcamden-azurefunctions.azurewebsites.net/api/HttpTriggerJS2?code=gQ9hykKhkaxVosuljfWQGC3p1UsshUzyhGG8OGEZTRC5kDXCUK0Wrw==&name=weston&format=xml>

### A Bit More...

So hey - I randomly clicked on the Monitor aspect of my function to see what it showed. IBM Cloud Functions has a decent monitor page, but I did a lot of my own analysis of my functions to get the results I wanted. From the function, you get your last twenty results:

![List of results](https://static.raymondcamden.com/images/2018/07/af16-2.jpg)

That's nice and simple. About the only thing missing here is an average duration value. If you click that link to open "Application Insights", you get dropped into something that vaguely reminds me of the query browser in SQL Server:

![Application Insights](https://static.raymondcamden.com/images/2018/07/af16-3.jpg)

That screen shot is probably too small but you can view a full size version <a href="https://static.raymondcamden.com/images/2018/07/af16-3.png" target="_new">here</a>.

The query language is pretty dang sweet:

```js
requests | project timestamp, id, name, success, resultCode, duration, operation_Id | where timestamp > ago(30d) | where name == 'HttpTriggerJS1' | order by timestamp desc | take 50
```

I've never seen this before but it is pretty obvious how to modify it. You also get autocomplete while you type which makes it a bit easier to use. I found a good [intro to the tool](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-analytics-tour) and from that I figured out how to get the average duration of my function:

```js
requests | project timestamp, name, duration  | where timestamp > ago(30d) | where name == 'HttpTriggerJS1' | summarize avg(duration)
```

There's probably a nicer way of doing that of course. I saved that query so I can use it again. And if your curious, the average (in ms) for my little test function was 169. Of course it really isn't doing anything so that isn't a real test. I'll be curious to see how Serverless Superman does there.
