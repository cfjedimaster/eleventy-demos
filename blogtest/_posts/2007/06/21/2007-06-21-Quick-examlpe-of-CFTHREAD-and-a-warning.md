---
layout: post
title: "Quick example of CFTHREAD - and a warning"
date: "2007-06-21T23:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/21/Quick-examlpe-of-CFTHREAD-and-a-warning
guid: 2141
---

Other people have talked about CFTHREAD (see Ben Nadel's excellent <a href="http://www.bennadel.com/index.cfm?dax=blog:743.view">post</a> on the topic) so I'm not going to bother with a full description of the tag. Instead I wanted to show a quick example of where I've already put it to use in production, and I wanted to share a warning about how you have to be careful when using the tag.
<!--more-->
<a href="http://www.blogcfc.com">BlogCFC</a> makes use of a ping feature when posting entries. This lets you inform blog aggregators that you've written a new blog post. This way your latest devotional on Paris Hilton won't be missed by the masses. 

Most aggregators simply take a simple HTTP hit, while others take a bit more work. BlogCFC supports simple HTTP pings, as well as Technorati, Weblogs, and Icerocket. The code is rather simple. You pass in the URLs you want to ping and this code block loops over them:

<code>
&lt;cfloop index="aURL" list="#arguments.pingurls#"&gt;

	&lt;cfif aURL is "@technorati"&gt;
		&lt;cfset pingTechnorati(arguments.blogTitle, arguments.blogURL)&gt;
	&lt;cfelseif aURL is "@weblogs"&gt;
		&lt;cfset pingweblogs(arguments.blogTitle, arguments.blogURL)&gt;
	&lt;cfelseif aURL is "@icerocket"&gt;
		&lt;cfset pingIceRocket(arguments.blogTitle, arguments.blogURL)&gt;
	&lt;cfelse&gt;
		&lt;cfhttp url="#aURL#" method="GET" resolveurl="false"&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

Rather simple, eh? Unfortunately this was also the slowest part of publishing a new blog entry. At times it would take up to 30 seconds to complete. This was an obvious place where CFTHREAD could help. I didn't need to even wait for the threads to finish. I could fire them off and forget about them. This was done by simply adding CFTHREAD around the code:

<code>
&lt;cfthread action="run" name="#arguments.blogurl#_#arguments.blogtitle#_#aurl#" blogtitle="#arguments.blogtitle#" blogurl="#arguments.blogurl#" aURL="#aURL#"&gt;
	&lt;cfif aURL is "@technorati"&gt;
		&lt;cfset pingTechnorati(attributes.blogTitle, attributes.blogURL)&gt;
	&lt;cfelseif aURL is "@weblogs"&gt;
		&lt;cfset pingweblogs(attributes.blogTitle, attributes.blogURL)&gt;
	&lt;cfelseif aURL is "@icerocket"&gt;
		&lt;cfset pingIceRocket(attributes.blogTitle, attributes.blogURL)&gt;
	&lt;cfelse&gt;
		&lt;cfhttp url="#attributes.aURL#" method="GET" resolveurl="false"&gt;
	&lt;/cfif&gt;
&lt;/cfthread&gt;
</code>

I supplied a unique name to my thread based on arguments passed in and the current URL being pinged. Notice too that I have to pass information into the inside of the thread. This was important since the code inside runs in its own scope.

And it's also where my warning came in. When I first wrote the code, I forgot to pass in the attributes. I <i>just</i> used cfthread and a name. The code inside the thread was erroring out and I never knew it. (Thanks to Todd for pointing this out to me.) It is something folks want to keep in mind when they use CFTHREAD. There <i>is</i> a status returned from threads that let you know if an error occurred. But since my threads were "fire and forget" (no join needed) I never realized this. Todd suggested a simple CFLOG at the end to ensure it worked. I used this for my debugging but removed it when done.

So - keep it in mind!

Oh - and the times? I love this. I mean, I <i>really</i> love this. It went from around 30 seconds per blog post to 1. Less than 1 but lets just say 1. Me Likey.