---
layout: post
title: "A simple RSS reader in NativeScript"
date: "2016-05-23T07:17:00-07:00"
categories: [development,mobile]
tags: [nativescript]
banner_image: 
permalink: /2016/05/23/a-simple-rss-reader-in-nativescript
---

Last [week](https://www.raymondcamden.com/2016/05/16/thoughts-on-nativescript-20/) I wrote up my initial
thoughts on working with [NativeScript](https://www.nativescript.org). After working through the getting started guide, I thought I'd take a stab at building a simple app, a RSS reader. Before going further, note that you should assume my code is crap. It works - but I'm sure I've done things like - well - a noob. Because I am. So I'd think twice before using my code. (Although you are welcome to it - I'll have a link to the code at the end.)

<!--more-->

My RSS reader consists of two screens - an initial list based on the entries from an RSS feed and a detail page for the actual blog entry. Here's the initial screen.

<img src="https://static.raymondcamden.com/images/2016/05/nsr1.png" class="imgborder" alt="Screen shot 1">

To be clear, that lovely red header there was me using my design chops. Don't blame NativeScript for that. Anyway, here's the detail view:

<img src="https://static.raymondcamden.com/images/2016/05/nsr2.png" class="imgborder" alt="Screen shot 2">

That's a lot of text (partially because that blog entry really does have a lot of text at first) and not terribly nice looking, but it works. Now let's take a look at the code.

First off, the home page view, which is really just a list.

<pre><code class="language-markup">
&lt;Page xmlns=&quot;http:&#x2F;&#x2F;schemas.nativescript.org&#x2F;tns.xsd&quot; navigatingTo=&quot;loaded&quot;&gt;

	&lt;Page.actionBar&gt;
		&lt;ActionBar title=&quot;{% raw %}{{ title }}{% endraw %}&quot; &#x2F;&gt;
	&lt;&#x2F;Page.actionBar&gt;

	&lt;StackLayout orientation=&quot;vertical&quot;&gt;
		&lt;ListView items=&quot;{% raw %}{{ rssList.feedItems }}{% endraw %}&quot; itemTap=&quot;loadItem&quot;&gt;
			&lt;ListView.itemTemplate&gt;
				&lt;Label text=&quot;{% raw %}{{ title }}{% endraw %}&quot; horizontalAlignment=&quot;left&quot; verticalAlignment=&quot;center&quot; &#x2F;&gt;
			&lt;&#x2F;ListView.itemTemplate&gt;
		&lt;&#x2F;ListView&gt;
	&lt;&#x2F;StackLayout&gt;
&lt;&#x2F;Page&gt;
</code></pre>

Nothing too special here. You've got a list with a tap handler. On top you can see a call to `loaded()` for when the page loads. Now let's look at the code behind this.

<pre><code class="language-javascript">
var RssListViewModel = require(&#x27;..&#x2F;shared&#x2F;view-models&#x2F;rss-list-view-model&#x27;);
var frameModule = require(&#x27;ui&#x2F;frame&#x27;);

var config = require(&#x27;..&#x2F;shared&#x2F;config&#x27;);

var Observable = require(&#x27;data&#x2F;observable&#x27;).Observable;
var viewModule = require(&#x27;ui&#x2F;core&#x2F;view&#x27;);
var page;

var pageData = new Observable({
	rssList:RssListViewModel,
	title:config.title
});


exports.loaded = function(args) {
	page = args.object;
	page.bindingContext = pageData;
	&#x2F;&#x2F;RssListViewModel.empty();
	RssListViewModel.load();
};

exports.loadItem = function(args) {
	console.log(&#x27;tap item&#x27;,args.index);
	console.log(&#x27;tap item 2&#x27;, args.view.bindingContext.title);
	&#x2F;&#x2F;rssList.viewModel.set(&#x27;selectedItem&#x27;, args.view.bindingContext);
	RssListViewModel.viewModel.set(&#x27;selectedItem&#x27;, args.view.bindingContext);
	frameModule.topmost().navigate(&#x27;views&#x2F;item-page&#x27;);
}
</code></pre>

So for the most part, this too is rather simple. Most of the logic is in a view module. This file basically handles asking the view model to do it's thing and return a list of RSS entries. 

I do want to point out one thing. Notice in `loadItem()` I call a set operation. This is how I handle "I'm leaving this view but want to remember what I clicked." This one thing took me roughly 70% of the development time for this project. Why? At first, I was creating an instance of my view model, not just requiring it. I did this on my detail page too. That meant when I set a value on it on the list page, I lost that when the object was recreated on the detail page. That seems trivial, but it took me forever to get around that.

I also discovered later that you can pass random data to another view via navigate. You can see that described [here](http://docs.nativescript.org/api-reference/classes/_ui_frame_.frame.html#navigate) in the docs. I didn't see that at first because when I went to the API reference in the docs, I was initially on the "Module" for Frame and not the "Class" for it. I honestly don't know the difference (I just asked on Slack though so hopefully I'll get a clue ;).

Now let's look at the detail page.

<pre><code class="language-markup">
&lt;Page xmlns=&quot;http:&#x2F;&#x2F;schemas.nativescript.org&#x2F;tns.xsd&quot; navigatingTo=&quot;loaded&quot;&gt;

	&lt;Page.actionBar&gt;
		&lt;ActionBar title=&quot;{% raw %}{{ title }}{% endraw %}&quot; &#x2F;&gt;
	&lt;&#x2F;Page.actionBar&gt;

	&lt;StackLayout orientation=&quot;vertical&quot;&gt;
		&lt;ScrollView&gt;
			&lt;HtmlView html=&quot;{% raw %}{{ text }}{% endraw %}&quot; &#x2F;&gt;
		&lt;&#x2F;ScrollView&gt;
	&lt;&#x2F;StackLayout&gt;
&lt;&#x2F;Page&gt;
</code></pre>

Again - fairly simple. I first used a TextView and of course that doesn't render HTML. I did find odd performance issues with this control. The first few views worked perfect. Then I saw a noticeable lag in rendering the view. I'd say maybe 2-3 seconds. I'm fairly certain it is probably my code, but I've let me friends on the NativeScript code know about what I encountered. Ok, so now the code behind the view.

<pre><code class="language-javascript">
var RssListViewModel = require(&#x27;..&#x2F;shared&#x2F;view-models&#x2F;rss-list-view-model&#x27;);
var Observable = require(&#x27;data&#x2F;observable&#x27;).Observable;

var pageData = new Observable({
	title:&quot;&quot;,
	text:&quot;&quot;
});

exports.loaded = function(args) {

	page = args.object;
	page.bindingContext = pageData;
	
	console.log(&#x27;loaded the item page&#x27;);
	console.log(RssListViewModel.viewModel.get(&#x27;selectedItem&#x27;).title);
	pageData.title = RssListViewModel.viewModel.get(&#x27;selectedItem&#x27;).title;
	pageData.text = RssListViewModel.viewModel.get(&#x27;selectedItem&#x27;).description;

}
</code></pre>

Basically I ask for the data I saved in the previous view and update a local observable. I had tried to bind directly to my instance of RssListViewModel, but noticed that content only updated one time. Again - that's possibly my fault.

Finally, let's look at the view model. I used one of the methods I described in my blog post on the topic - [Parsing RSS Feeds in JavaScript - Options](https://www.raymondcamden.com/2015/12/08/parsing-rss-feeds-in-javascript-options/). Just in case it isn't obvious - yes - I used something in NativeScript that worked perfectly fine for Cordova too. While I may struggle a bit with the UI of NativeScript and other aspects, being able to re-use stuff I've already learned in the hybrid space is a big win. Anyway, the code:

<pre><code class="language-javascript">
var observable = require(&#x27;data&#x2F;observable&#x27;);
var ObservableArray = require(&#x27;data&#x2F;observable-array&#x27;).ObservableArray;
var fetchModule = require(&#x27;fetch&#x27;);
var config = require(&#x27;..&#x2F;config&#x27;);

function handleErrors(response) {
	if (!response.ok) {
		console.log(JSON.stringify(response));
		throw Error(response.statusText);
	}
	return response;
}

exports.empty = function() {
	while (feedItems.length) {
		feedItems.pop();
	}
};

exports.load = function name(params) {
	console.log(&#x27;CALLING LOAD&#x27;);
	&#x2F;&#x2F;handle caching
	if(feedItems.length &gt; 0) {
		console.log(&#x27;leaving early&#x27;);
		return;
	}

	return fetch(&#x27;https:&#x2F;&#x2F;query.yahooapis.com&#x2F;v1&#x2F;public&#x2F;yql?q=select{% raw %}%20title%{% endraw %}2Clink{% raw %}%2Cdescription%{% endraw %}20from{% raw %}%20rss%{% endraw %}20where{% raw %}%20url%{% endraw %}3D{% raw %}%22&#x27;+encodeURIComponent(config.rssURL)+&#x27;%{% endraw %}22&amp;format=json&amp;diagnostics=true&#x27;, {
	})
	.then(handleErrors)
	.then(function(response) {
		return response.json();
	}).then(function(data) {
		console.log(&#x27;number of rss entries: &#x27;+data.query.results.item.length);
		data.query.results.item.forEach(function(feedItem) {
			feedItems.push({
						title: feedItem.title,
						link: feedItem.link,
						description: feedItem.description
					}
			);
		
		});
	});

}

var feedItems = new ObservableArray();
exports.feedItems = feedItems;

var viewModel = new observable.Observable();
exports.viewModel = viewModel;
</code></pre>

This is - I assume - mostly self-explanatory, but let me know in the comments below if anything isn't clear. There's one more file I didn't show yet - a simple config object I can use to quickly change the title of the app and the RSS feed:

<pre><code class="language-javascript">
module.exports = {
	rssURL:&quot;http:&#x2F;&#x2F;feeds.feedburner.com&#x2F;raymondcamdensblog&quot;,
	title:&quot;Raymond Camden&#x27;s Blog&quot;
}
</code></pre>

There's two things missing from this app that I'd like to correct. First, a good mobile application should recognize when it is offline. I need to update the app to notice that, let the user know, and possibly start working again once network connectivity is restored. Secondly, many RSS feeds only contain a small portion of the entry text. I'd like to add a button that would open the entry in the native browser for proper reading.

Want the complete code? (And again, remember that it is code being written by a noob. I'd hate to be [accused](https://gist.github.com/WebReflection/f04425ce4cfeb18d75236cb50255e4bc) of leading people to bad code.) You can find the complete source here: [https://github.com/cfjedimaster/NativeScriptDemos/tree/master/rssTest1](https://github.com/cfjedimaster/NativeScriptDemos/tree/master/rssTest1).