---
layout: post
title: "Cordova CLI Updated"
date: "2015-03-03T08:49:44+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2015/03/03/cordova-cli-updated
guid: 5758
---

Earlier this morning the Apache Cordova team released a cool update to the CLI (<a href="http://cordova.apache.org/news/2015/03/02/tools-release.html">Tools Release: March 02, 2015</a>). One of the most interesting aspects of this update is a new feature - the ability to save (and naturally restore) platforms and plugins.

<!--more-->

To use this new feature, you simply add --save when adding a platform or plugin. As an example:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/pg1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/pg1.png" alt="pg1" width="674" height="162" class="alignnone size-full wp-image-5759" /></a>

Notice how it specifically mentions that it is being saved into config.xml. And here is an example of saving a plugin:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/pg2.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/pg2.png" alt="pg2" width="960" height="252" class="alignnone size-full wp-image-5760" /></a>

If you look at your config.xml, you can see this information is now added.

<pre><code class="language-markup">&lt;?xml version='1.0' encoding='utf-8'?&gt;
&lt;widget id=&quot;io.cordova.hellocordova&quot; version=&quot;0.0.1&quot; xmlns=&quot;http://www.w3.org/ns/widgets&quot; xmlns:cdv=&quot;http://cordova.apache.org/ns/1.0&quot;&gt;
    &lt;name&gt;HelloCordova&lt;/name&gt;
    &lt;description&gt;
        A sample Apache Cordova application that responds to the deviceready event.
    &lt;/description&gt;
    &lt;author email=&quot;dev@cordova.apache.org&quot; href=&quot;http://cordova.io&quot;&gt;
        Apache Cordova Team
    &lt;/author&gt;
    &lt;content src=&quot;index.html&quot; /&gt;
    &lt;access origin=&quot;*&quot; /&gt;
    &lt;engine name=&quot;ios&quot; version=&quot;3.8.0&quot; /&gt;
    &lt;feature name=&quot;File&quot;&gt;
        &lt;param name=&quot;id&quot; value=&quot;org.apache.cordova.file&quot; /&gt;
    &lt;/feature&gt;
&lt;/widget&gt;</code></pre>

So when are these settings used? When <code>cordova prepare</code> is executed. If all you do is <code>cordova emulate</code> while working, then this will handle it as well. 

What about existing projects? Unfortunately there is no way to look at your current project and save everything as is. (I filed a <a href="https://issues.apache.org/jira/browse/CB-8593">bug report</a> for that.) You would need to remove each platform and project and then re-add them with the flag. That won't take more than a minute though and is worth the effort if you're working on a team. 

Be sure to read the <a href="http://cordova.apache.org/news/2015/03/02/tools-release.html">blog entry</a> for a full list of updates, and OSX users doing iOS should pay special attention to the note to update ios-deploy. Doing so will finally get rid of the warnings you would receive in Terminal. 

Another update is the ability to list devices and emulator images from the command line. (Covered in detail in this <a href="https://issues.apache.org/jira/browse/CB-8168">bug report</a>.) I was a bit confused as to how to use this at the CLI so I figured I'd share some tips.

First, if you want to get a list of emulator images, you would do this:

<code>cordova emulate --list</code>

This will <strong>not</strong> fire up the emulator but just list the available emulator types for your installed plugins. I've only got iOS as a platform in this project, but here's an example of the output.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/pg3.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/pg3.png" alt="pg3" width="850" height="410" class="alignnone size-full wp-image-5761" /></a>

To use this, you can then pass it as a target value like so: <code>cordova emulate --target iPad-2</code>. In theory, all of this should work if you had multiple devices attached to your machine as well, but as I'm too lazy to go get my physical iOS devices, I'll just trust that it works. ;)

As a final tip, if you want to keep up to date with Cordova, you may want to subscribe to their RSS feed and use IFTTT to send you an email. Their RSS feed may be found at <a href="http://cordova.apache.org/rss.xml">http://cordova.apache.org/rss.xml</a> and <a href="http://www.ifttt.com">IFTTT</a> makes it easy to get emails from an RSS feed. This is what I do since I tend to fall behind on the public dev list.