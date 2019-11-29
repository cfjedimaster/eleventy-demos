---
layout: post
title: "Disabling CFC auto documentation"
date: "2010-12-20T09:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/12/20/Disabling-CFC-auto-documentation
guid: 4059
---

I shared a few emails back and forth with a reader last week who had an interesting problem. They had CFCs under web root that he did not want to be auto-described. If you don't know what I'm talking about, this is the feature within ColdFusion where if you request a CFC without a method you get a description of the methods and properties. This is normally protected by a login if your CF Administrator has either a normal or RDS password, as seen below.
<!--more-->
<p>

<img src="https://static.raymondcamden.com/images/ScreenClip2.png" />

<p>

So the question is - is there a way to disable or block this behavior? While it's not a security risk per se - you would need a valid login to see anything (*) - the reader wanted absolutely nothing to show up based on certain conditions. Here are a few options you can consider.

<p>

1) Within your CFC you could actually detect the lack of a method call and add one yourself. I learned of this trick from Mark Drew.

<p>

<code>
component {

	if(!structKeyExists(url, "method")) {
		url.method="helloworld";
	}
		
	remote function helloworld() {
		return "Hello Programs";
	}

}
</code>

<p>

This code could use additional logic to check remote IP, time of day, whatever. Or - as the original reader wanted - you could return a header specifying a 404 error. How about another option?

<p>

2) The first example works - but requires every CFC to be updated. You could add such logic to a base component easily enough - and in theory - your publicly accessible CFCs are probably a small subset of your total set of CFCs. But what about blocking it at the 'viewer' application? You may not know this, but the CFC describer tool is a set of CFMs/CFCs found within your /CFIDE/componentutils folder. Unlike most of the CF code that ships in /CFIDE these files are unencrypted. This means you can open up the Application.cfm file and do whatever you want. So for example, you can cflocate to a 404 handler based on whatever rules you have in mind. 

<p>

p.s. Technically - just because you've locked down a CFC's auto descriptor does not mean you've really locked it down. Consider my CFC above where I auto set a method. If I add ?wsdl to the end I get the WSDL for the component. This will describe all the remote functions of the CFC. You could do something like this:

<p>

<code>
if(cgi.query_string == "wsdl") abort;
</code>

<p>

Which throws an error when CF tries to generate the WSDL code. The error may be preferable to you though. Would it would be nice if you could turn off the auto descriptor/auto Web Service support?