---
layout: post
title: "Hosting Node.js apps on Bluemix"
date: "2015-03-02T14:28:40+06:00"
categories: [development]
tags: [bluemix]
banner_image: 
permalink: /2015/03/02/hosting-node-js-apps-on-bluemix
guid: 5746
---

One of the biggest issues I had when learning Node.js was how to take an application into production. Luckily theres multiple options to make this easier, including <a href="https://console.ng.bluemix.net/home">IBM Bluemix</a>, a service I've been playing with over the past few weeks. In this post, I'm going to briefly describe what it takes to set up a new Node.js app on Bluemix as well as what it is like to migrate an existing site there.

<!--more-->

Ok, so first off, you'll need to sign up for Bluemix. You won't need a credit card and you get a good long trial to play with things. There's a lot of cool stuff at Bluemix, far beyond what I'm talking about today, so the trial will give you time to play around with other features as well. 

The very first time you sign in, you're asked to create a "Space". You can think of this as a bucket for your various apps and services. You can name this whatever you want, and you'll just need to do this one time.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/dbbm1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/dbbm1.png" alt="dbbm" width="850" height="518" class="alignnone size-full wp-image-5754" /></a>

After you've done that, you can then create an app. 

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/shot1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/shot1.png" alt="shot1" width="850" height="410" class="alignnone size-full wp-image-5747" /></a>

Next, select Web.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/shot2.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/shot2.png" alt="shot2" width="850" height="410" class="alignnone size-full wp-image-5748" /></a>

And then select SDK for Node.js

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/shot3.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/shot3.png" alt="shot3" width="850" height="410" class="alignnone size-full wp-image-5749" /></a>

For app name, select whatever makes sense.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/Screen-Shot-2015-03-02-at-13.00.54.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/Screen-Shot-2015-03-02-at-13.00.54.png" alt="Screen Shot 2015-03-02 at 13.00.54" width="850" height="410" class="alignnone size-full wp-image-5750" /></a>

Note that the app has to be unique across <i>all</i> of Bluemix. So you may need to prefix the name of your app with something unique. So for example, if you were launching raymondcamden.com there, I'd pick a name that included that. (And yes, the name I used in the screen shot above was taken. I switched to RKCMyApp.

On the next screen, you're given some good information to help you get started.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/shot5.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/shot5.png" alt="shot5" width="850" height="410" class="alignnone size-full wp-image-5751" /></a>

Pay particular attention to the "CF Command Line Interface" download. This is the command line tool that you will use to help push updates from your machine to Bluemix. This is a one time install. Unfortunately you can't use npm to do the install, but hopefully in the future those tools will be published there.

You can, if you want, also download the starter app code. That's the code currently being used for your new application. If you are new to Node and want to learn, I'd recommend grabbing the code and playing with it. It uses Express (which in my opinion is one of the best Node libraries out there) but also uses Jade, which is the template framework of the devil. Luckily you can easily switch to a more sensible framework quickly enough.

Go ahead and dismiss that welcome text to view your application console. If you ever want to get back to it, it is available by clicking "Start Coding" in the left hand nav.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/Screen-Shot-2015-03-02-at-13.09.41.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/Screen-Shot-2015-03-02-at-13.09.41.png" alt="Screen Shot 2015-03-02 at 13.09.41" width="850" height="410" class="alignnone size-full wp-image-5752" /></a>

You can see options for adding new instances, increasing memory, and adding new services. You can stop and restart the app as well as seeing a log of recent changes. Finally note the "Routes" section on top. Clicking on the URL there will take you to your application. 

Updating and deploying your code is pretty easy. Assuming you've got Node already running locally, and assuming you grabbed the "starter pack" for this new app, open up the files in your editor and at your terminal, get it running by first installing dependancies (npm install) and then running it (node app). By the way, I strongly recommend <a href="https://github.com/remy/nodemon">nodemon</a> while developing.

After you've made your changes, how do you push it up to Bluemix?

First, you have to tell the command line (cf) what API to use. This is a one time setting.

<code>cf api https://api.ng.bluemix.net</code>

Then login.

<code>cf login -u youremail -o yourorg -s yourspace</code>

This login will persist (I'm not sure how long), so you won't have to constantly relogin as you do stuff.

Pushing updates to your app then is trivial:

<code>cf push appname</code>

The update will take about a minute. I'm guessing if you add a bunch of new libraries to your package.json file it may take longer. But once done, you can hit your site and see it changed. You can see my app here, but note that I created this in a trial account that is ending in three days: <a href="http://rkcmyapp.mybluemix.net/">http://rkcmyapp.mybluemix.net/</a>. In case my trial account has expired, here is what I created in about 20 seconds:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/Screen-Shot-2015-03-02-at-13.50.57.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/Screen-Shot-2015-03-02-at-13.50.57.png" alt="Screen Shot 2015-03-02 at 13.50.57" width="589" height="290" class="alignnone size-full wp-image-5755" /></a>

The command line has a heck of a lot of power (basically everything the site has). You can run <code>cf</code> by itself to see docs at the command line. One option I found recently was <code>cf logs MYAPP</code>. This will begin tailing your logs, from your server, right in your terminal. 

<h2>Migrating to Bluemix</h2>

So all of the previous is related to working on a new Node.js app with Bluemix. What about migrating an existing app? 

First, you want to pay particular attention to the Node.js Bluemix <a href="https://www.ng.bluemix.net/docs/#starters/nodejs/index.html#deploynodejsapp">documentation on deployment</a>. Bluemix runs a customized version of Node.js. It isn't directly linked to from there, but you can find details about the modifications here: <a href="https://www.ibm.com/developerworks/web/nodesdk/">IBM SDK for Node.js Version 1.1</a>. 

In the docs linked to above, pay special attention to this portion:

<blockquote>
If Procfile is not present, the IBM Node.js buildpack checks for a scripts.start entry in the package.json file. If a start script entry is present, a Procfile is generated automatically. Otherwise, IBM Node.js buildpack checks for a server.js file in the root directory of your application. If a server.js file is found, a Procfile is also generated automatically.
</blockquote>

And that's basically it. I copied <a href="http://www.javascriptcookbook.com">JavaScript Cookbook</a> to Bluemix just to test and the process was mostly painless. I say "mostly" because I decided to try out <a href="https://cloudant.com/">Cloudant</a> at the same time and it was a bit more difficult than MongoDB. (But it seems pretty cool. I'll share the updated code later this week.)

Setting up your domain to point to your Bluemix server is also pretty easy, and I was going to write out the process with screen shots, but then I discovered this good video by Ryan Baxter and I figured it didn't make sense to duplicate the effort.

<iframe width="640" height="480" src="https://www.youtube.com/embed/fG7UbOHywXc?rel=0" frameborder="0" allowfullscreen></iframe>

So, what do you think? Have you tried Bluemix yet? If so, did it work ok for you? Let me know in the comments below!