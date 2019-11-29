---
layout: post
title: "Integrating Parse.com on the Server"
date: "2013-02-22T10:02:00+06:00"
categories: [coldfusion,development,mobile]
tags: []
banner_image: 
permalink: /2013/02/22/Integrating-Parsecom-on-the-Server
guid: 4862
---

Earlier today a reader asked me to discuss using <a href="http://www.parse.com">Parse.com</a> on the server. I've blogged about Parse quite a bit, but always in the context of a web application (typically a mobile application). Parse.com has a full <a href="https://parse.com/docs/rest">REST API</a> that provides 100% of the functionality I've talked about before to any server-side application. In this blog post I'll demonstrate a few examples in ColdFusion, but certainly any application platform would suffice.
<!--more-->
First off, let's discuss why you would want to integrate your server with your Parse.com application data. The docs provide a few reasons, two of which I think are big - uploading a significant amount of data and exporting Parse.com data. Specifically that last one could be vital for creating backups. (Parse could fail. It happens.) On top of that I can also think of other reasons. 

To me, the biggest would be reporting. Parse.com's dashboard has a dataviewer, a rather nice one, but managers will want something a bit more formal. Also, you can't get an aggregate view of your data at a high level. The REST API would make all of this possible.

Let's look at a simple example of retrieving data. Parse has made their API as simple as possible. All URLs begin with a base value:

https://api.parse.com/1

You then simply append to the URL based on the type of data you are getting. So for example, if I wanted to get "TipObject" data (see the related links below for a look back at my "CowTipLine" application) I'd use this URL:

https://api.parse.com/1/classes/TipObject

You also have access to metadata like installations and users:

https://api.parse.com/1/users

To retrieve data, you pass along two headers: X-Parse-Application-Id and X-Parse-REST-API-Key. As a reminder, you can find your application ID and REST API keys in the dashboard for your application. 

Here is a quick demonstration of retrieving TipObjects.

<script src="https://gist.github.com/cfjedimaster/5014395.js"></script>

And the result:

<img src="https://static.raymondcamden.com/images/screenshot68.png" />

Retrieving one object is as simple as appending an object ID value to the URL:

https://api.parse.com/1/classes/TipObject/w2KtU29hNR

Most likely though you aren't going to want to fetch everything. The REST API provides a very rich <a href="https://parse.com/docs/rest#queries">query</a> functionality that lets you...

<ul>
<li>Do property matches and ranges (i.e. x=something or x gt something)
<li>Retrieve nest data (this is optional and gives you better control over the <i>size</i> of data being retrieved)
<li>Return just a count (note that, by itself, a count request won't limit the results, you need to ask for a count <i>and</i> tell Parse to return no objects)
<li>Handle pagination
</ul>

Consider the simple example below. It filters my TipObjects by the property howdangerous where the value is 1.

<script src="https://gist.github.com/cfjedimaster/5014458.js"></script>

As you can see, the query value is passed as a URL variable named where. The value of this is a JSON-encoded string. If I were doing something <i>very</i> complex I'd create the filter as pure data and then convert to JSON.

I mentioned earlier that I'd consider reporting as the best use case for this feature. Let's consider a simple example. My application lets you report on the relative safety of a region on a 1 to 3 value. Using the Parse.com REST API I can ask for a "count" value on each of those values. Parse.com has a "batch" process where you can run multiple operations at once, but unfortunately it doesn't support GET operations. (I filed a request for this here: <a href="https://parse.com/questions/support-for-batch-and-get">Support for Batch and Get</a>) But since this is an aggregate report we can simply add a bit of caching so we are not constantly hitting the API. In this example I've added a cache for 0.1 of a day (which we all know is... um... something).

<script src="https://gist.github.com/cfjedimaster/5014485.js"></script>

I built a simple chart to render this in manager-friendly bright colors.

<img src="https://static.raymondcamden.com/images/screenshot69.png" />

Finally, how about an email report? You can imagine a scheduled task that, once a month, emails management a basic report covering the number of new users and data entries over the past month. Date filters are slightly more complex. Here is an example with a bit of white space in it to make it easier to read:

<pre>
where = {
  "createdAt":
    {% raw %}{"$gte":{"__type":"Date","iso":"2013-02-01T00:00:00.000Z"}{% endraw %}}
}
</pre>

Note how I have to specify a type for the property.  Here is a full example that emails the report for the month (and certainly you could change this to a daily, weekly, etc type report).

<script src="https://gist.github.com/cfjedimaster/5014528.js"></script>