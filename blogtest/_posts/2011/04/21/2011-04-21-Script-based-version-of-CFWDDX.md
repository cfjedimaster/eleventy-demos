---
layout: post
title: "Script based version of CFWDDX"
date: "2011-04-21T14:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/04/21/Script-based-version-of-CFWDDX
guid: 4201
---

A couple of days ago I wrote a <a href="http://www.raymondcamden.com/index.cfm/2011/4/7/Workarounds-for-things-not-supported-in-ColdFusion-Script">blog post</a> talking about how to deal with things you couldn't do in ColdFusion scripting. As one of the examples I mentioned WDDX. For some reason I've seen multiple people in the last week or so bemoan the lack of support for a script based WDDX implementation so I thought I'd whip up the code for it.
<!--more-->
<p>

WDDX is one of those things that - like many others - ColdFusion (and Allaire) do not get proper credit for. Did you know WDDX was introduced in 1998, at the same time as XML-RPC and <i>before</i> SOAP and web services? (Reference - <a href="http://en.wikipedia.org/wiki/Wddx">Wikipedia entry</a>) At the time the concept was pretty darn cool. You take any form of data, serialize it, and you can then syndicate it to the world. This was before Ajax really took off so the use cases were more HTTP/remote focused. So a news site, for example, could offer their news feed in WDDX and another site could read it remotely and present it on their own site. There were multiple implementations of WDDX - including libraries for PHP, Ruby, Python, Java, Perl, and others - all of which were open source and free for developers to use. This would allow a PHP site to easily aggregate content being served up from a ColdFusion site - or vice versa. 

<p>

You have to admit - that's pretty cool. ColdFusion was definitely ahead of the curve here and once again did something complex in an incredibly simple fashion. While I'm not sure I'd recommend this now (I think JSON is the best format for complex data), as I said above, some people still actively use it and therefore would like to be able to use it within script based CFCs. I wrote the following component in about 5 minutes. In order to use it within your own model files you will need to inject it (ColdSpring would make this easy), or you could use something like the Helpers feature of Model-Glue.

<p>

<code>
&lt;cfcomponent output="false"&gt;

	&lt;cffunction name="toWddx" access="public" returnType="string" output="false"&gt;
		&lt;cfargument name="input" type="any" required="true"&gt;
		&lt;cfargument name="useTimezoneInfo" type="boolean" required="false" default="true"&gt;
		&lt;cfset var result = ""&gt;
		&lt;cfwddx action="cfml2wddx" input="#arguments.input#" output="result" useTimezoneInfo="#arguments.useTimezoneInfo#"&gt;
		&lt;cfreturn result&gt;
		
	&lt;/cffunction&gt;

	&lt;cffunction name="toCFML" access="public" returnType="any" output="false"&gt;
		&lt;cfargument name="input" type="any" required="true"&gt;
		&lt;cfargument name="validate" type="boolean" required="false" default="false"&gt;
		
		&lt;cfset var result = ""&gt;
		&lt;cfwddx action="wddx2cfml" input="#arguments.input#" output="result" validate="#arguments.validate#"&gt;
		&lt;cfreturn result&gt;
		
	&lt;/cffunction&gt;
	
&lt;/cfcomponent&gt;
</code>

<p>

And here is a simple example usage. I didn't actually use cfscript, but you can see how it would work:

<p>

<code>
&lt;cfset s = {% raw %}{ name="Ray", age=38, foo=[1,2,3,{x="1",y="2"}{% endraw %}]}&gt;
&lt;cfdump var="#s#" label="original data structure"&gt;

&lt;cfset wddx = new wddx()&gt;
&lt;cfset encoded = wddx.toWddx(s)&gt;
&lt;cfoutput&gt;#htmlEditFormat(encoded)#&lt;/cfoutput&gt;
&lt;p&gt;
&lt;cfset data = wddx.toCFML(encoded)&gt;
&lt;cfdump var="#data#" label="After to wddx and back again..."&gt;
</code>

<p>

And the result...

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip72.png" />

<p>

Please consider the following code licensed under Apache License V2.