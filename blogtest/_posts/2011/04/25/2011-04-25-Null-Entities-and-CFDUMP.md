---
layout: post
title: "Null, Entities, and CFDUMP"
date: "2011-04-25T19:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/04/25/Null-Entities-and-CFDUMP
guid: 4207
---

Earlier today I was working with an ORM entity that threw an error when I tried to persist it. Unfortunately it was a very vague error about an empty string trying to be cast as an integer. I've already logged a bug report on this. ColdFusion knows what property is wrong it just doesn't report it in the error. That being said I still had a problem. My entity had close to 60 properties. That's a crap load. (Technical term.) I quickly added code to cfdump the entity to the file system and opened it up in my browser and noticed that many values which should have been null were reported as empty strings. I could have sworn cfdump supported nulls so I decided to write up a quick test.
<!--more-->
<p>

I began with a simple, non-ORM based test.

<p>

<code>
&lt;cfset s = {% raw %}{name="ray", age=javacast("null","") }{% endraw %}&gt;

&lt;cfdump var="#s#"&gt;
</code>

<p>

This returned...

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip74.png" />

<p>

Yep - nulls are supported. So I then whipped up a super simple persistent CFC.

<p>

<code>
component persistent="true" {
	property name="id" column="personID" fieldtype="id" generator="native";
	property name="firstname" ormtype="string";
	property name="lastname" ormtype="string";
	property name="age" ormtype="int";

}
</code>

<p>

Then wrote this test:

<p>

<code>
&lt;cfset foo = entityNew("person", {% raw %}{firstname="bob",lastname=""}{% endraw %})&gt;

&lt;cfdump var="#foo#"&gt;
</code>

<p>

Check out the difference:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip75.png" />

<p>

As you can see, there is no difference between lastname and age, even though they are clearly <i>very</i> different. I then wrote up another test.

<p>

<code>
&lt;cfset foo = entityNew("person", {% raw %}{firstname="bob",lastname=""}{% endraw %})&gt;

&lt;cfset props = getMetaData(foo).properties&gt;
&lt;cfloop index="prop" array="#props#"&gt;
	&lt;cfif structKeyExists(prop, "name")&gt;
		&lt;cfoutput&gt;Testing property #prop.name# = 
		&lt;cfinvoke component="#foo#" method="get#prop.name#" returnvariable="res"&gt;
		&lt;cfif isNull(res)&gt;
			NULL
		&lt;cfelseif isSimpleValue(res)&gt;
			#res#
		&lt;cfelse&gt;
			complex
		&lt;/cfif&gt;
		&lt;br/&gt;
		&lt;/cfoutput&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

<p>

As you can see, I get the metadata and then loop over all of the properties and call the getter. I then look at the response. When I run this I get...

<p>

<blockquote>
Testing property id = NULL 
Testing property firstname = bob 
Testing property lastname = 
Testing property age = NULL 
</blockquote>

<p>

I ran this on my 50+ property ORM entity and was able to find two properties that had been accidentally set to "" instead of a null value. I've logged a bug for this if you want to vote for it: <a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=86880">86880</a> I'd imagine this could be fixed in cfdump in about 60 seconds if the code was unencrypted.