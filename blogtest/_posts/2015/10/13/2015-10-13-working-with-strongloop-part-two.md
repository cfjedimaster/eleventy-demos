---
layout: post
title: "Working with StrongLoop (Part Two)"
date: "2015-10-13T11:55:16+06:00"
categories: [development,javascript]
tags: [bluemix,strongloop]
banner_image: 
permalink: /2015/10/13/working-with-strongloop-part-two
guid: 6918
---

Yesterday I blogged about StrongLoop and the ability to quickly generate APIs (<a href="http://www.raymondcamden.com/2015/10/12/working-with-strongloop-part-one">Working with StrongLoop (Part One)</a>). Today I'm going to write up a short post detailing how to switch from the in-memory database storage system to a 'real' persistent one. If you haven't read the previous entry, be sure to quickly scan it over or none of this will make sense. 

<!--more-->

To set up a persistence system with your StrongLoop-enabled app, you'll want to set up a datasource. In the screen shot below you can see five different data source types. Clicking one will open up the appropriate editor.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot14.png" alt="shot1" width="750" height="379" class="aligncenter size-full wp-image-6919" />

For my testing, I decided to first try MySQL. I've got a local MySQL server running so I made a new database and user just for testing my local application. I entered the appropriate details and tried to save. I then got this:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot24.png" alt="shot2" width="750" height="112" class="aligncenter size-full wp-image-6920" />

This was surprising. Since I saw the icons in the nav I just assumed it was already supported. Luckily the error message not only tells you what is wrong but gives you a link to correct it. I literally spent the 2 seconds to use npm to add the connector and that's all it took. The web admin also provides a test button you may miss if you aren't paying attention. It is at the very bottom of the data source form.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot1a.png" alt="shot1a" width="592" height="154" class="aligncenter size-full wp-image-6921 imgborder" />

The next step is to go to your model, each model, and update the data source to point to your new source. 

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot3b.png" alt="shot3b" width="750" height="256" class="aligncenter size-full wp-image-6922 imgborder" />

Remember, you need to do this for <i>each</i> model. I imagine most folks will use one data source per API, but certainly it makes sense to allow for multiple. What's cool too is that you can have an existing site with various models and then you can use the in-memory data source to test something new. 

So at this point, you're done, right? Nope. I went to the explorer to test creating a new cat. When I did my POST, I got:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot-3.5.png" alt="shot 3.5" width="750" height="246" class="aligncenter size-full wp-image-6923" />

This is easy to fix - when you change the data source, click that "Migrate Model" button I had not noticed before:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/10/shot42.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot42.png" alt="shot4" width="750" height="138" class="aligncenter size-full wp-image-6924 imgborder" /></a>

Again, you will want to do this for each model. StrongLoop also provides a JavaScript API for data migration if you want to programmatically handle moving from one data source to another.

Once I did that for my cat and dog models, I hopped back over to the MySQL GUI and confirmed it:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot51.png" alt="shot5" width="438" height="460" class="aligncenter size-full wp-image-6925" />

I then ran my POST to add a cat and confirmed it persisted as well:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot61.png" alt="shot6" width="750" height="524" class="aligncenter size-full wp-image-6926 imgborder" />

And that was it! To be clear, everything I did visually with the StrongLoop web admin could also be done via the CLI or just pure files. In case you're curious, here is the datasources.json file I have for my application:

<pre><code class="language-javascript">{
  "db": {
    "name": "db",
    "connector": "memory"
  },
  "mysqldb1": {
    "host": "localhost",
    "port": 3306,
    "url": "",
    "database": "strongloop1",
    "password": "12345",
    "name": "mysqldb1",
    "connector": "mysql",
    "user": "slc"
  }
}</code></pre>

So that's MySQL, what about Cloudant on <a href="https://ibm.biz/IBM-Bluemix">Bluemix</a>? The good news is that is also easy. My coworker Andy Trice covers it well here: <a href="https://developer.ibm.com/bluemix/2015/09/10/getting-started-node-js-loopback-framework-ibm-cloudant/">Getting Started with Node.js LoopBack Framework and IBM Cloudant</a>. Essentially, once you've gotten your Cloudant service up, it is one more npm call to install a connector, and then you can edit your datasources.json file to include the relevant information. 

All in all - pretty darn nice. I love how I can quickly go from a quick in-memory test to a 'real' setup in a persistence system, and I like how many different options I have as well.