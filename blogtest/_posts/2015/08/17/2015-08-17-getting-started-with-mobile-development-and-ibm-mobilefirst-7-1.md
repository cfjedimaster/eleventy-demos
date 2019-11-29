---
layout: post
title: "Getting Started with Mobile Development and IBM MobileFirst 7.1"
date: "2015-08-17T11:05:29+06:00"
categories: [development,mobile]
tags: [mobilefirst]
banner_image: 
permalink: /2015/08/17/getting-started-with-mobile-development-and-ibm-mobilefirst-7-1
guid: 6638
---

A few days ago I <a href="http://www.raymondcamden.com/2015/08/14/ibm-mobilefirst-7-1-released">blogged</a> about the release of <a href="https://ibm.biz/BluemixMobileFirst">MobileFirst 7.1</a>. At the time, I really didn't have a lot of time so I didn't say much outside of, well, that it was released. Now that I'm back home (for a few days anyway), I thought I'd write a bit more about MobileFirst 7.1 and how hybrid mobile developers can make use of it. This is going to stretch out over a few posts, mostly written today, so for now I'm just going to cover installation and basic setup.

<!--more-->

Before I get into installation, I know some of my readers still don't quite get what MobileFirst is. Hitting the <a href="https://ibm.biz/BluemixMobileFirst">home page</a> will give you a bunch of pretty pictures and good information for managers, but as developers, we typically like things a bit more boiled down. What follows is my personal take on what MobileFirst is and why it is cool. Obviously I'm not a marketer so you will forgive me if what follows is a bit more casual than typical IBM marketing. ;) 

At a high level, MobileFirst is a support system for mobile apps. It is a server product that integrates with your mobile app (and to be clear, this doesn't impact offline support at all) and provides various different services. The server can run in multiple locations (more on that later) and includes a CLI for working with mobile projects. In terms of how your mobile app is built, MobileFirst supports native, hybrid (Cordova), and mobile web sites. The services MobileFirst provides includes:

<ul>
<li>The ability to provide proxies for HTTP, SQL, and other services. So imagine your application makes use of an API that returns weather information. In a typical mobile app, your app makes a HTTP request to the API, parses the response, and then does something with it. In MobileFirst, I can create an "adapter" that represents that API. My mobile app calls the adapter on the MobileFirst service which then proxies the call to the remote API. Right away I get some freaking cool benefits. One, if the remote API returns a bunch of crap I don't need, I can reduce the result payload to just what I want. Along with reducing the result, I can do whatever I want. Imagine the weather API only returns data in that weird format the rest of the planet uses. I could 'fix' that bug by returning Fahrenheit instead. Along with acting as a proxy, I also get reporting on the back end server so I can see how often the API is being called and how much data is going back and forth. Finally, I can completely replace my API provider on a moments notice by updating the adapter. My mobile app wouldn't need to know at all.</li>
<li>The ability to setup Android/iOS Push for your application. A REST API is also provided to so you can dynamically send push notifications to your mobile apps. Oh, and full reporting on your use of push as well.</li>
<li>The ability to manage multiple versions of your application as well as deploy new ones. So being able to deploy an update without going to the app store is pretty cool. But you can also do things like send an application message (for example, warning folks if part of your app will be down, or if a new version is coming soon, etc) as well as disable a version (imagine version 1.1 has a bad bug fixed in 1.2, you can disable and warn folks on 1.1).</li>
<li>The ability to send logs to a central server (with awesome support for handling your app being offline) so that you can search them later. So if all of a sudden folks on Android begin complaining about bugs, you can go to your MobileFirst server and begin searching on Android logs to see if you can figure it out.</li>
<li>You get a set of utilities to use within your mobile application. These utilities cover various things that might be useful. So for example, geolocation related utilities like "am I in a polygon" or "how far am I from a polygon". Or setting badge icons. Or detailed network information (like is airplane mode on). These utilities aren't something you would use on every project. They aren't "oh my god, I've waited all my life for these" type things, but they are useful items that you'll use from time to time and appreciate they exist.</li>
<li>I've already mentioned analytics in regards to the adapters, but you get more much more analytics of course.</li>
<li>Support for working with existing security systems. This lets you tie in things like adapter calls to an authentication framework. I'll be honest and say I've not yet played with this aspect of MobileFirst.</li>
<li>Finally, you can also use MobileFirst to handle your enterprise app store.</li>
</ul>

So that's what MobileFirst is to me, and to be clear, there's more I haven't covered, but these are the aspects that have most interested me as a developer. If you want to check it out, note that you can do so for free. This isn't a "trial" edition that times out, but a complete developer edition that you can use forever while testing/learning/etc.

So let's talk installation.

<h2>Installation</h2>

Working with MobileFirst requires two things - a server and a command line interface. There is one main download for MobileFirst and it includes both the server and CLI, so whether you plan to run the server on your local machine or not, you'll download the same package.

Start off here: <a href="https://www14.software.ibm.com/webapp/iwm/web/signup.do?source=swg-worklight&S_PKG=ov1268&S_CMP=web_dw_rt_swd">Get the Developer Edition</a>. You'll need to register with IBM, but this is a one time thing and we won't spam you. (In fact, I'm proud to say we seem to default the 'can we send you crap' email stuff to <i>off</i>, which is rare for companies.) Once past the registration you'll end up on the download page:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot15.png" alt="shot1" width="750" height="416" class="aligncenter size-full wp-image-6639 imgborder" />

Click the "Command line interface" tab and then select the binary for your platform. 

Once downloaded, just run the installer and you'll be good to go. When it is done, open up Terminal or CMD and ensure things are kosher by typing <code>mfp</code>:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot21.png" alt="shot2" width="749" height="750" class="aligncenter size-full wp-image-6640" />

Note - if you don't prefer the CLI, you can also get an Eclipse add on called "MobileFirst Studio".

<h2>The Server</h2>

Ok, now you have a choice. You can set up a local server for - well - local testing. (The local server can't be used in production of course.) Or you can use the new <a href="https://ibm.biz/IBM-Bluemix">Bluemix</a> support to run a server on the cloud. You would consider the Bluemix route if you wanted to demonstrate something to a client or coworker. To set up a local server, simply decide on a particular folder, and run:

<code>mfp create servername</code>

This is a one time command. To fire it up, you'll do:

<code>mfp start</code>

To stop it, do:

<code>mfp stop</code>

And finally, to get to the web based console, just do:

<code>mfp console</code>

As for using MobileFirst with Bluemix, I was planning on walking folks through that here, but we've got an excellent guide already online: <a href="https://developer.ibm.com/mobilefirstplatform/documentation/getting-started-7-1/bluemix/evaluate-foundation-on-bluemix/">Evaluate IBM MobileFirst Platform Foundation on IBM Containers</a>. If any of my readers try this guide and have issues, just let me know and I'll flesh out any confusing bits.

<h2>What's Next</h2>

This post talked about what MobileFirst is, and discussed the installation and setup of an initial server. In my next post, I'll tell you how to build a hybrid app, and discuss how the "workflow" is handled for working on your app. I'll also discuss how you would move an existing application into MobileFirst.