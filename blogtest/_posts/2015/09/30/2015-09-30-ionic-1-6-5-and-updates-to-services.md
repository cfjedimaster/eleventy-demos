---
layout: post
title: "Ionic 1.6.5 and updates to Services"
date: "2015-09-30T15:34:46+06:00"
categories: [development,javascript,mobile]
tags: [ionic]
banner_image: 
permalink: /2015/09/30/ionic-1-6-5-and-updates-to-services
guid: 6834
---

As a quick aside, I worked with Eric Bobbitt of the Ionic team while writing this. I asked him a <i>lot</i> of questions very quickly and he never complained. Big kudos to him for being patient with me!
 
A while ago I gave a presentation on Ionic Services, and as I mentioned earlier this week, I'll be speaking on the topic again <a href="http://www.meetup.com/Ionic-SF/events/225612872/">next month</a>. Today the Ionic folks released an update to the CLI that helps improve Ionic Service usage as well. This ties in with other improvements they have made since I last dug into them. The services are still in Alpha, which is bad news on one hand (I can see being concerned about using them in a production app), but the good news is that they have gotten a <i>heck</i> of a lot easier to use since I last played with them. In today's post I'm going to talk about those setup changes as well as show some updates they've done to make working with users easier.

<!--more-->

First and foremost, you want to update your local Ionic CLI. Type <code>ionic -v</code> at the command line and you'll probably see this:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/shot15.png" alt="shot1" width="671" height="213" class="aligncenter size-full wp-image-6835" />

Go ahead and run the update and ensure you are at version 1.6.5. At the time I wrote this blog entry the <a href="https://github.com/driftyco/ionic-cli/blob/master/CHANGELOG.md">change log</a> had not yet been updated, but hopefully that will be corrected soon.

Next, you'll want to ensure you have an account at <a href="https://apps.ionic.io">Ionic.io</a>. I'm not entirely sure if the CLI allows you to register, but since you're going to be using the site anyway, you should go ahead and register there.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/shot23.png" alt="shot2" width="451" height="642" class="aligncenter size-full wp-image-6836 imgborder" />

At this point, I'm going to borrow directly from Ionic's excellent docs for their services. You can find them here: <a href="http://docs.ionic.io/">http://docs.ionic.io/</a>. But I'm copying from them because I'm so darn excited about how simple things have gotten. Assuming you've made a new project, you begin by adding the core services library like so:

<code>ionic add ionic-platform-web-client</code>

This will automatically modify your index.html and app.js. Yes, if you rename your files this won't work correctly, but a) don't do that and b) you can still manually modify the files if you want. 

Next, you need to upload your application to ionic.io:

<code>ionic io init</code>

The first time you do this, the CLI will prompt you to login. After that it will remember your authentication information.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/shot31.png" alt="shot3" width="552" height="170" class="aligncenter size-full wp-image-6837" />

And that's it. Seriously. Previously this involved you doing all the edits by hand. To be clear, it wasn't a lot of work - we're talking 5 minutes here - but I know I screwed it up more than once and I freaking love that the CLI is handling this for me now. 

Just to repeat - in terms of "code setup", you're done in terms of loading the core support on the JavaScript side. In order to use individual services, two of them (Push/Deploy), require a plugin to be added. All three will require you to inject the service in your controller/service calls when you want to make use of them.

All in all, services are a heck of a lot easier now and that's pretty freaking cool. Now let's turn our attention to the User side. The <a href="http://docs.ionic.io/docs/user-quick-start">docs</a> on Users are a bit bare now. Personally, it feels like Ionic Users aren't necessarily a real "service" per se but more of a "support system" for the other services. That's my gut feeling now and obviously I reserve the right to change my mind later.

Ionic Users have a couple of different features:

<ul>
<li>You can easily define and create a new user for your application. If you don't want to manage IDs, you can use <code>Ionic.User.anonymousId();</code> to have an Id assigned.
<li>You can "save" your user so that Ionic.io knows about it as well. (More on that in a minute.)
<li>You can set and get basic values on users. Ionic users will have a few internal properties like id, image, and is_deleted. These are <i>not</i> documented currently but will be. Also, the property API (next bullet) does not work with these values so it isn't something you have to worry about running into. (Although you will want to read the next bullet carefully.)
<li>To get a value, you just do <code>user.get("key")</code>. You can also provide a second argument for a default value. Setting works just as easily: <code>user.set("key", value)</code>. You can provide complex data like arrays and it will persist just fine. As I said, the internal values are not fetched this way. You may want to get the ID value. To do that, you simply get it on the core user object: <code>user.id</code>
<li>Now here is where stuff gets cool. You can also register your own data types to add complex support for user data. If you register an object that has a toJSON and fromJSON method, you can then create a user property of that type and store more complex data with additional rules. Ionic is shipping one by default, UniqueArray (and yes, I've told them to be sure to document all the defaults), that provides support for storing arrays of unique values.
<li>To save a user, and you <strong>must</strong> save users if you want the data to exist on Ionic.io, you simply do <code>user.save()</code>. This is an async call but you don't have to handle the results unless you care too. Note that users are saved to LocalStorage. If you are offline, the save happens, but does <i>not</i> persist to the server (obviously). In that scenario, if you run <code>user.isDirty()</code> you will get true back. How you handle this is... well I guess up to you. Don't forget that going online fires an event you can listen for, so in that event you could check isDirty and try running save again.
<li>Here is where things get a bit complex. I'm going to show the web UI in a moment. It is possible that the server may have newer data for the user than your application does. Ionic provides a <code>load</code> event so it is easy to say, "Hey, get the User from the server and make him my local user", what isn't necessarily obvious is how/why you would do that. The web site, and the REST API (which isn't public yet), will provide Read/Write access to Users. So your app may have some Node.js back end that, once a day, updates Users. Therefore your code may need to run a <code>load</code> on startup to ensure the local user matches the remote server. How and when and how anal you get about this really depends on the application I suppose. Also, it is entirely possible that you will <i>never</i> modify the user outside the application.
</ul>

Ok, so how about the web site of this. First off, don't forget the big white bar on top of the Ionic.io site is a search bar. I know I forget sometimes, and if you are like me and have about two hundred apps, it can be difficult to find the one you just added.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/shot4.png" alt="shot4" width="750" height="424" class="aligncenter size-full wp-image-6839" />

Yes, it clearly says search - I still miss it. Once you find your app, simply click the Users link.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/Screen-Shot-2015-09-30-at-15.18.03.png" alt="Screen Shot 2015-09-30 at 15.18.03" width="750" height="552" class="aligncenter size-full wp-image-6840" /> 

You can see I've got a grand total of one user. In the future, Ionic plans on adding basic search/filter so you can find one user among millions. And of course, one day we'll have a proper REST API for everything on Ionic.io. Clicking edit lets you add arbitrary values to the user:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/shot5.png" alt="shot5" width="750" height="578" class="aligncenter size-full wp-image-6841" />

And yes - I did try to inject something bad into the user project. Even with stuff I love I try to see if I can break the web app. ;) If you do add properties via the web form, it is vital that you do the following. First, click Done:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/shot6.png" alt="shot6" width="750" height="361" class="aligncenter size-full wp-image-6842" />

And then - you <strong>must</strong> hit done again!

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/shot7.png" alt="shot7" width="750" height="163" class="aligncenter size-full wp-image-6843" />

You may or may not see this bug/issue. Eric and I are talking about it right now, and he believes it is an Ajax timing issue. So if you click around crazy like I tend to do, you may see it more often. Just... look out for it and hopefully it won't be an issue in the future.

So - that's the User service. It also connects to both the Push and Analytics services as well. I think once a proper REST API comes in this service will stand up a bit more on its own though. Let me know if you have any questions and don't forget to peruse the <a href="http://docs.ionic.io/">docs</a>. I'm also thinking about a full demo with users and analytics for sometime this week (or next).