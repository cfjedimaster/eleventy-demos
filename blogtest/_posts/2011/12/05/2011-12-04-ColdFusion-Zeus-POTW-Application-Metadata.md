---
layout: post
title: "ColdFusion Zeus POTW: Application Metadata"
date: "2011-12-05T08:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/12/05/ColdFusion-Zeus-POTW-Application-Metadata
guid: 4454
---

Time for another quick ColdFusion Zeus preview. This one will probably be of lesser value to some folks, but it addresses an issue I've been raising for <i>years</i>, and that is:
<p/>
<!--more-->
<b>If ColdFusion knows something, I should know it.</b>
<p/>
Simple enough concept, right? However, it's not been easy to discover simple, trivial things about your environment unless you were willing to hack around it. Here's an incredibly trivial example: Session Management. How would you know if sessions were enabled for the current request? Currently you can't unless you try to set or read a Session variable and wrap the call with a try and catch. I love ColdFusion, but I have no qualms about calling that <b>stupid</b>. 
<p>
ColdFusion Zeus addresses this by exposing a new function, getApplicationMetaData, that returns settings about the current application. To be clear, it does not return application variables. Remember that the Application scope is a structure you can introspect easily enough. Instead, getApplicationMetaData will return current settings for the active application. Here's a quick example (and I snuck in a few things here too that are new):

<p>

<code>
component {
	this.name="moo";
	this.sessionManagement="true";
	this.datasource="cfartgallery";

	this.mappings = {
				"/foo":expandPath("./")
					};

	this.customtagpaths=expandPath("./");
	
	this.sessioncookies.httpOnly = true;

	this.invokeImplicitAccessor = true;

	this.inmemoryfilesystem.enabled = true;
	this.inmemoryfilesystem.size = 10;
}
</code>

<p>

And then here is my test template:

<p>

<code>
&lt;cfdump var="#getApplicationMetaData()#" label="get Application Metadata"&gt;
</code>

<p>

And the result:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip242.png" />

<p>

So - how useful is this? Probably not very. Those of us working with open source libraries or those who ship packaged solutions though can <i>really</i> make good use of this. And darnit - ColdFusion knows this info, so should we!

<p>

p.s. If you look at the Application.cfc file above, you may notice a few new things. I'm not going to talk about all of them, but I will address one:

<p>

<code>
this.inmemoryfilesystem.enabled = true;
this.inmemoryfilesystem.size = 10;
</code>

<p>

In ColdFusion Zeus, you can now use the VFS on a <b>per Application basis</b>. That means an Application can use a vfs folder like ram://info and not worry about another application using the same folder. Your virtual files and folders are 100% black boxes into your Application-memory space. You can also configure your own size too. Nice.