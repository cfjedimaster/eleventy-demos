---
layout: post
title: "Cordova, Plugins, and Determining What Supports What"
date: "2014-10-01T11:10:00+06:00"
categories: [html5,mobile]
tags: []
banner_image: 
permalink: /2014/10/01/Cordova-Plugins-and-Determining-what-supports-what
guid: 5321
---

<p>
Earlier today a user on the Cordova development list asked if plugins are tested against only the current release of the SDK. This brought up an interesting discussion that I'm summarizing here. 
</p>
<!--more-->
<p>
First, there is still an idea of "core" plugins versus "third party" plugins. Core plugins include the things that have traditionally been part of the core feature set, like Camera and Geolocation. While there is no firm list of what is considered core, I'd say anything under the org.apache.cordova namespace is core. You can see a list of them here: <a href="http://plugins.cordova.io/#/search?search=org.apache.cordova">http://plugins.cordova.io/#/search?search=org.apache.cordova</a>
</p>

<p>
The question was - in general - when a new version of a plugin is released, is it tested against the most recent version of Cordova.
</p>

<p>
The answer is yes. Nice and simple. Michal Mocny (Apache Cordova committer) had this to say:
</p>

<p>
"When we do a platform release, we test with the latest
plugins to make sure the platform isn't breaking things.  When we do a
plugins release, we test with the latest platforms to make sure the plugins
are not breaking things."
</p>

<p>
Again, nice and simple. Michal also mentioned something I hadn't noticed before. If you go to plugins.cordova.io and view an individual plugin, you <strong>may</strong> see this:
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot112.png" />
</p>

<p>
This comes from the plugin's plugin.xml file containing the engine tag. As an example:
</p>

<pre><code class="language-markup">
&lt;engines&gt;
&lt;engine name="cordova" version="&gt;=3.0.0" /&gt;
&lt;/engines&gt;
</code></pre>

<p>
Unfortunately, not all plugins use this, and obviously you have to trust the developer when they said they've tested something.
</p>

<p>
It is also worth nothing that the engine referenced above refers to the CLI, not an individual platform release. It should still be relatively safe, but keep that in mind as well.
</p>