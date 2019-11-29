---
layout: post
title: "Using URL Paths in OpenWhisk Web Actions"
date: "2017-05-17T08:42:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/05/17/using-url-paths-in-openwhisk-web-actions
---

Time for another quick OpenWhisk tip. As you know (or may know!), when you create an OpenWhisk [web action](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_webactions.html#openwhisk_webactions), you can pass parameters via the query string or via a form post. So consider the following trivial action:

<pre><code class="language-javascript">function main(args) {

    if(!args.name) args.name = 'Nameless';
	let result = {
		string:'Hello '+args.name
	}

	return {
		headers: { 
			'Access-Control-Allow-Origin':'*',
			'Content-Type':'application/json'
		}, 
		statusCode:200,
		body: new Buffer(JSON.stringify(result)).toString('base64')
	}

}
</code></pre>

All this action does is say hello to a name that comes from the arguments passed to the function. After creating the action (and enabling web support), you can then hit it at your URL like so:

<a href="https://openwhisk.ng.bluemix.net/api/v1/web/rcamden@us.ibm.com_My%20Space/safeToDelete/pathTest">
https://<span></span>openwhisk.ng.bluemix.net/api/v1/web/<br/>rcamden@us.ibm.com_My%20Space/safeToDelete/pathTest</a>

And pass a name like so:

<a href="https://openwhisk.ng.bluemix.net/api/v1/web/rcamden@us.ibm.com_My%20Space/safeToDelete/pathTest?name=Raymond+Camden">
https://<span></span>openwhisk.ng.bluemix.net/api/v1/web/<br/>rcamden@us.ibm.com_My%20Space/safeToDelete/pathTest?name=Raymond+Camden</a>

Cool. But what if you want to use the URL path instead of query parameters? Perhaps something like so:

<a href="https://openwhisk.ng.bluemix.net/api/v1/web/rcamden@us.ibm.com_My%20Space/safeToDelete/pathTest/name/Raymond+Camden">
https://<span></span>openwhisk.ng.bluemix.net/api/v1/web/<br/>rcamden@us.ibm.com_My%20Space/safeToDelete/pathTest/name/Raymond+Camden</a>

The good news is that this is pretty simple to support. OpenWhish will pass this information to your action as `args.__ow_path`. OpenWhisk actually passes a bunch of things you can read about [here](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_webactions.html#http-context), but for our purposes, the __ow_path value is all we need. So consider this new version:

<pre><code class="language-javascript">function main(args) {

	if(args.__ow_path && args.__ow_path.length) {
		/*
		support /name/X only
		*/
		let parts = args.__ow_path.split('/');
		if(parts.length === 3 && parts[1].toLowerCase() === 'name') {
			args.name = decodeURIComponent(parts[2]);
		}
	}

    if(!args.name) args.name = 'Nameless';
	let result = {
		string:'Hello '+args.name
	}


	return {
		headers: { 
			'Access-Control-Allow-Origin':'*',
			'Content-Type':'application/json'
		}, 
		statusCode:200,
		body: new Buffer(JSON.stringify(result)).toString('base64')
	}

}
</code></pre>

All I've done is look for the path, see if it has length, and then I parse it. Now - in my particular case I'm assuming only one valid path: `/name/X`. Obviously you could write the code to be a bit more generic, perhaps in the form of: `/name/value/name/value` etc. But to keep it simple I just look for `/name/X` and if that matches, set args.name to it. The result works perfectly:

![This is fine](https://static.raymondcamden.com/images/2017/5/owpath1.png)

Heh, oops. Almost. So you may have noticed I used `decodeURIComponent` above, and it works correctly if you encode spaces with %20:

<a href="https://openwhisk.ng.bluemix.net/api/v1/web/rcamden@us.ibm.com_My{% raw %}%20Space/safeToDelete/pathTest/name/Raymond%{% endraw %}20Camden">
https://<span></span>openwhisk.ng.bluemix.net/api/v1/web/<br/>rcamden@us.ibm.com_My{% raw %}%20Space/safeToDelete/pathTest/name/Raymond%{% endraw %}20Camden</a>

![This is ok](https://static.raymondcamden.com/images/2017/5/owpath2.png)

So from what I've seen in my research, the plus sign is *not* meant to be decoded, and it may actually be part of the original string. So what you do here is up to you really. In this *particular use case* where I'm working with names, it would probably be safe to go ahead and replace plus signs with spaces:

<pre><code class="language-javascript">args.name = decodeURIComponent(parts[2]).replace(/\+/g, ' ');</code></pre>

I hope this helps! As a quick aside, the URL in my tests includes `safeToDelete`. That has *nothing* to do with the post. I'm just trying to use that package as a way to flag to myself actions I can safely delete later. (As you can imagine, I've got a *bunch* of crap up now on OpenWhisk and I'm starting to feel like I need to clean up a bit!)