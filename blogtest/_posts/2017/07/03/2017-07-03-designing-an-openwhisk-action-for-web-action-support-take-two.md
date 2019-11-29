---
layout: post
title: "Designing an OpenWhisk Action for Web Action Support - Take Two"
date: "2017-07-03T13:25:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/07/03/designing-an-openwhisk-action-for-web-action-support-take-two
---

Back a few months ago I wrote up a quick blog post on how an OpenWhisk action could support running in both "regular" mode and "Web Action" mode: <a href="https://www.raymondcamden.com/2017/03/02/designing-an-openwhisk-action-for-web-action-support/">Designing an OpenWhisk Action for Web Action Support</a>. I started off that blog post with a warning stating that what I was covering was bleeding edge and likely to break. Turns out I was right - it did.

I want to share a quick update to that blog post and demonstrate how it can be done now. Of course, things may *still* change in the future. In general, OpenWhisk is very good about not breaking things, and the main reason my code broke was because I was doing something not documented in the first place. However I still think this is something folks may want to do so I hope this is helpful.

I will not be rewriting the entire post, therefore, be sure you <a href="https://www.raymondcamden.com/2017/03/02/designing-an-openwhisk-action-for-web-action-support/">read</a> the post so you have some context as to what I'm doing.

Let me start off by pointing out some of the simpler differences.

First and foremost, note that the way to enable a web action has changed a bit. Now you use the <code>web</code> annotation, not <code>web-export</code>. So to "Web Action-ify" your code, you do:

<p>
<code>wsk action update nameOfAction --web true</code>
</p>

Secondly, the URLs for Web Actions no longer have "experimental" in them. Here is a URL for the "caas" action in the "default" package:

https://openwhisk.ng.bluemix.net/api/v1/web/rcamden@us.ibm.com_My%20Space/default/caas

Now, let's talk about the code. Originally, my code used this method to determine a "regular" versus Web Action call:

<pre><code class="language-javascript">function isWebInvocation(request) {
	if(request.__ow_meta_verb) return true;
	return false;
}
</code></pre>

Originally all the "meta" stuff was in __ow_meta_something. Now the meta part is gone and the verb one is just method. So an updated version of this would be:

<pre><code class="language-javascript">function isWebInvocation(request) {
	if(request.__ow_method) return true;
	return false;
}
</code></pre>

This change also has to be done to getRequestType:

<pre><code class="language-javascript">function getRequestType(request) {
	//basically sniff the Accept header
	let header = request.__ow_headers.accept;
	console.log('header', header);
	//try to normalize a bit, just caring about a few
	if(header.indexOf('text/html') >= 0) return 'html';
	if(header.indexOf('image/jpeg') >= 0) return 'image';
	if(header.indexOf('application/json') >= 0) return 'json';
	//fall out to json
	return 'json';
}
</code></pre>

Also note I added a final json result for cases where no content-type is explicitly provided. And that's it. You can test the HTML version here:

https://openwhisk.ng.bluemix.net/api/v1/web/rcamden@us.ibm.com_My%20Space/default/caas.html

The image-only version still works, but Postman isn't rendering the preview for me. I can see the right header so I don't think it is an issue. 

Finally, the old URLs still can work and the older __ow values can still be sent. If you are in production with an action and have clients pointing at the old URLs, the args you get will differ from folks using the new URLs. Thanks to <a href="http://ibm.biz/rrabbah">@rr</a> for reminding me of that on Slack (and for helping out with this in general).