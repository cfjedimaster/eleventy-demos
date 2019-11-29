---
layout: post
title: "Some thoughts on working with CFCs remotely"
date: "2011-07-08T11:07:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2011/07/08/Some-thoughts-on-working-with-CFCs-remotely
guid: 4299
---

Last night my boss pinged me with a few questions concerning ColdFusion Components (CFCs) and Flex. His questions led to a long discussion about working with remote CFCs (and to be clear, this would apply to Flex or Ajax) and what some of the best/recommended practices are. He also asked for a demo of what I was talking about so I whipped up some code this morning to illustrate the concepts. If any of this blog entry does not make sense, I'll be moderating an open chat room later today (4PM CST) on Connect: 
<p/>

<a href="https://experts.adobeconnect.com/cfjedimaster">https://experts.adobeconnect.com/cfjedimaster</a>
<p/>

Hop on in and we can talk about this blog entry, or anything else. Anyway, on with the discussion.

<p/>
<!--more-->
Let's begin with an example of a web site that includes CFCs meant to be called remotely. As I mentioned earlier, my boss was using Flex but in our case, I'm doing to everything with simple HTTP requests. No Flex, no Ajax, just all in the browser. Version 1 of my application has the following structure:

<p/>

<img src="https://static.raymondcamden.com/images/ScreenClip133.png" />

<p/>

Forgive me for including those two "Copy of" files, pretend they don't exist. You can see I've got an Application.cfc, a model folder, and two CFCs. Let's begin by looking at art.cfc:

<p/>

<code>
component {
	writelog(file="application",text="art.cfc created");

	remote string function helloWorld(string name="Nameless") {
		return "Hello, #arguments.name#";
	}

}
</code>

<p/>

Nothing too crazy here. The CFC has one method, helloWorld. But note I included a writelog in the constructor area. What's the constructor area? Any code in a CFC that is not in a method will be executed whenever a CFC is created. <b>Any code.</b> That means code on top, bottom, and even code hiding between methods. Typically you would never put code outside of methods like that, but if you do, try to put it on top. 

<p/>

So the question is - what happens when I use this CFC? If I put this in my browser: http://localhost/remotecfcexample/v1/art.cfc?method=helloworld&returnformat=json I'll get the response ("Hello, Nameless") but I'll <i>also</i> get a line in my Application.log file. If I rerun this URL a few times, I'll get multiple log entries.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip134.png" />

<p/>

What this implies is that every time a remote client (again, it could be Flex, AJAX, mobile app using Flex or AJAX, simple HTTP request, magical unicorns) a new CFC instance is created. This becomes more important as we begin to add additional CFCs and make them use each other. This is actually what spurred my boss's initial question. How - from art.cfc, could he make use of util.cfc? Let's first look at util.cfc:

<p/>

<code>
component {
	writelog(file="application",text="util.cfc created");

	public function simpleBold(required string s) {
		return "&lt;b&gt;" & arguments.s & "&lt;/b&gt;";
	}

	public function simpleItalics(required string s) {
		return "&lt;i&gt;" & arguments.s & "&lt;/i&gt;";
	}
	
}
</code>

<p/>

This CFC is - surprise surprise - a utility component. It's got a function for bolding and italicizing text. Very fancy. So how would art.cfc make use of it? In order to do so it needs to create an instance. For example:

<p/>

<code>
component {
	writelog(file="application",text="art.cfc created");

	remote string function helloWorld(string name="Nameless") {
		var util = new util();
		return util.simpleBold("Hello, #arguments.name#");
	}

}
</code>

<p/>

Nothing terribly complex here. I just made an instance of util in my method and then used it to format my text. But let's look at our log file now after a few requests.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip135.png" />

<p/>

I've got four lines there representing two separate requests. Each and every time I execute my call to helloWorld, I've got not one but two requests going on. This is probably not going to matter for 99% of web applications. ColdFusion can create CFCs fast. <i>Really fast.</i> But obviously we could be leading ourselves down a scary path if we start creating more complex components. 

<p/>

So what did I recommend?

<p/>

First, I suggested he put his core CFCs into the Application scope. This would allow him to create his CFCs one time only. It also allows him to use an initialization method to create an instance of util. The assumption being that more methods in the art.cfc will probably need it. Let's look at art.cfc first:

<p/>

<code>
component {
	writelog(file="application",text="art.cfc created");

	public function init() {
		variables.util= new util();
	}

	public string function helloWorld(string name="Nameless") {
		return variables.util.simpleBold("Hello, #arguments.name#");
	}

}
</code>

<p/>

This version has two important changes. First note the use of the init method. ColdFusion will run this automatically when the CFC is created. I store the util component in the CFC's Variables scope. Then later on in my method, I can run the utility CFC's function. util.cfc didn't change at all. Let's look at my Application.cfc:

<p/>

<code>
component {

	this.name="remotecfcdemo_v2";
	this.sessionManagement="false";
	
	public boolean function onApplicationStart() {
		application.art = new model.art(); 
		return true;
	}

}
</code>

<p/>

So this Application.cfc is rather simple, but you can see now that I use the onApplicationStart method to create an instance of my art component in the application scope. Done. Except... now the question is - how in the heck do we <i>call</i> that component method?? You can't run a CFC stored in a variable remotely. (Although see my notes below!) This is where a new CFC comes in. I'm going to create a "service" CFC that simply acts as a proxy to my Application components. Here is my application's new structure:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip136.png" />

<p/>

You can see my new folder, remote, with a component called artservice.cfc. I should point out that the names here are purely arbitrary. I named them "nicely" of course, but there is noting special about my folder being called remote. Let's look at the CFC now.

<p/>

<code>
component {
	writelog(file="application",text="artservice.cfc created");

	remote function getHelloWorld(string name="Nameless") {
		var result = application.art.helloWorld(arguments.name);
		return result;
	}

}
</code>

<p/>

The component has one method, getHelloWorld, that wraps a call to the Application-scope art component. The method could do a bit more, additional logging, security, etc., but in this case it simply wraps the cached call. Notice too I've got my writelog here for testing. So now let's do a few hits and see what gets recorded.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip137.png" />

<p/>

On the very first hit, the one at 10:34:00, you can see art, util, and artservice are created. But notice the last entry. When I reloaded, only the artservice component was recreated. My core CFCs, the meat of my application, did not need to be recreated. This gives us some additional benefits as well. We can move our components out of the web root to be extra sure they are protected from unauthorized access. By creating a core "doorway" we can perform all kinds of other operations like I mentioned above - logging is a great one. 

<p/>

So that's the gist of it. I've got a few notes I want to share as well, but consider what follows as extra credit. I've included the source for this as an attachment to this blog entry. 

<p/>

<ul>
<li>Experienced ColdFusion users will probably want me to bring up ColdSpring. ColdSpring is an excellent tool for managing CFCs and relationships, and can actually create remote proxies <i>automatically</i>. That's hot! But as I told my boss - baby steps. 
<li>I mentioned above that when I instantiated art.cfc in the Application scope, it meant that folks could not run the CFC anymore. That's not 100% accurate. I still had the file under web root. Someone could run it. Now I did change the method access from remote to public, but what if I hadn't? If I ran the method it would try to make use of the Variables scoped util component created in init. But the init function is <b>not</b> run for remote requests! Therefore an error would occur. In general I'm a big believer in keeping <b>everything</b> possible out of web root. Only expose what you truly have to.
</ul><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fremotecfcexample%{% endraw %}2Ezip'>Download attached file.</a></p>