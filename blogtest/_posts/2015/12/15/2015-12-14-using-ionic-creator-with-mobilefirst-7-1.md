---
layout: post
title: "Using Ionic Creator with MobileFirst 7.1"
date: "2015-12-15T08:35:14+06:00"
categories: [development,mobile]
tags: [ionic,mobilefirst]
banner_image: 
permalink: /2015/12/15/using-ionic-creator-with-mobilefirst-7-1
guid: 7223
---

A few months ago I wrote a post discussing how to use <a href="https://ibm.biz/BluemixMobileFirst">IBM MobileFirst</a> 7.1 with Ionic (<a href="http://www.raymondcamden.com/2015/08/19/developing-ionic-apps-with-mobilefirst-7-1">Developing Ionic Apps with MobileFirst 7.1</a>). Recently, the Ionic folks have done some darn good improvements to <a href="https://creator.ionic.com">Ionic Creator</a>. Not only is the app more powerful to use, but more importantly, the <i>output</i> of Ionic Creator is, in my not so humble opinion, a heck of lot better. I'm still struggling to become "Angular-literate" so I'm not sure if I'm the best judge of Angular code, but I find the output from Creator to be a lot easier to work with, and more importantly, closer to the default code you get when you create Ionic applications with the CLI. So in this post, I thought I'd quickly demonstrate how to go from an app designed and created in Ionic Creator to a MobileFirst-enabled hybrid application. 

<!--more-->

First, I assume you've got a project up on Ionic Creator already. How it looks, what it does, etc. doesn't really matter. But it has to include a picture of a cat. 

To begin, you'll want to grab the zip download. First hit the export link:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/Ionic_Creator.png" alt="Ionic_Creator" width="750" height="543" class="aligncenter size-full wp-image-7241" />

Then select the zip tab:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/Ionic_Creator2.png" alt="Ionic_Creator2" width="750" height="544" class="aligncenter size-full wp-image-7242" />

Extract the zip someplace - it doesn't matter where, we'll be moving it in a second.

Ok, next, create a new MobileFirst Cordova application with: <code>mfp cordova create</code>. Just name it whatever you want and accept the defaults. (Or change them if you know what you're doing.)

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot1-1.png" alt="shot1" width="750" height="674" class="aligncenter size-full wp-image-7243" />

Now - I assume you've already got a working MobileFirst development server, but I like to be sure. So before going any further, go ahead and push the app to the server (<code>mfp push</code>) and then send it to your emulator (<code>mfp cordova emulate -p ios</code>).

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/Simulator-Screen-Shot-Dec-14-2015-10.36.27-AM.png" alt="Simulator Screen Shot Dec 14, 2015, 10.36.27 AM" width="422" height="750" class="aligncenter size-full wp-image-7244 imgborder" />

Ok, so now lets get in your Ionic Creator code. Open the directory containing your MobileFirst Cordova project. Find the www folder and either delete it or rename it. 

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot2-1.png" alt="shot2" width="750" height="425" class="aligncenter size-full wp-image-7246" />

Then, copy the assets from your Creator zip export into a new <code>www</code> folder.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot3.png" alt="shot3" width="750" height="847" class="aligncenter size-full wp-image-7247" />

Ok, so you're almost done actually. First, be sure to add in Ionic's keyboard plugin: <code>mfp cordova plugin add ionic-plugin-keyboard</code>. <strong>NOTICE: </strong> At the time I write this, a bug in the mfp CLI will report <code>Error adding plugin "ionic-plugin-keyboard"</code>. But if you <code>mfp cordova plugin ls</code> you will see that the plugin was added. This bug is known and will be fixed in a future release. 

Next you need to prepare the app to "speak" to MobileFirst. I covered this process in depth in my earlier article: <a href="http://www.raymondcamden.com/2015/08/18/developing-hybrid-mobile-apps-with-ibm-mobilefirst-7-1">Developing Hybrid Mobile Apps with IBM MobileFirst 7.1</a>. But if you want to quickly just see your app running, open up app.js and simply add this to the end:

<pre><code class="language-javascript">var wlInitOptions = {
    // Options to initialize with the WL.Client object.
    // For initialization options please refer to IBM MobileFirst Platform Foundation Knowledge Center.
};</code></pre>

Then simply emulate. (Note, previously you needed to <code>mfp push</code> before every emulation. Now that is unnecessary.)

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot4-1.png" alt="shot4" width="422" height="750" class="aligncenter size-full wp-image-7248 imgborder" />

And that's it. Let me know if you've got any questions about this process by leaving a comment below.