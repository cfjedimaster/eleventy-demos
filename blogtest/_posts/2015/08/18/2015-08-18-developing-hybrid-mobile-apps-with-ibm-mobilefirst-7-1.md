---
layout: post
title: "Developing Hybrid Mobile Apps with IBM MobileFirst 7.1"
date: "2015-08-18T14:40:32+06:00"
categories: [development,mobile]
tags: [cordova,mobilefirst]
banner_image: 
permalink: /2015/08/18/developing-hybrid-mobile-apps-with-ibm-mobilefirst-7-1
guid: 6652
---

In yesterday's blog post (<a href="http://www.raymondcamden.com/2015/08/17/getting-started-with-mobile-development-and-ibm-mobilefirst-7-1">Getting Started with Mobile Development and IBM MobileFirst 7.1</a>), I discussed what <a href="https://ibm.biz/BluemixMobileFirst">MobileFirst</a> was and why it could be beneficial for mobile developers. In today's post, I'm going to discuss how hybrid mobile development works with MobileFirst. This is something I've discussed before (for MobileFirst 7.0), and while the process wasn't difficult, it was definitely a few steps away from the "typical" Cordova development workflow. MobileFirst 7.1 really improves this process and makes it somewhat simpler for hybrid developers. In this post I'll talk about the process both for new projects as well as how an existing project can be migrated to MobileFirst. I will not be discussing specifics for <a href="http://www.ionicframework.com">Ionic</a> until tomorrow, but most of what I say today will apply there as well. Ok, let's get started!

<!--more-->

<h2>Prereqs</h2>

Before I begin, I'm assuming you've already downloaded and installed the CLI as I described in <a href="http://www.raymondcamden.com/2015/08/17/getting-started-with-mobile-development-and-ibm-mobilefirst-7-1">yesterday's post</a>. You'll also want to have a server up and running, either locally or on <a href="https://ibm.biz/IBM-Bluemix">Bluemix</a>. I also assume you have the "normal" Cordova prereqs like the iOS or Android SDKs.

<h2>Creating a Project</h2>

To create a new hybrid project, you begin by running <code>mfp cordova create</code>. You'll be prompted for the name and given a default package ID and version:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot18.png" alt="shot1" width="500" height="118" class="aligncenter size-full wp-image-6655" />

Next you'll be prompted to select platforms. Like any other Cordova project, you can change this later.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot22.png" alt="shot2" width="500" height="124" class="aligncenter size-full wp-image-6656" />

Next, the CLI lets you know that some plugins are installed by default. These plugins are required for Cordova apps running with MobileFirst:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot31.png" alt="shot3" width="750" height="242" class="aligncenter size-full wp-image-6657" />

Now the CLI prompts you about other plugins you may want to install. Note that you can easily add, remove, and list plugins later on so don't stress too much over this.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot41.png" alt="shot4" width="750" height="280" class="aligncenter size-full wp-image-6658" />

Finally, the CLI prompts you to select a template to use for your app. You can pass in other templates via the -t argument and you'll see this in action tomorrow when I blog about Ionic:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot51.png" alt="shot5" width="750" height="31" class="aligncenter size-full wp-image-6659" />

At this point, the CLI will start generating your project as well as push a copy to your MobileFirst server. If everything went well, the last thing you'll see is: "MFP Cordova project created successfully." Let's look at the folder created by the CLI.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot61.png" alt="shot6" width="750" height="291" class="aligncenter size-full wp-image-6660" />

For the most part, this should look very similar to a regular Cordova project. Notable differences include:

<ul>
<li>application-descriptor.xml: This allows you to tweak some settings for the application under MobileFirst. In general, you won't need to tweak this and when you do, do not edit it by hand, use <code>mfp config</code>.
<li>mobilefirst: The files in this folder are what get pushed up to the MobileFirst server. You won't need to mess with this.
</ul>

And that's it - the rest of this is vanilla Cordova stuff. 

<h2>Working with the MobileFirst/Cordova Project</h2>

So now that you've got a project, how do you use it? The MobileFirst CLI wraps calls to the Cordova CLI, much like Ionic does. So for example, to add a platform, you would do: <code>mfp cordova platform add android</code>. In general, the commands are very similar, but sometimes there are small differences. So for example, to emulate, you need to pass a -p flag: <code>mfp cordova emulate -p ios</code>. In this case, -p stands for platform. You can easily see the syntax by typing <code>mfp help cordova</code>:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot71.png" alt="shot7" width="750" height="665" class="aligncenter size-full wp-image-6661" />

So the process to code/test is pretty similar. You can open up the www folder, edit, and then see your changes by doing: <code>mfp cordova emulate -p ios</code>:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot81.png" alt="shot8" width="750" height="501" class="aligncenter size-full wp-image-6662" />

At the time I write this blog post, we have a small bug with the CLI that impacts this process. When working with a MobileFirst server, you need to deploy the bits to the server so it is aware of it. (There's more reasons than that, but let's keep it simple for now.) That command is: <code>mfp push</code>. The emulate command is <i>supposed</i> to do a push automatically, but right now it does not. Again, this is a bug, and a known one that is already being worked on. (I'll try to remember to edit this post once the fix is released.) For now, I recommend doing both commands at once. In OSX, this would be: <code>mfp push && mfp cordova emulate -p ios</code>. You could automate all of this with Grunt/Gulp of course. 

Outside of that - you're done. Build your app. Make use of the cool features of MobileFirst, iterate, deploy, and be successful.

<h2>Migrating an Existing Application</h2>

So what do you do if you've got an existing application? First, begin by creating a new MFP Cordova project as I outline above. You'll want to match the ID and application name. You can also tell the CLI to install the plugins your app needs, but if you forget, you can always add the plugins later. You can then simply copy the www folder from your existing project into the new MFP www folder.

Ok, so at this point, you need to make one very small tweak to your application code. As you know, Cordova applications need to wait for the deviceready event before they do anything related to the device itself. Most folks treat deviceready as their main application "bootstrap" - i.e., they don't really do squat till after it has fired. 

In a MFP Cordova application, you have another event as well - the initialization of the MobileFirst client-side framework. By default, your code can (probably should) have a function called <code>wlCommonInit</code>. When this function is run, you can then do "MobileFirst stuff", much like how deviceready implies device readiness. You can simply include this function in your application so you can begin doing things like remote logging, or other utilities. Here is an example:

<pre><code class="language-javascript">
function wlCommonInit(){
}

document.addEventListener("deviceready", init, false);
function init() {
	
}</code></pre>

If you use the default MFP Cordova project, you'll see some additional bits:

<pre><code class="language-javascript">var Messages = {
    // Add here your messages for the default language.
    // Generate a similar file with a language suffix containing the translated messages.
    // key1 : message1,
};

var wlInitOptions = {
    // Options to initialize with the WL.Client object.
    // For initialization options please refer to IBM MobileFirst Platform Foundation Knowledge Center.
};</code></pre>

These are optional and can be left out if you don't need them.

And that's it. Heck, technically you don't even need wlCommonInit, it won't throw an error without it, but the assumption here is that you actually want to use MobileFirst.
Any questions?