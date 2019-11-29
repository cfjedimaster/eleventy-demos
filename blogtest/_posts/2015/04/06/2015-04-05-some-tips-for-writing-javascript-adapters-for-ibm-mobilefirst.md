---
layout: post
title: "Some tips for writing JavaScript adapters for IBM MobileFirst"
date: "2015-04-06T10:09:59+06:00"
categories: [development,javascript,mobile]
tags: [mobilefirst]
banner_image: 
permalink: /2015/04/06/some-tips-for-writing-javascript-adapters-for-ibm-mobilefirst
guid: 5962
---

I've been doing a lot of playing lately with <a href="http://www.ibm.com/mobilefirst/us/en/">MobileFirst</a>, and one of the cooler features it has is the ability to write adapters in JavaScript. I <a href="http://www.raymondcamden.com/2015/04/02/using-mobilefirst-sql-adapters-with-an-ionic-application">blogged</a> about this last week and today I thought I'd share a few tips/notes for folks who may be new to this feature.

<!--more-->

First and foremost, it is important to remember that you are <i>not</i> using a full Node.js-style stack. You are working with a subset of the Rhino container developed by Mozilla. This is a JavaScript engine that runs within the context of a Java server. However, this is not a <strong>full</strong> Rhino implementation as some features, like load(), are not implemented. Unfortunately we don't document these differences (yet - I'm filing an enhancement request for this today).

Second, you cannot debug via console.log. Instead, simply use the <a href="http://www-01.ibm.com/support/knowledgecenter/SSHS8R_7.0.0/com.ibm.worklight.apiref.doc/html/refjavascript-server/html/WL.Logger.html?cp=SSHS8R_7.0.0%2F9-1-0-1-5">WL.Logger API</a> as shown below:

<pre><code class="language-javascript">function getDetail(id) {
	WL.Logger.info("getDetail, requesting id "+id);
	return WL.Server.invokeSQLStatement({
		preparedStatement : getDetailStmt,
		parameters:[id]
	});
}</code></pre>

And where do those logs show up? Type <code>mfp logs</code> at the command line to be shown where your logs exist:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/shot11.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/shot11.png" alt="shot1" width="800" height="58" class="alignnone size-full wp-image-5963" /></a>

Then you can simply go to that directory and look at messages.log. I'd simply <code>tail -f</code> it while you work to see incoming messages. The log is a bit verbose, but you could use other tools to filter it out. 

The third point to consider is that adapters are session-based. That means you can persist data by simply using a global JavaScript variable, but it will not be global to the server. 

Finally, and I've mentioned these before, but don't forget that you need to "build/deploy" when you edit your adapter files. You can use the bd shortcut for adapters just like you do for your web assets: <code>mfp bd</code>. You can also test your adapters directly from the command line using <code>mfp invoke</code>.