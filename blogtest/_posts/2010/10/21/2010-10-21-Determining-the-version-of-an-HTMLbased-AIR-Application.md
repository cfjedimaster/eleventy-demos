---
layout: post
title: "Determining the version of an HTML-based AIR Application"
date: "2010-10-21T15:10:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/10/21/Determining-the-version-of-an-HTMLbased-AIR-Application
guid: 3979
---

Earlier today a subscriber on the <a href="http://groups.google.com/group/air-html-js">AIR with HTML and JS</a> listserv asked about how one could get the current version of an AIR application from within the application itself. AIR stores the version number in the application.xml file. This is a free-form value that can be anything (number, string, etc.) A quick Google search turned out this perfect tip: <a href="http://inflagrantedelicto.memoryspiral.com/2009/02/quick-tip-display-application-version-in-your-air-app/">Quick Tip: Display Application Version in your AIR App</a> This worked, but I wanted to mock up a quick HTML version. Unfortunately dealing with XML in JavaScript kind of makes me want to throw up a little. I think ColdFusion has got me spoiled. But once I figured out the syntax (thank you again <a href="http://www.w3schools.com/Xml/xml_dom.asp">W3 Schools</a>) I was able to whip up the following demo.
<!--more-->
<p/>

<code>

&lt;!--
Credit goes to Joseph Labrecque: http://inflagrantedelicto.memoryspiral.com/2009/02/quick-tip-display-application-version-in-your-air-app/
--&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;New Adobe AIR Project&lt;/title&gt;
        &lt;script type="text/javascript" src="lib/air/AIRAliases.js"&gt;&lt;/script&gt;
        &lt;script&gt;
		function init() {
			var appdesc = air.NativeApplication.nativeApplication.applicationDescriptor;			
			parser=new DOMParser();
			xmlDoc=parser.parseFromString(appdesc,"text/xml");
			version = xmlDoc.getElementsByTagName("version")[0];
			air.trace(version.textContent);
			document.getElementById("version").innerText = version.textContent;
		}
		&lt;/script&gt;
    &lt;/head&gt;
    &lt;body onload="init()"&gt;
	
	&lt;h1&gt;KnowThyself&lt;/h1&gt;
	
	&lt;p&gt;
	Hello, you are running version &lt;span id="version"&gt;&lt;/span&gt; of the application.
	&lt;/p&gt;
	
    &lt;/body&gt;
&lt;/html&gt;
</code>

<p/>

The application simply loads up the XML via the NativeApplication object. This is a string, and while we could parse it using regex, I went ahead and did it the "XML" way and converted it to a proper object. Once done it is pretty trivial to get the version. (Again, once you remind yourself how XML stuff is manipulated in JavaScript.) When the application loads, whatever you have in your application.xml for version will show up in the span.

<p/>

<img src="https://static.raymondcamden.com/images/screen21.png" />

<p/>