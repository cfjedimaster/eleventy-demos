---
layout: post
title: "Using MobileFirst HTTP Adapters with an Ionic Application"
date: "2015-04-08T14:03:43+06:00"
categories: [development,html5,javascript,mobile]
tags: [ionic,mobilefirst]
banner_image: 
permalink: /2015/04/08/using-mobilefirst-http-adapters-with-an-ionic-application
guid: 5981
---

Last week I <a href="http://www.raymondcamden.com/2015/04/02/using-mobilefirst-sql-adapters-with-an-ionic-application">blogged</a> about how to use <a href="http://www.ibm.com/mobilefirst/us/en/">MobileFirst</a> with <a href="http://ionicframework.com">Ionic</a>. Today I'm going to show another example of an adapter - the HTTP adapter.

<!--more-->

As you can probably guess, a HTTP adapter is simply a proxy between your mobile app and some other URL. So why would you bother? There's a couple of reasons why this may be beneficial.

<strong>Tracking and Logging:</strong> By using a HTTP adapter, you get a complete look at resources your mobile application is using. Imagine, for example, that you are using a service that charges per 1000 calls. By using a HTTP adapter, you can ensure that what the provider says your apps are using is accurate.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/Screen-Shot-2015-04-08-at-13.04.34.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/Screen-Shot-2015-04-08-at-13.04.34.png" alt="Screen Shot 2015-04-08 at 13.04.34" width="850" height="1043" class="alignnone size-full wp-image-5982" /></a>

The MobileFirst back end will report on average response time, data size, and even let you filter by environment and version. (For example, maybe your iOS users are using more network resources than Android.)

<strong>Filtering and Modifying:</strong> Your preferred back end service may return data that you don't necessarily need. By writing custom logic in your adapter, you can strip out, or modify, the data to match your app's needs. This is great for times when you are using an API you do not have control over. The default adapter code uses an example of converting an RSS feed XML result set into a smaller JSON result. This isn't even necessary as MobileFirst will convert the result to JSON anyway, but the example demonstrates returning a <i>slimmer</i> result set, dropping stuff not needed for the application. 

<strong>Portability:</strong> By using an adapter, you can swap out services at will. For example, you can switch from one stock quote provider to another based on costs and service reliability. Best of all - you can make these changes without having to push new versions of the application out to the market. You simply modify the adapter.

For my test, I decided to build a modified version of the default HTTP adapter code. I'd use their RSS XSLT code to parse my RSS feed into something sensible. As you saw in the last post, adding an adapter is rather simple. Use the mfp command line to add the adapter. Just give it a sensible name and select the proper type:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/mfp1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/mfp1.png" alt="mfp1" width="662" height="197" class="alignnone size-full wp-image-5983" /></a>

Select the defaults for the remaining prompts and you're good to go. The adapter creates three files: filtered.xsl, myHTTPTest-impl.js, and myHTTPTest.xml. As I stated in the last blog post, the names of the impl and xml files are based on the adapter name. The XML file lets you configure various defaults, but oddly, not the complete url. As far as I can see I could only specify the domain for my RSS feed. I also modified the procedure names to something simpler.

<pre><code class="language-markup">&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
&lt;!--
    Licensed Materials - Property of IBM
    5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
    US Government Users Restricted Rights - Use, duplication or
    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
--&gt;
&lt;wl:adapter name=&quot;httpTest&quot;
	xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;
	xmlns:wl=&quot;http://www.ibm.com/mfp/integration&quot;
	xmlns:http=&quot;http://www.ibm.com/mfp/integration/http&quot;&gt;

	&lt;displayName&gt;httpTest&lt;/displayName&gt;
	&lt;description&gt;httpTest&lt;/description&gt;
	&lt;connectivity&gt;
		&lt;connectionPolicy xsi:type=&quot;http:HTTPConnectionPolicyType&quot;&gt;
			&lt;protocol&gt;http&lt;/protocol&gt;
			&lt;domain&gt;feeds.feedburner.com&lt;/domain&gt;
			&lt;port&gt;80&lt;/port&gt;
			&lt;connectionTimeoutInMilliseconds&gt;30000&lt;/connectionTimeoutInMilliseconds&gt;
			&lt;socketTimeoutInMilliseconds&gt;30000&lt;/socketTimeoutInMilliseconds&gt;
			&lt;maxConcurrentConnectionsPerNode&gt;50&lt;/maxConcurrentConnectionsPerNode&gt;
			&lt;!-- Following properties used by adapter's key manager for choosing specific certificate from key store
			&lt;sslCertificateAlias&gt;&lt;/sslCertificateAlias&gt;
			&lt;sslCertificatePassword&gt;&lt;/sslCertificatePassword&gt;
			--&gt;
		&lt;/connectionPolicy&gt;
	&lt;/connectivity&gt;

	&lt;procedure name=&quot;getFeed&quot;/&gt;


&lt;/wl:adapter&gt;</code></pre>

Now let's look at the JavaScript implementation. As I said, the default code supports loading a RSS feed, but it had complexities I did not need. My version is somewhat smaller then.

<pre><code class="language-javascript">function getFeed() {

	var input = {
	    method : 'get',
	    returnedContentType : 'xml',
	    path : 'raymondcamdensblog'
	};

	return WL.Server.invokeHttp(input);
}</code></pre>

And that's it for the server-side. As I mentioned in my <a href="http://www.raymondcamden.com/2015/04/06/some-tips-for-writing-javascript-adapters-for-ibm-mobilefirst">post on adapters</a>, each adapter is session based. I could add some basic caching here, but it would only apply to one user at a time. 

Now let's turn our attention to the front-end. I'm going to use Ionic for the display and I'll use a simple two-page app like I had before. The home page will show all the items from an RSS feed. 

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/iOS-Simulator-Screen-Shot-Apr-8-2015-1.19.43-PM.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/iOS-Simulator-Screen-Shot-Apr-8-2015-1.19.43-PM.png" alt="iOS Simulator Screen Shot Apr 8, 2015, 1.19.43 PM" width="422" height="750" class="alignnone size-full wp-image-5984 imgborder" /></a>

Clicking an entry then sends you to the detail:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/iOS-Simulator-Screen-Shot-Apr-8-2015-1.22.47-PM.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/iOS-Simulator-Screen-Shot-Apr-8-2015-1.22.47-PM.png" alt="iOS Simulator Screen Shot Apr 8, 2015, 1.22.47 PM" width="422" height="750" class="alignnone size-full wp-image-5986 imgborder" /></a>

Because this was so similar to my last post, I literally just copied it and modified the services file. 

<pre><code class="language-javascript">angular.module('starter.services', [])

.factory('ContentService', function($q) {

	var items = [];

	function getAll() {
		var deferred = $q.defer();

		var req = new WLResourceRequest(&quot;/adapters/httpTest/getFeed&quot;, WLResourceRequest.GET);

		req.send().then(function(res) {
			items = res.responseJSON.rss.channel.item;
			deferred.resolve(res.responseJSON.rss.channel.item);
		}, function(bad) {
			console.log(&quot;bad&quot;);
			console.dir(bad);
			deferred.reject(&quot;um something here&quot;);
		});

		return deferred.promise;
	}

	function getOne(id) {
		//ok, now async now, but lets keep the promise in case the future
		var deferred = $q.defer();
		deferred.resolve(items[id]);

		return deferred.promise;
	}

	return {
		getAll:getAll,
		getOne:getOne
	};

});</code></pre>

The first thing I want to point out is that this version uses a simpler API to invoke the adapter: WLResourceRequest. I simply provide a path that includes my adapter name (not the same as what you see above) and procedure. And... that's it. I then just dumped out the result to console so I could see the proper key to return. I did have to modify my templates a tiny bit since the RSS data wasn't the exact same as my database of course, but you get the idea.

For fun, let's add a footer bar to the detail view with a button to load the full site:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/mf2.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/mf2.png" alt="mf2" width="422" height="750" class="alignnone size-full wp-image-5987 imgborder" /></a>

Here's the updated view code for that:

<pre><code class="language-markup">&lt;ion-view&gt;
	&lt;ion-nav-title&gt;{% raw %}{{detail.title}}{% endraw %}&lt;/ion-nav-title&gt;

	&lt;ion-content class=&quot;padding&quot;&gt;

		&lt;div class=&quot;card&quot;&gt;

		  &lt;div class=&quot;item item-divider&quot;&gt;
		    {% raw %}{{detail.title}}{% endraw %}
		  &lt;/div&gt;

		  &lt;div class=&quot;item item-text-wrap&quot;&gt;
		    &lt;p&gt;
				{% raw %}{{detail.description}}{% endraw %}
		    &lt;/p&gt;
		  &lt;/div&gt;

		  &lt;div class=&quot;item item-divider&quot;&gt;
		    {% raw %}{{detail.pubDate}}{% endraw %}
		  &lt;/div&gt;

		&lt;/div&gt;

	&lt;/ion-content&gt;

	&lt;ion-footer-bar class=&quot;bar-dark&quot;&gt;
			&lt;button class=&quot;button button-positive icon-left ion-upload&quot;
			ng-click=&quot;readEntry(detail)&quot;&gt;
				Full Entry
			&lt;/button&gt;
	&lt;/ion-footer-bar&gt;

&lt;/ion-view&gt;</code></pre>

The addition is at the bottom. readEntry simply makes use of the InAppBrowser plugin. This is included automatically within MobileFirst projects. 

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/iOS-Simulator-Screen-Shot-Apr-8-2015-1.39.05-PM.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/iOS-Simulator-Screen-Shot-Apr-8-2015-1.39.05-PM.png" alt="iOS Simulator Screen Shot Apr 8, 2015, 1.39.05 PM" width="422" height="750" class="alignnone size-full wp-image-5988 imgborder" /></a>