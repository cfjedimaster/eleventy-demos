---
layout: post
title: "Working with hybrid applications and IBM MobileFirst"
date: "2015-02-16T08:13:56+06:00"
categories: [development,javascript,mobile,uncategorized]
tags: [mobilefirst]
banner_image: 
permalink: /2015/02/16/working-with-hybrid-applications-and-ibm-mobilefirst
guid: 5671
---

As with my last post, I'll warn folks that I'm still learning about <a href="http://www.ibm.com/mobilefirst/us/en/">MobileFirst</a> and to please forgive any mistakes I make. I also want to give a shout out to my coworker <a href="https://twitter.com/csantanapr">Carlos Santana</a> who has been incredibly helpful in getting me up to speed. As this is my first post on MobileFirst, let me begin with a bit of background.

<!--more-->

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/MobileFirst-Logo.jpg"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/MobileFirst-Logo.jpg" alt="MobileFirst-Logo" width="500" height="260" class="alignnone size-full wp-image-5672" /></a>

MobileFirst is a collection of products that offer features and support for mobile developers. This support covers the full range of mobile development, from native to hybrid (my main area of concern). These features/support include:

* Logging: You can using MobileFirst to enable/disable logging profiles for devices in the wild in real time. So for example, if users on Android begin complaining about a problem, you can quickly enable logging for that platform to try to determine what's going wrong.
* Application version management: Control what versions of an application are allowed to be used and even send out notices to users to let them know about updates, service interruptions, etc.
* API management: You can proxy requests to remote APIs via MobileFirst giving you more control over API usage in your apps.
* Push notifications for all supported platforms.
* Deep analytics about app usage (device, version, etc).
* A QA and Security scanning service.
* Full web-based portal for all of the above to make it easy to use.

And more, of course. If you know me, you know I try to get to the nitty gritty of products as opposed to talking about them at a high level. In order to get up to speed I've been working with MobileFirst specifically in terms of hybrid application.

MobileFirst uses Cordova itself under the hood for hybrid apps. But you can't (for now) simply take an existing Cordova application and drop it into your MobileFirst project. Nor can you use Cordova tooling. While this may improve in the future, it isn't that difficult to take an existing application and bring it into MobileFirst. In this post I'm going to talk a bit about how to create hybrid apps, how to test them, and take a look at how you would take an existing Cordova application and bring it into MobileFirst. 

<h2>Create the MobileFirst Server/Application</h2>

A full look at installation, usage, etc. for MobileFirst is outside the scope of this document. You can see the <a href="https://developer.ibm.com/mobilefirstplatform/documentation/getting-started/">Getting Started</a> documentation for a start and peruse the <a href="https://developer.ibm.com/mobilefirstplatform/documentation/getting-started-hybrid-development-6-3/">hybrid-specific</a> portions. The docs mainly focus on <strong>MobileFirst Platform Studio</a>, an Eclipse plugin for managing MobileFirst projects via the IDE, but I much prefer using the CLI. You can find that download and installation instructions <a href="https://developer.ibm.com/mobilefirstplatform/install/#clui">here</a>. 

Given you've got stuff downloaded and installed, you can fire up a new server and hybrid application quickly:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/mfp1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/mfp1.png" alt="mfp1" width="800" height="191" class="alignnone size-full wp-image-5690" /></a>

In the above screen shot, I create a new MobileFirst server, added a hybrid application, and then enabled support for iPhone and Android. Now let's take a look at the directory structure.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/mf2.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/mf2.png" alt="mf2" width="600" height="535" class="alignnone size-full wp-image-5675" /></a>

The folder we care about is the common folder. This is where your HTML, CSS, and JavaScript exists and represents what you'll spend most of your time editing. Right now we've got a basic application, essentially the MobileFirst version of the Cordova skeleton.

<h2>Editing and Testing</h2>

So given that you now have a folder of web assets, how do we actually <i>test</i> this thing so we can see it in action. Also, what is the process like to edit and update the application?

One of the first things you want to do is start the server you created and then open up the console. That's done with <code>mfp start</code> and <code>mfp console</code>. 

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/mf3.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/mf3.png" alt="mf3" width="800" height="556" class="alignnone size-full wp-image-5676" /></a>

The console gives you a variety of options, but the one we care most about is the preview. Clicking the eye icon next to a platform opens up a preview tab. 

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/mf4.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/mf4.png" alt="mf4" width="800" height="412" class="alignnone size-full wp-image-5677" /></a>

What you've got here is essentially a web browser view of the mobile app with tools to simulate various different events and plugins. Yep, this is much like the Ripple tool. I'm going to talk about this a bit deeper in another post, but for now, let's focus on the editing process. Whenever I edit my common resources, I need to tell MobileFirst about it. This is typically done with two commands: <code>mfp build</code> and <code>mfp deploy</code>, but you can combine these into one nice call: <code>mfp bd</code>. As you can imagine, you could further automate this with a Grunt file watcher to make it automatic.

What about working with the native device, or simulator? Within the app folder, and next to the common folder, is one folder for each native platform you added via <code>mfp add environment</code>. For now, let's consider the iPhone folder:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/mf5.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/mf5.png" alt="mf5" width="600" height="599" class="alignnone size-full wp-image-5678" /></a>

Within it is an XCode project. If you double click to open it, you can then send the project to the simulator (or a device).

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/mf6.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/mf6.png" alt="mf6" width="800" height="574" class="alignnone size-full wp-image-5679" /></a>

So in my testing, my process so far has been: Edit in Brackets, do <code>mfp bd</code>, then simply click the Build/Run button in XCode. You don't have to reopen or refresh the project at all, the command line takes care of that.

Now - what about using an existing Cordova project? Perhaps an Ionic one? Let's start with a simple one - my <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/cordovaskeleton">Cordova skeleton</a> folder from my Cordova Examples GitHub repo. This project is pretty minimal. It contains one HTML, one JavaScript, and one CSS file. Here is the HTML:

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge,chrome=1&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
        &lt;link rel=&quot;stylesheet&quot; type=&quot;text&#x2F;css&quot; href=&quot;css&#x2F;app.css&quot; &#x2F;&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

	&lt;script src=&quot;cordova.js&quot;&gt;&lt;&#x2F;script&gt;	
	&lt;script src=&quot;js&#x2F;app.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

And here is the JavaScript (I'll skip the CSS as it is empty):

<pre><code class="language-javascript">document.addEventListener(&quot;deviceready&quot;, init, false);
function init() {
	
}</code></pre>

As I said - it is pretty simple - which is kind of the point. So how would I integrate this into a MobileFirst project?

<ol>
<li>The first step is to copy out the contents from the common folder. I moved them into a temp folder. 
<li>I then copied my existing project into the common folder.
<li>Next, remove the script tag that includes cordova.js: <code>&lt;script src=&quot;cordova.js&quot;&gt;&lt;&#x2F;script&gt;</code>. This may seem unnatural to you as it is part of the basic requirements for a Cordova project, but MobileFirst handles this for you.
<li>Next, copy <strong>back</strong> the file initOptions.js. As you can probably guess, this file handles setting up default options for MobileFirst. It will also automatically call a function named <code>wlCommonInit</code>. This will <strong>replace</strong> your deviceready call from your existing application. Right now you can't tell the platform to run another function so you <strong>must</strong> use a function with that name. My code listened for deviceready to fire init, so I removed my event listener and renamed init to wlCommonInit. (I'll share the modified code at the end.) You can also simply copy in the code from initOptions.js into your JavaScript file. Right now I kind of think it makes sense to keep them separate. I reserve the right to change my mind on that before I finish writing this blog entry.
<li>At this point, you have your code set up to listen for MobileFirst's platform to be ready along with the default Cordova deviceready. You can use both device features and MobileFirst APIs. I've zipped up my common folder as an attachment to this blog entry.
</ol>

Here's the updated index.html file:

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge,chrome=1&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
        &lt;link rel=&quot;stylesheet&quot; type=&quot;text&#x2F;css&quot; href=&quot;css&#x2F;app.css&quot; &#x2F;&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

    &lt;script src=&quot;js&#x2F;initOptions.js&quot;&gt;&lt;&#x2F;script&gt;
    &lt;script src=&quot;js&#x2F;app.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

My initOptions.js is the same as the default, but here is my new app.js:

<pre><code class="language-javascript">function wlCommonInit() {
	//I'm ready to do MFP stuff and Cordova stuff.
	console.log("BRING THE EPIC");	
}</code></pre>

So what about plugins? By default, MobileFirst includes <strong>all</strong> the core plugins. You don't have to implicitly add camera, device, etc. The full MobileFirst API is documented <a href="http://www-01.ibm.com/support/knowledgecenter/SSHS8R_6.3.0/com.ibm.worklight.apiref.doc/apiref/r_ibm_worklight_client_side_api_.html">here</a> and I'll show some examples of this in my later posts. Custom plugins require manual installation. I'll demonstrate this later as well.

I hope this wets your appetite a bit and let me know if anything isn't clear. As I said, I've got multiple other blog entries to write on this to help flesh out the process.