---
layout: post
title: "Big updates to Apache Cordova"
date: "2015-04-21T22:46:46+06:00"
categories: [development,javascript,mobile]
tags: []
banner_image: 
permalink: /2015/04/21/big-updates-to-apache-cordova
guid: 6046
---

Over the past few days, there have been some pretty big updates to <a href="http://cordova.apache.org">Apache Cordova</a>. If you haven't been following their blog (they don't have a "subscribe" feature so I use a IFTTT email rule), then you may have missed out on the announcements. Here is a quick review of what's new:

<!--more-->

<h4>Android 4.0</h4>

So, what you may not know (and I'm honestly curious about how many people are aware of this) is that each platform (the actual bits you get when you add a platform to your Cordova project) is it's own separate project and has it's own version. I'm willing to bet most Cordova developers don't think about this very often, but sometimes pretty important updates happen to one platform that you should be aware of. On April 15th, <a href="http://cordova.apache.org/announcements/2015/04/15/cordova-android-4.0.0.html">Android 4.0</a> was released, with the biggest feature being the support of Crosswalk as a pluggable web view. Crosswalk gives you a way to provide a <strong>consistent</strong>, <strong>modern</strong> webview in your Android Cordova projects no matter what version of the Android browser they have may on their device. 

Another big change is that you must use the Splashscreen plugin if you want to use a splashscreen with your Android application. Previously you could get by with just config.xml changes, but now the plugin is required. 

Finally, a new plugin (<a href="https://github.com/apache/cordova-plugin-whitelist">cordova-plugin-whitelist</a>) is required to have whitelist support in your project. <strong>If you do not use this plugin, your app will act as if has no whitelist and will block all remote requests!</strong> Luckily the CLI now adds this by default, but be aware.

<h4>Plugins move to NPM (and updated)</h4>

Another big change is that plugins are now being loaded from NPM. As a practical matter you may not care, but the IDs used to load plugins have changed from org.apache.cordova.something to cordova-plugin-something. So for example, you would switch from:

<pre><code>cordova plugin add org.apache.cordova.device</code></pre>

to:

<pre><code>cordova plugin add cordova-plugin-device</code></pre>

The old IDs still work, and will work for some time, but you will want to get used to the new naming scheme. Want to search for plugins via the CLI? Use:

<pre><code>npm search ecosystem:cordova</code></pre>

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/sho1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/sho1.png" alt="sho1" width="850" height="418" class="alignnone size-full wp-image-6047" /></a>

All of the plugins have had minor updates and you can see a list of changes on the <a href="http://cordova.apache.org/announcements/2015/04/21/plugins-release-and-move-to-npm.html">blog post</a>.

I'm scanning the list now, and there seems to be a huge amount of bug fixes. Things that stand out are:

<ul>
<li>"Added nativeURL property to FileEntry, implemented readAsArrayBuffer and readAsBinaryString." - This is nice!
<li><a href="https://issues.apache.org/jira/browse/CB-6428">"Unable to read android_asset directory through File API"</a> - this bug fix lets you use the file system API to read from android_asset. I ran into this as well, so I'm happy to see it fixed.
<li>Browser platform support for File and File-Transfer</li>
</ul>

<h4>Tools Update</h4>

And finally, the CLI has updated. You'll want to do a npm update to get the latest (version 5). Notable updates include:

<ul>
<li>Support for plugins via npm as described above.
<li>The State feature I <a href="http://www.raymondcamden.com/2015/04/20/ionic-adds-a-new-state-feature">blogged</a> about for Ionic is now supported in Cordova as well. It is a bit different though. Unlike Ionic, the Cordova CLI will <i>not</i> save plugins and platforms by default. To save the fact that a project uses a platform or plugin, you must include --save in the command line call, like so:

<pre><code>cordova plugin add cordova-plugin-device --save</code></pre>

But if you forget, you can quickly save everything with two commands:

<pre><code>cordova plugin save</code></pre>

and

<pre>code>cordova platform save</code></pre>

When you save, data is stored within your config.xml file:

<pre><code class="language-markup">&lt;plugin name=&quot;cordova-plugin-whitelist&quot; spec=&quot;1&quot; &#x2F;&gt;
&lt;plugin name=&quot;cordova-plugin-device&quot; spec=&quot;^1.0.0&quot; &#x2F;&gt;
&lt;engine name=&quot;android&quot; spec=&quot;4.0.0&quot; &#x2F;&gt;</code></pre>

And to restore your plugins and platforms, you would do

<pre><code>cordova prepare</code></pre>
</li>
</ul>

You can read more details in the <a href="http://cordova.apache.org/news/2015/04/21/tools-release.html">blog post</a>.

So... thoughts?