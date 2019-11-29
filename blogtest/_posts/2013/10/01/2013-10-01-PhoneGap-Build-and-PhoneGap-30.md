---
layout: post
title: "PhoneGap Build and PhoneGap 3.0"
date: "2013-10-01T15:10:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2013/10/01/PhoneGap-Build-and-PhoneGap-30
guid: 5052
---

<p>
Today we officially launched PhoneGap 3.0 support for <a href="http://build.phonegap.com">PhoneGap Build</a>. You can read the blog post on it here: <a href="http://phonegap.com/blog/2013/10/01/phonegap-30-now-supported/">PhoneGap 3.0 Now Supported in PhoneGap Build</a> Before you get started, there are a few things I want to call out.
</p>
<!--more-->
<p>
The first thing you should note is that Build is not yet defaulting to 3.0 when you create a new project. If you want to use 3.0, please be sure to specify it in the config.xml file:
</p>

<pre><code class="language-markup">&lt;preference name="phonegap-version" value="3.0.0" /&gt;
</code></pre> 

<p>
Next - if you remember my blog post on PhoneGap 3 (<a href="http://www.raymondcamden.com/index.cfm/2013/7/19/PhoneGap-30-Released--Things-You-Should-Know">PhoneGap 3.0 Released - Things You Should Know</a>), then you remember that the biggest change was to core features. In order to use <i>any</i> of the core features you <strong>must</strong> include the plugin for it.
</p>

<p>
<strong>PhoneGap Build also has this rule!</strong>
</p>

<p>
In order to include a core plugin with your PhoneGap Build project, simply add the gap:plugin tag to your config.xml file. Here is an example:
</p>

<pre><code class="language-markup">&lt;gap:plugin name="org.apache.cordova.core.camera" /&gt;
&lt;gap:plugin name="org.apache.cordova.core.geolocation" /&gt;
&lt;gap:plugin name="org.apache.cordova.core.dialogs" /&gt;</code></pre>

<p>
PhoneGap Build now has a "Plugins" tab for each project. This is a great way to confirm that you set up the config.xml correctly:
</p>

<p>
<img src="https://static.raymondcamden.com/images/plugins.jpg" />
</p>

<p>
If you forget the value for a particular plugin, or want to see what PhoneGap Build supports from third parties, just hit the <a href="https://build.phonegap.com/plugins">Plugins tab</a> at the very top of the page. The list of supported third-party plugins seems to be <strong>much</strong> improved!
</p>

<p>
<img src="https://static.raymondcamden.com/images/mainplugins.jpg" />
</p>

<p>
Finally, don't forget to peruse the doc updates. We recently launched the ability to <a href="https://build.phonegap.com/docs/config-xml#platform">select a platform</a>. among <a href="https://build.phonegap.com/docs/config-xml#preferences">other updates</a>.