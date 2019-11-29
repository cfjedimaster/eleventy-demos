---
layout: post
title: "Working on my NativeScript RSS Application"
date: "2016-05-27T08:32:00-07:00"
categories: [development,mobile]
tags: [nativescript]
banner_image: 
permalink: /2016/05/27/working-on-my-nativescript-rss-application
---

A few days ago I [blogged](https://www.raymondcamden.com/2016/05/23/a-simple-rss-reader-in-nativescript/) about my experiences building a simple RSS reader with [NativeScript](https://www.nativescript.org/). Today I'm coming back to the application to take care of two problems I mentioned in the previous post.

<!--more-->

The first problem I wanted to handle was checking for network connectivity before trying to load the RSS feed. In Apache Cordova, this is done via the Network Information plugin. I began searching the NativeScript docs for something similar and was surprised to discover that nothing like that existed.

Except I was wrong.

I kinda touched on the docs in my [first post](https://www.raymondcamden.com/2016/05/16/thoughts-on-nativescript-20/) on NativeScript. I mentioned how I thought the tutorial was well done, but I found the rest of the docs a bit awkward at times. I'm upgrading that initial impression from "awkward" to "frustrating." There are multiple issues with the docs that makes finding particular APIs kind of difficult. As an example, I needed to figure out how to navigate to a page but specify no back button. I knew that existed but it took maybe 15 minutes to find the darn docs, and I only found it this time because I remembered the particular name of a class. I couldn't get there via straight clicking.

To make matters worse, the code that handles what I needed to do is found under the "Cookbook" section of the docs. Now I don't know about you - but to me - "Cookbook" implies a set of examples in the form of, "Do X with NativeScript". It absolutely does *not* imply "API Reference", but that's what it is. Kinda. I honestly don't know. I did find the network connectivity stuff there, but then other things like UI components are not there. The docs really need a clearer TOC or organization. All the stuff is there, but now that I'm beyond "Hello World" in NativeScript, I'm struggling to actually use it. 

Enough complaining - and as an FYI - I did the right thing and tried to summarize this in reported issues on their [GitHub repo](https://github.com/nativescript/docs). 

To detect a network connection, you simply need to import the <code>[connectivity](http://docs.nativescript.org/cookbook/connectivity)</code> module. I added this to my initial JavaScript file for my view. Maybe I should do this in my app.js instead. I then simply ran `connectivity.getConnectionType();` to get the type. This returns a value that represents either none, wifi, or mobile. You can also use it to monitor changes as well. To keep things simple, I just check it once. Here's my new `main-page.js`.

<pre><code class="language-javascript">
var RssListViewModel = require('../shared/view-models/rss-list-view-model');
var frameModule = require('ui/frame');
var connectivity = require('connectivity');

var config = require('../shared/config');

var Observable = require('data/observable').Observable;
var viewModule = require('ui/core/view');
var page;

var pageData = new Observable({
	rssList:RssListViewModel,
	title:config.title
});


exports.loaded = function(args) {
	page = args.object;
	page.bindingContext = pageData;
	var connectionType = connectivity.getConnectionType();
	if(connectivity.getConnectionType() === connectivity.connectionType.none) {
		var navigationEntry = {
			backstackVisible:false,
			clearHistory:true,
			moduleName:'views/no-network'
		}
		frameModule.topmost().navigate(navigationEntry);
	} else {
		RssListViewModel.load();
	}
};

exports.loadItem = function(args) {
	RssListViewModel.viewModel.set('selectedItem', args.view.bindingContext);
	frameModule.topmost().navigate('views/item-page');
}
</code></pre>

As you can see, I simply navigate to a new view if the user is offline. Note the use of `navigationEnty` as a way to pass configuration information about the transition itself. For my new view, I simply added a message and a button the user could click to see if they were online. Again - the `connectivity` module supports events so I could have automated this. First - the view.

<pre><code class="language-javascript">
&lt;Page xmlns=&quot;http://schemas.nativescript.org/tns.xsd&quot; navigatingTo=&quot;loaded&quot;&gt;

	&lt;Page.actionBar&gt;
		&lt;ActionBar title=&quot;Offline&quot; /&gt;
	&lt;/Page.actionBar&gt;

	&lt;StackLayout orientation=&quot;vertical&quot;&gt;
		&lt;TextView text=&quot;Sorry, but you are currently offline.&quot; /&gt;
		&lt;Button text=&quot;Check Again&quot; tap=&quot;checkConnectivity&quot; /&gt;
	&lt;/StackLayout&gt;
&lt;/Page&gt;
</code></pre>

And here is how it looks.

<img src="https://static.raymondcamden.com/images/2016/05/rss2ns.png" class="imgborder" alt="Offline screen">

Not the prettiest UI, but that's my fault, not NativeScript. For now, it gets the job done. Here's how the button works.

<pre><code class="language-javascript">
var frameModule = require('ui/frame');
var connectivity = require('connectivity');
var dialogs = require("ui/dialogs");

var viewModule = require('ui/core/view');
var page;

exports.loaded = function(args) {
	page = args.object;
};

exports.checkConnectivity = function(args) {
	var connectionType = connectivity.getConnectionType();
	if(connectivity.getConnectionType() === connectivity.connectionType.none) {
		dialogs.alert({
			message:'Sorry, but you are still offline.',
			title:'Offline',
			okButtonText:'Close'
		});
	} else {
		frameModule.topmost().navigate('views/main-page');
	}
}
</code></pre>

This is pretty much what you would expect - check connectivity and if still bad, let the user know, otherwise send them to the home page. 

Woot! Ok, now for the next change. Some RSS feeds only provide a snippet of text. I wanted to do something similar to Cordova's InAppBrowser, a "mini" web browser that can be closed leaving the user back in the app. I was not able to find that for NativeScript. I did, however, find a way to at least open the system browser. I began by modifying the view to include a bottom at the end of the page. (Thanks to the helpful folks in the NativeScript Slack channel!) Here's the new code.

<pre><code class="language-javascript">
&lt;Page xmlns=&quot;http://schemas.nativescript.org/tns.xsd&quot; navigatingTo=&quot;loaded&quot;&gt;

	&lt;Page.actionBar&gt;
		&lt;ActionBar title=&quot;{% raw %}{{ title }}{% endraw %}&quot; /&gt;
	&lt;/Page.actionBar&gt;
	&lt;GridLayout rows=&quot;*,auto&quot;&gt;
		&lt;ScrollView&gt;
			&lt;HtmlView html=&quot;{% raw %}{{ text }}{% endraw %}&quot; /&gt;
		&lt;/ScrollView&gt;
		&lt;Button text=&quot;Open in Browser&quot; class=&quot;openButton&quot; row=&quot;1&quot; tap=&quot;openURL&quot; /&gt;
	&lt;/GridLayout&gt;
&lt;/Page&gt;
</code></pre>

And here's the result:

<img src="https://static.raymondcamden.com/images/2016/05/rss2ns2.png" class="imgborder" alt="New button">

The code for this is pretty simple:

<pre><code class="language-javascript">
var utils = require('utils/utils');

//stuff here I cut out for space

exports.openURL = function() {
	utils.openUrl(RssListViewModel.viewModel.get('selectedItem').link);	
}
</code></pre>

And it works as expected:

<img src="https://static.raymondcamden.com/images/2016/05/rss2ns3.png" class="imgborder" alt="Web view">

The big issue though is that the user has now left the app and may not know how to return. Maybe someone in the NativeScript community would have a suggestion to help out here. 

Anyway - as before - I've included the full source code of this in my NativeScript GitHub repo. You can find it here: [https://github.com/cfjedimaster/NativeScriptDemos/tree/master/rssTest2](https://github.com/cfjedimaster/NativeScriptDemos/tree/master/rssTest2)