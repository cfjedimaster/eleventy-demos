---
layout: post
title: "Can you manually run your ColdFusion's onServerStart CFC?"
date: "2011-06-14T14:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/06/14/Can-you-manually-run-your-ColdFusions-onServerStart-CFC
guid: 4265
---

Yes. Done. End of post. See ya. Ok - bad joke. Let me be a bit more verbose. Earlier today a user on Twitter asked if it was possible to manually run your ColdFusion's OnServerStart component. This is the component you register within your CF Admin to run on server startup, as I've done here:
<!--more-->
<p>

<img src="https://static.raymondcamden.com/images/ScreenClip115.png" />

<p>

Here is the CFC I wrote, which just does a simple log:

<p>

<code>
component {

	public function onServerStart() {
		writelog(file="application", text="Starting up at #now()#");	
	}
}
</code>

<p>

And the answer is - as I said above - yes. You can call it from any other CFM/CFC you wish:

<p>

<code>
&lt;cfset myServer = new myServer()&gt;
&lt;cfset myServer.onServerStart()&gt;
</code>

<p>

The only thing to keep in mind is that - much like calling Application.cfc methods manually - your call will not be automatically single threaded as a "real" onServerStart call is. I have to say that I've yet to use this feature in production yet. Anyone else? Also - I want to give props to Daria for answering this on <a href="http://stackoverflow.com/questions/6346742/coldfusion-call-onserverstart-manually">Stack Overflow</a> as well.