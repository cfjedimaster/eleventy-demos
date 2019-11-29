---
layout: post
title: "Simple proof of concept - UML Generator"
date: "2009-12-14T10:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/14/Simple-proof-of-concept-UML-Generator
guid: 3647
---

I was talking with <a href="http://www.briankotek.com/blog/">Brian Kotek</a> recently about a particular design issue when he suggested I make use of <a href="http://yuml.me">yUML</a>. This is an online service that allows you to dynamically generate UML documents. UML is <i>not</i> something that I'm really into. I can see the benefits of it, but I just haven't felt the need yet to make it part of my development process. That being said, I thought it was pretty cool how yUML allowed you to generate a UML picture straight from a URL. If you look at their <a href="http://yuml.me/diagram/scruffy/class/samples">samples</a> page, you can see how they go from a simple URL "api" to a generate graphic. 

Based on that, I decided to see if I could whip up some code to examine a CFC and generate the URL. While this isn't completely useful (it only works with one CFC and doesn't handle relationships), it was fun and I thought someone may be able to play with it more. Here is the script I came up with:
<!--more-->
<code>

&lt;cfset meta = getComponentMetadata("test")&gt;
&lt;cfdump var="#meta#" expand="false"&gt;

&lt;cfset modifiers = {% raw %}{public="+",protected="##",private="-",package="~",remote="+"}{% endraw %}&gt;

&lt;cfset rooturl = "http://yuml.me/diagram/scrufy/class/"&gt;

&lt;!--- Name ---&gt;
&lt;cfset rooturl &= "[" & urlEncodedFormat(meta.name) & "|"&gt;

&lt;!--- Properties ---&gt;
&lt;cfloop index="x" from="1" to="#arrayLen(meta.properties)#"&gt;
	&lt;cfset p = meta.properties[x]&gt;
	&lt;!--- all properties are public ---&gt;
	&lt;cfset rooturl &= "#urlEncodedFormat(modifiers.public)##p.name#;"&gt;
&lt;/cfloop&gt;

&lt;!--- Methods---&gt;
&lt;cfif arrayLen(meta.functions)&gt;
	&lt;cfset rooturl &= "|"&gt;
&lt;/cfif&gt;

&lt;cfloop index="x" from="1" to="#arrayLen(meta.functions)#"&gt;
	&lt;cfset f = meta.functions[x]&gt;
	&lt;cfif not structKeyExists(f, "access")&gt;
		&lt;cfset f.access = "public"&gt;
	&lt;/cfif&gt;
	&lt;cfset rooturl &= "#urlEncodedFormat(modifiers[f.access])##f.name#();"&gt;
&lt;/cfloop&gt;

&lt;cfset rooturl &= "]"&gt;

&lt;cfoutput&gt;
#rooturl#&lt;br/&gt;
&lt;img src="#rooturl#"&gt;
&lt;/cfoutput&gt;
</code>

Going from top to bottom, you can see I get the metadata for a CFC called test. If this code were converted into a UDF you would want to simply make that portion dynamic. I create a structure that maps ColdFusion's access modifiers into the symbols that yUML will use to generate the UML graphic. Since remote doesn't make sense in this context, I mapped it to public. 

After that, it's simply then a matter of looping over the metadata. I start off with the properties and then handle the methods. Given this input:

<code>
&lt;cfcomponent persistent="true"&gt;

&lt;cfproperty name="foo" ormtype="string"&gt;
&lt;cfproperty name="goo" ormtype="string"&gt;
&lt;cfproperty name="aaa" ormtype="string"&gt;


&lt;cffunction name="privatetest" access="private"&gt;
&lt;/cffunction&gt;

&lt;cffunction name="publictest" access="public"&gt;
&lt;/cffunction&gt;

&lt;cffunction name="packagetest" access="package"&gt;
&lt;/cffunction&gt;

&lt;cffunction name="remotetest" access="remote"&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

The output is:

<img src="http://yuml.me/diagram/scrufy/class/[test{% raw %}|%2Bfoo;%{% endraw %}2Bgoo;{% raw %}%2Baaa;|{% endraw %}{% raw %}%2Dprivatetest();%{% endraw %}7Epackagetest();{% raw %}%2BSETGOO();%{% endraw %}2BSETAAA();{% raw %}%2Bremotetest();%{% endraw %}2BGETAAA();{% raw %}%2Bpublictest();%{% endraw %}2BGETGOO();{% raw %}%2BGETFOO();%{% endraw %}2BSETFOO();]">

It would probably be nice to sort the values (one thing I wish cfdump would do for CFCs). Handling relationships should - in theory - be possible. You just want to ensure you don't get into an infinite recursion loop with bidirectional relationships.